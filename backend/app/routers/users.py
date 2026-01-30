from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User
from app.schemas import UserResponse
from app.dependencies import get_current_user, require_role
import json

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    user_dict = {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "department": current_user.department,
        "skills": json.loads(current_user.skills) if current_user.skills else []
    }
    return user_dict


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "manager":
        target_user = db.query(User).filter(User.id == user_id).first()
        if not target_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        if target_user.department != current_user.department:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Can only view users in your department"
            )
        target_user.skills = json.loads(target_user.skills) if target_user.skills else []
        return target_user
    
    if current_user.role == "hr":
        target_user = db.query(User).filter(User.id == user_id).first()
        if not target_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        target_user.skills = json.loads(target_user.skills) if target_user.skills else []
        return target_user
    
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    current_user.skills = json.loads(current_user.skills) if current_user.skills else []
    return current_user


@router.get("", response_model=List[UserResponse])
def get_all_users(
    current_user: User = Depends(require_role("hr")),
    db: Session = Depends(get_db)
):
    users = db.query(User).all()
    for user in users:
        user.skills = json.loads(user.skills) if user.skills else []
    return users
