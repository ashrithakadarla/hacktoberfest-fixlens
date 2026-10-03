from typing import List, Optional
from pydantic import BaseModel, Field


class DiagnosisResult(BaseModel):
    category: str = Field(description="Category of the problem: electronics, software, physical_object, auto_detect")
    status: str = Field(
        description="Status of diagnosis: confirmed_issue, likely_issue, possible_issue, not_enough_evidence, no_issue_detected"
    )
    title: str = Field(description="Short summary title of the diagnosis")
    confidence_level: str = Field(
        description="Human readable confidence level: high, medium, low, insufficient_evidence"
    )
    observations: List[str] = Field(
        default_factory=list,
        description="List of clearly visible components, text, codes, wiring, or physical attributes observed"
    )
    primary_issue: str = Field(description="Main identified or suspected problem")
    reasoning: str = Field(
        description="Visual evidence and step-by-step logic explaining why this conclusion was reached. Must distinguish observation from inference."
    )
    recommended_steps: List[str] = Field(
        default_factory=list,
        description="Ordered actionable troubleshooting steps to resolve or test the issue"
    )
    safety_note: Optional[str] = Field(
        default=None,
        description="Safety warnings regarding electricity, machinery, heat, tools, chemicals, software data loss, etc."
    )
    alternative_causes: List[str] = Field(
        default_factory=list,
        description="Other plausible alternative root causes if primary hypothesis is incorrect"
    )
    missing_information: List[str] = Field(
        default_factory=list,
        description="Details or angles not visible in the photo that would improve certainty"
    )


class DiagnoseFormMeta(BaseModel):
    description: Optional[str] = None
    category: Optional[str] = "auto_detect"


class FollowUpRequest(BaseModel):
    question: str
    diagnosis: DiagnosisResult
    description: Optional[str] = None
    category: Optional[str] = "auto_detect"
    image_base64: Optional[str] = None


class FollowUpResponse(BaseModel):
    answer: str
    reasoning: Optional[str] = None
    suggested_steps: List[str] = Field(default_factory=list)
    confidence: Optional[str] = "medium"


class HealthResponse(BaseModel):
    status: str
    model: str
    api_configured: bool
