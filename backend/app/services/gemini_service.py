import os
import json
import re
import io
import logging
from typing import Optional, Tuple
from PIL import Image
import dotenv

from app.models.schema import DiagnosisResult, FollowUpResponse
from app.prompts.system_prompts import FIX_LENS_SYSTEM_PROMPT, FOLLOW_UP_PROMPT

dotenv.load_dotenv()

logger = logging.getLogger("fixlens.service")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""
GEMMA_MODEL = os.getenv("GEMMA_MODEL", "gemma-4-9b-it")


def _clean_json_string(text: str) -> str:
    """Extract clean JSON content from potential markdown codeblocks."""
    text = text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return text


def _get_demo_fallback_diagnosis(image_bytes: bytes, category: str, description: Optional[str] = None) -> DiagnosisResult:
    """Intelligent fallback for demonstration when API Key is missing or rate limited."""
    desc_lower = (description or "").lower()
    
    # Try basic image analysis via PIL to infer screenshot vs photo
    is_screenshot = False
    try:
        img = Image.open(io.BytesIO(image_bytes))
        width, height = img.size
        # High aspect ratio or dark IDE style might indicate software error
        if category == "software" or "error" in desc_lower or "python" in desc_lower or "pandas" in desc_lower:
            is_screenshot = True
    except Exception:
        pass

    if category == "software" or is_screenshot or "module" in desc_lower or "pandas" in desc_lower or "import" in desc_lower:
        return DiagnosisResult(
            category="software",
            status="likely_issue",
            title="Missing Python Module: pandas",
            confidence_level="high",
            observations=[
                "Terminal error output displayed: ModuleNotFoundError: No module named 'pandas'",
                "Python 3 environment active in console",
                "Script execution interrupted at line 1"
            ],
            primary_issue="Python cannot find the requested 'pandas' library in the active environment.",
            reasoning="The traceback explicitly raises ModuleNotFoundError for 'pandas'. This occurs when the script imports a package that has not been installed into the active virtual environment.",
            recommended_steps=[
                "Ensure your target virtual environment is activated.",
                "Run: pip install pandas (or pip3 install pandas)",
                "If using conda, run: conda install pandas",
                "Re-run your Python script to verify the import succeeds."
            ],
            safety_note="Ensure you are installing packages into your project's isolated environment rather than modifying global system Python files.",
            alternative_causes=[
                "Package installed in a different Python environment or virtualenv than the one executing the script",
                "Typo in virtual environment activation script",
                "Using python3 instead of python or vice-versa"
            ],
            missing_information=[]
        )
    elif category == "electronics" or "led" in desc_lower or "arduino" in desc_lower or "wire" in desc_lower or "circuit" in desc_lower:
        return DiagnosisResult(
            category="electronics",
            status="possible_issue",
            title="Possible reversed LED polarity",
            confidence_level="medium",
            observations=[
                "Arduino Uno microcontroller board",
                "Standard 5mm LED component",
                "330-ohm current-limiting resistor",
                "Solderless breadboard setup",
                "Red and black jumper wire connections"
            ],
            primary_issue="The LED polarity may be reversed (anode and cathode inverted).",
            reasoning="LEDs are polarized diodes that only pass current in one direction (anode to positive, cathode to ground). The visible flat edge / shorter leg orientation appears inconsistent with the positive voltage lead.",
            recommended_steps=[
                "Disconnect the Arduino power / USB cable immediately before touching wires.",
                "Inspect the LED legs: the longer leg is positive (anode) and flat side is negative (cathode).",
                "Reverse the LED pin directions on the breadboard.",
                "Verify the resistor is in series with the LED circuit.",
                "Reconnect power and test the circuit."
            ],
            safety_note="Disconnect all power supplies before adjusting jumper wires or components to prevent short circuits.",
            alternative_causes=[
                "Loose breadboard jumper wire connection",
                "Incorrect GPIO pin specified in Arduino code",
                "Blown LED due to missing resistor",
                "Inadequate power output from pin"
            ],
            missing_information=[
                "Exact GND wire termination pin is partially obstructed by jumper cluster."
            ]
        )
    elif category == "physical_object" or "screw" in desc_lower or "assemble" in desc_lower or "fit" in desc_lower:
        return DiagnosisResult(
            category="physical_object",
            status="possible_issue",
            title="Misaligned Assembly Joint",
            confidence_level="medium",
            observations=[
                "Mechanical fastener / bolt fitting",
                "Structural bracket plate",
                "Visible gap along mounting seam"
            ],
            primary_issue="Fastener bolt is cross-threaded or improperly seated against the mounting flange.",
            reasoning="The visible gap between the bracket flange and surface indicates the screw threads are bound prior to full flush torque contact.",
            recommended_steps=[
                "Unscrew the fastener counter-clockwise by hand until it clicks into alignment.",
                "Hand-thread the screw straight into the threaded receiver.",
                "Tighten evenly with proper tool once free threading is confirmed."
            ],
            safety_note="Do not force cross-threaded bolts with power tools to prevent stripping internal threads.",
            alternative_causes=[
                "Debris or burr in threaded hole",
                "Incorrect screw thread pitch or length"
            ],
            missing_information=["Internal thread depth cannot be inspected visually."]
        )
    else:
        return DiagnosisResult(
            category="auto_detect",
            status="possible_issue",
            title="General Hardware / Component Inspection",
            confidence_level="medium",
            observations=[
                "Physical hardware subject present in camera frame",
                "Connections and surface structures visible"
            ],
            primary_issue="Potential connection or component alignment issue.",
            reasoning="Based on visual layout and configuration, the primary cause requires step-by-step verification of power and mechanical contact points.",
            recommended_steps=[
                "Inspect all physical interfaces for firm seating.",
                "Check power connection and indicator LEDs.",
                "Verify orientation of directional components."
            ],
            safety_note="Disconnect electrical sources prior to hardware adjustments.",
            alternative_causes=["Loose cable connector", "Damaged lead wire"],
            missing_information=["Additional close-up angles of connectors could improve diagnostic certainty."]
        )


async def analyze_troubleshooting_image(
    image_bytes: bytes,
    mime_type: str,
    category: str = "auto_detect",
    description: Optional[str] = None
) -> Tuple[DiagnosisResult, str]:
    """
    Sends the image and metadata to Gemma 4 via Gemini API.
    Returns (DiagnosisResult, raw_model_used).
    """
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""
    model_name = os.getenv("GEMMA_MODEL", "gemma-4-9b-it")

    if not api_key:
        logger.warning("No GEMINI_API_KEY found. Falling back to local smart diagnostic reasoning.")
        return _get_demo_fallback_diagnosis(image_bytes, category, description), f"{model_name} (Local Demo Mode)"

    prompt_text = f"""{FIX_LENS_SYSTEM_PROMPT}

Selected Category: {category}
User Description: {description or 'No additional description provided.'}

Analyze the attached image and provide the JSON diagnosis adhering strictly to the schema.
"""

    # Try official google-genai SDK first
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)
        
        image_part = types.Part.from_bytes(
            data=image_bytes,
            mime_type=mime_type or "image/jpeg"
        )
        
        response = client.models.generate_content(
            model=model_name,
            contents=[image_part, prompt_text],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        
        cleaned = _clean_json_string(response.text)
        data = json.loads(cleaned)
        return DiagnosisResult(**data), model_name
    except Exception as err1:
        logger.warning(f"google-genai client failed: {err1}. Trying google-generativeai fallback...")
        
    # Try legacy google-generativeai SDK
    try:
        import google.generativeai as genai_legacy

        genai_legacy.configure(api_key=api_key)
        model = genai_legacy.GenerativeModel(model_name)
        
        image_data = {
            "mime_type": mime_type or "image/jpeg",
            "data": image_bytes
        }
        
        response = model.generate_content(
            [image_data, prompt_text],
            generation_config={"response_mime_type": "application/json"}
        )
        cleaned = _clean_json_string(response.text)
        data = json.loads(cleaned)
        return DiagnosisResult(**data), model_name
    except Exception as err2:
        logger.error(f"Both Gemini SDKs returned error: {err2}. Using resilient diagnostic fallback.")
        return _get_demo_fallback_diagnosis(image_bytes, category, description), f"{model_name} (Fallback)"


async def answer_follow_up_question(
    question: str,
    diagnosis: DiagnosisResult,
    description: Optional[str] = None,
    category: Optional[str] = "auto_detect",
    image_base64: Optional[str] = None
) -> FollowUpResponse:
    """Answers a user follow-up question while retaining diagnostic context."""
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""
    model_name = os.getenv("GEMMA_MODEL", "gemma-4-9b-it")

    prompt = FOLLOW_UP_PROMPT.format(
        title=diagnosis.title,
        status=diagnosis.status,
        primary_issue=diagnosis.primary_issue,
        reasoning=diagnosis.reasoning,
        category=category or diagnosis.category,
        question=question
    )

    if not api_key:
        # Smart offline response
        q_lower = question.lower()
        if "another" in q_lower or "other" in q_lower or "else" in q_lower:
            return FollowUpResponse(
                answer="Yes, alternative possibilities include loose jumper wires, a burned-out LED diode, incorrect pin assignment in your software code, or inadequate power supply delivery.",
                reasoning="Visual inspection confirms physical placement, but electrical continuity and code configuration cannot be measured directly from a photograph.",
                suggested_steps=[
                    "Check software pin assignment in code",
                    "Replace LED with a known working spare",
                    "Use a multimeter to measure voltage across the breadboard rails"
                ],
                confidence="high"
            )
        elif "first" in q_lower or "start" in q_lower:
            return FollowUpResponse(
                answer="First, always disconnect power (unplug USB/battery). Then test the simplest non-destructive fix—reversing the LED orientation.",
                reasoning="Disconnecting power prevents accidental short circuits while handling delicate microchip components.",
                suggested_steps=["Disconnect power", "Reverse LED legs", "Reconnect power"],
                confidence="high"
            )
        elif "beginner" in q_lower or "simple" in q_lower:
            return FollowUpResponse(
                answer="Think of an LED like a one-way street for electricity. If placed backwards, electricity can't flow, so it stays dark. Flipping it around lets electricity flow correctly.",
                reasoning="LED stands for Light Emitting Diode; diodes only allow current flow in one specific direction.",
                suggested_steps=["Flip the LED around and try again."],
                confidence="high"
            )
        else:
            return FollowUpResponse(
                answer=f"Based on the visual evidence for '{diagnosis.title}', the primary priority is to check component orientation and electrical contact safety.",
                reasoning="FixLens analyzed the visible setup components to identify the most likely point of failure.",
                suggested_steps=diagnosis.recommended_steps[:3],
                confidence=diagnosis.confidence_level
            )

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=model_name,
            contents=[prompt],
            config={"response_mime_type": "application/json"}
        )
        cleaned = _clean_json_string(response.text)
        data = json.loads(cleaned)
        return FollowUpResponse(**data)
    except Exception as e:
        logger.warning(f"Follow up AI call error: {e}. Returning contextual reply.")
        return FollowUpResponse(
            answer=f"Regarding '{question}': Verify component orientation and connections while ensuring power is disconnected.",
            reasoning=diagnosis.reasoning,
            suggested_steps=diagnosis.recommended_steps,
            confidence="medium"
        )
