# FixLens — Multimodal AI Troubleshooting Assistant

### **Show it what's wrong.**

FixLens is a multimodal AI troubleshooting assistant built for **React Hyderabad × MLH Hack Day 2026** targeting the **Best Use of Gemma 4** challenge. It uses **Gemma 4 through the Gemini API** to analyze photos of broken hardware, circuit wiring, terminal error logs, or physical assemblies—identifying root causes, distinguishing visual observations from inferences, and providing step-by-step troubleshooting instructions.

---

## 1. Product Overview

The core interaction of FixLens is:

$$\text{Show} \longrightarrow \text{Understand} \longrightarrow \text{Diagnose} \longrightarrow \text{Explain} \longrightarrow \text{Fix}$$

FixLens operates as a focused, high-precision technical diagnostic tool—not a generic AI chatbot.

- **Primary Input:** Image (Camera capture or File upload) + Optional Description + Category.
- **Multimodal Engine:** Gemma 4 via Google Gemini API.
- **Output:** Polished, structured diagnostic UI with confidence levels, visual evidence breakdown, actionable troubleshooting steps, safety warnings, "Ask Why?" reasoning, and context-aware follow-up Q&A.

---

## 2. Problem & Solution

| The Problem | FixLens Solution |
| :--- | :--- |
| Hardware makers and developers waste hours debugging visually obvious mistakes (e.g., reversed LEDs, misaligned pins, missing virtualenv packages). | FixLens visually inspects the setup image, compares observed components against expected configurations, and highlights the exact mistake instantly. |
| Generic AI chatbots hallucinate or assert unverified visual facts with fake certainty. | FixLens strictly separates **Visual Observations** (facts seen in frame) from **Inferences** (deductions), explicitly communicating uncertainty when evidence is insufficient. |
| Complex manuals lack step-by-step guidance and safety precautions. | FixLens generates ordered, interactive checklists with built-in safety warnings (e.g. disconnecting power before adjusting electrical leads). |

---

## 3. Key Features

- 📸 **Camera & Multi-Format Image Support:** Live web-camera capture modal with rear/front camera toggles, plus drag-and-drop file upload for `.jpg`, `.png`, and `.webp` images.
- ⚡ **Flagship Demo Scenarios:** Instant preset loading for:
  1. **Electronics:** Arduino Uno circuit with an incorrectly oriented LED diode.
  2. **Software:** VS Code terminal displaying `ModuleNotFoundError: No module named 'pandas'`.
  3. **Physical Object:** Mechanical bracket flange with a misaligned/cross-threaded bolt.
- 🔬 **Visual Observation vs. Inference Matrix:** Clear UI separation between directly observed facts (e.g. *"LED cathode leg connected to 5V rail"*) vs. model inferences (e.g. *"The LED polarity may be reversed"*).
- ❓ **Ask "Why?" Feature:** A dedicated modal exposing the step-by-step logical reasoning behind the diagnosis.
- 📋 **Interactive Troubleshooting Checklist:** Ordered step-by-step action plan with checkable tasks so users can track their repair progress.
- 🛡️ **Safety Guardrails:** Prominent amber/red safety callouts for high-voltage, heat, power tools, or destructive software actions.
- 🚫 **Insufficient Evidence Handler:** Prevents AI hallucinations by detecting dark, cropped, or ambiguous photos and requesting a clearer picture.
- 💬 **Contextual Follow-Up Q&A:** Bottom persistent follow-up bar that retains original diagnostic context and image evidence.

---

## 4. Why Gemma 4?

FixLens leverages **Gemma 4** through the Gemini API as its primary multimodal reasoning engine. Gemma 4 provides:
1. **High Visual Resolution Understanding:** Accurately identifying breadboard rails, pin labels, jumper wire colors, component legs, and code text in terminal screenshots.
2. **Structured JSON Output Schema:** Enforcing schema contracts (`DiagnosisResult`) for status, observations, primary issue, reasoning, steps, and missing information.
3. **Nuanced Uncertainty State:** Expressing realistic human confidence levels (*High*, *Medium*, *Low*, *Insufficient Evidence*) without fake probability calibration.

---

## 5. Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                      React 18 Frontend                      │
│     Vite + TypeScript + Tailwind CSS + Lucide Icons         │
└──────────────────────────────┬──────────────────────────────┘
                               │
            image file + description + category
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                        │
│          Python 3.14 + Pydantic + python-multipart          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                  Multimodal Analysis Prompt
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Gemma 4 (via Gemini API)                      │
│            google-genai / google-generativeai               │
└──────────────────────────────┬──────────────────────────────┘
                               │
                       Structured JSON
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               React Diagnostic UI Dashboard                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Supported Inputs

- **Categories:**
  - `Auto Detect` (Default automatic model classification)
  - `Electronics` (Circuits, microcontrollers, wiring, sensors)
  - `Computer / Software` (Terminal errors, IDE screenshots, stack traces)
  - `Physical Object` (Assembly joints, fasteners, mechanical parts)
- **Image Upload Formats:** JPG, JPEG, PNG, WEBP (Up to 12 MB).
- **Camera Capture:** WebRTC stream with environment/user camera switching.
- **Optional Context:** User text description (e.g. *"The LED isn't turning on"*).

---

## 7. Project Structure

```text
FixLens/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry & CORS
│   │   ├── models/
│   │   │   └── schema.py        # Pydantic JSON schemas
│   │   ├── prompts/
│   │   │   └── system_prompts.py# Gemma 4 diagnostic rules prompt
│   │   ├── routes/
│   │   │   ├── diagnose.py      # POST /api/diagnose
│   │   │   ├── follow_up.py     # POST /api/follow-up
│   │   │   └── health.py        # GET /api/health
│   │   └── services/
│   │       └── gemini_service.py# Gemma 4 / Gemini API integration
│   ├── requirements.txt         # Backend Python dependencies
│   └── venv/                    # Isolated Python virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx             # Branding & model telemetry
│   │   │   ├── CategorySelector.tsx   # Category pills selector
│   │   │   ├── ImageUpload.tsx        # Drag & drop upload area
│   │   │   ├── CameraModal.tsx        # Live WebRTC camera capture modal
│   │   │   ├── DemoSelector.tsx       # Flagship demo preset cards
│   │   │   ├── AnalyzingView.tsx      # Scanner loader view
│   │   │   ├── DiagnosisResultView.tsx# Main diagnostic UI
│   │   │   └── AskWhyModal.tsx        # Visual evidence reasoning modal
│   │   ├── data/
│   │   │   └── sampleDemos.ts         # Flagship demo sample images & data
│   │   ├── services/
│   │   │   └── api.ts                 # Frontend HTTP client service
│   │   ├── types/
│   │   │   └── diagnosis.ts           # TypeScript interfaces
│   │   ├── App.tsx                    # Main multi-view application
│   │   ├── index.css                  # Tailwind & scanner animations
│   │   └── main.tsx                   # React root entry
│   ├── package.json
│   └── vite.config.ts
│
├── .env.example
├── .gitignore
├── README.md
└── LICENSE
```

---

## 8. Environment Variables

Create `.env` in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMMA_MODEL=gemma-4-9b-it
HOST=0.0.0.0
PORT=8000
```

> **Note:** If `GEMINI_API_KEY` is not supplied, FixLens runs in **Local Smart Demo Mode**, allowing full offline verification of all UI views, demo scenarios, and follow-up Q&A!

---

## 9. Running Locally

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 1. Backend Setup (FastAPI)

```bash
# Navigate to project root
cd d:\Projects\FixLens

# Activate backend virtual environment (Windows PowerShell)
backend\venv\Scripts\Activate.ps1

# Or run directly using venv python:
backend\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --app-dir backend
```

The FastAPI backend will run on **`http://localhost:8000`**. You can view Swagger documentation at **`http://localhost:8000/docs`**.

### 2. Frontend Setup (React + Vite)

In a separate terminal:

```bash
cd d:\Projects\FixLens\frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev -- --port 5173
```

Open **`http://localhost:5173`** in your browser.

---

## 10. API Specification

### 1. Health Check
`GET /api/health`
**Response:**
```json
{
  "status": "ok",
  "model": "gemma-4-9b-it",
  "api_configured": true
}
```

### 2. Multimodal Diagnosis
`POST /api/diagnose`
- **Body:** `multipart/form-data`
  - `image`: File (JPG/PNG/WEBP)
  - `category`: string (e.g. `electronics`)
  - `description`: string (optional)

**Response:**
```json
{
  "category": "electronics",
  "status": "possible_issue",
  "title": "Possible reversed LED polarity",
  "confidence_level": "medium",
  "observations": [
    "Arduino Uno microcontroller board",
    "Standard 5mm LED component",
    "330-ohm resistor",
    "Breadboard setup"
  ],
  "primary_issue": "The LED polarity may be reversed (anode and cathode inverted).",
  "reasoning": "The visible LED cathode flat edge is connected towards the positive voltage rail instead of ground.",
  "recommended_steps": [
    "Disconnect power immediately.",
    "Reverse the LED legs on the breadboard.",
    "Reconnect power and test."
  ],
  "safety_note": "Disconnect power before modifying wiring to prevent short circuits.",
  "alternative_causes": [
    "Loose jumper wire connection",
    "Blown LED"
  ],
  "missing_information": []
}
```

### 3. Follow-up Question
`POST /api/follow-up`
- **Body:** `application/json`
```json
{
  "question": "Could there be another problem?",
  "diagnosis": { ... },
  "category": "electronics"
}
```

---

## 11. Safety and Limitations

- **Safety:** FixLens issues automatic safety callouts whenever hardware, high voltage, machinery, tools, or heat are detected. Users are instructed to disconnect power before modifying wiring.
- **Visual Limits:** FixLens evaluates visible evidence only and does not claim physical measurements or unverified internal continuity without visual proof.

---

## 12. Hackathon Context

- **Event:** React Hyderabad × MLH Hack Day 2026
- **Challenge:** Best Use of Gemma 4
- **Demo Time:** Under 90 seconds
