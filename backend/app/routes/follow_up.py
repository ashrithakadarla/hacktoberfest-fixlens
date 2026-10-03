from fastapi import APIRouter, HTTPException, status
from app.models.schema import FollowUpRequest, FollowUpResponse
from app.services.gemini_service import answer_follow_up_question

router = APIRouter()

@router.post("/follow-up", response_model=FollowUpResponse)
async def follow_up_question(payload: FollowUpRequest):
    """
    Follow-up question endpoint retaining diagnostic context and original image.
    """
    if not payload.question or not payload.question.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question text cannot be empty."
        )

    try:
        response = await answer_follow_up_question(
            question=payload.question,
            diagnosis=payload.diagnosis,
            description=payload.description,
            category=payload.category,
            image_base64=payload.image_base64
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process follow-up question. Please try rephrasing."
        )
