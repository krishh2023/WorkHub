from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Complaint
from app.schemas import ComplaintCreate, ComplaintResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/complaints", tags=["complaints"])


@router.post("", response_model=ComplaintResponse)
def create_complaint(
    body: ComplaintCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    complaint = Complaint(
        employee_id=current_user.id,
        subject=body.subject.strip(),
        description=body.description.strip(),
        status="Open",
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return complaint


@router.get("/my", response_model=List[ComplaintResponse])
def list_my_complaints(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    complaints = (
        db.query(Complaint)
        .filter(Complaint.employee_id == current_user.id)
        .order_by(Complaint.created_at.desc())
        .all()
    )
    return complaints
