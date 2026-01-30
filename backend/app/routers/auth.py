from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.models import User, DashboardConfig
from app.schemas import LoginRequest, Token, UserCreate, UserResponse
from app.auth import verify_password, get_password_hash, create_access_token
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role, "department": user.department},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    import json
    password_hash = get_password_hash(user_data.password)
    skills_json = json.dumps(user_data.skills)
    
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=password_hash,
        role=user_data.role,
        department=user_data.department,
        skills=skills_json
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    dashboard_config = DashboardConfig(
        user_id=new_user.id,
        show_leaves=True,
        show_learning=True,
        show_compliance=True
    )
    db.add(dashboard_config)
    db.commit()
    
    new_user.skills = user_data.skills
    return new_user
