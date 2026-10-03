import os
from fastapi import APIRouter
from app.models.schema import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""
    model = os.getenv("GEMMA_MODEL", "gemma-4-9b-it")
    return HealthResponse(
        status="ok",
        model=model,
        api_configured=bool(api_key.strip())
    )
