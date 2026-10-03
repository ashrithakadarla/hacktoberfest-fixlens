from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status
from app.models.schema import DiagnosisResult
from app.services.gemini_service import analyze_troubleshooting_image

router = APIRouter()

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_FILE_SIZE = 12 * 1024 * 1024  # 12 MB


@router.post("/diagnose", response_model=DiagnosisResult)
async def diagnose_image(
    image: UploadFile = File(...),
    category: Optional[str] = Form("auto_detect"),
    description: Optional[str] = Form(None)
):
    """
    Multimodal diagnosis endpoint. Analyzes uploaded photo + description + category using Gemma 4.
    """
    if not image or not image.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An image file is required for diagnosis."
        )

    mime_type = image.content_type or "image/jpeg"
    if mime_type.lower() not in ALLOWED_MIME_TYPES and not any(image.filename.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp']):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported image format. Please upload a JPG, JPEG, PNG, or WEBP photo."
        )

    try:
        contents = await image.read()
        if len(contents) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded image file is empty."
            )

        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Image file size exceeds the 12MB limit. Please upload a smaller image."
            )

        diagnosis, model_used = await analyze_troubleshooting_image(
            image_bytes=contents,
            mime_type=mime_type,
            category=category or "auto_detect",
            description=description
        )

        return diagnosis

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="We couldn't analyze that image. Please try again or upload a clearer photo."
        )
