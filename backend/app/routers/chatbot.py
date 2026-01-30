from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import ChatbotRequest, ChatbotResponse
from app.dependencies import get_current_user
import re

router = APIRouter(prefix="/chatbot", tags=["chatbot"])


@router.post("/echo", response_model=ChatbotResponse)
def echo_chatbot(
    request: ChatbotRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    message = request.message.lower()
    
    if re.search(r"how.*apply.*leave|apply.*leave|leave.*application", message):
        return ChatbotResponse(
            response="To apply for leave, go to your dashboard and click on 'Apply for Leave'. "
                    "Fill in the from date, to date, and reason. Your manager will review and approve it."
        )
    
    if re.search(r"compliance|policy|policies", message):
        return ChatbotResponse(
            response=f"Based on your role as {current_user.role} in {current_user.department}, "
                    f"you can view relevant compliance policies in your dashboard under 'Compliance Reminders'. "
                    f"Check the recommendations section for policies that apply to you."
        )
    
    if re.search(r"course|learning|recommend|training|skill", message):
        return ChatbotResponse(
            response=f"Based on your skills and department ({current_user.department}), "
                    f"check the 'Learning Recommendations' section on your dashboard. "
                    f"The AI system recommends courses tailored to your role and expertise."
        )
    
    if re.search(r"hello|hi|hey|greet", message):
        return ChatbotResponse(
            response=f"Hello {current_user.name}! I'm Echo, your assistant. "
                    f"How can I help you today? I can assist with leave applications, "
                    f"compliance policies, and learning recommendations."
        )
    
    if re.search(r"dashboard|personalize|customize", message):
        return ChatbotResponse(
            response="You can personalize your dashboard by toggling the cards on or off. "
                    "Go to the personalization panel on your dashboard to show or hide "
                    "Leave Status, Learning Recommendations, and Compliance Reminders."
        )
    
    return ChatbotResponse(
        response="I'm Echo, your assistant. I can help you with leave applications, "
                "compliance policies, learning recommendations, and dashboard personalization. "
                "What would you like to know?"
    )
