from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import LeaveRequest, User
from app.schemas import LeaveRequestCreate, LeaveRequestResponse, LeaveApprovalRequest
from app.dependencies import get_current_user, require_role
from datetime import date

router = APIRouter(prefix="/leave", tags=["leave"])


@router.post("/apply", response_model=LeaveRequestResponse)
def apply_for_leave(
    leave_data: LeaveRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ["employee", "manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employees and managers can apply for leave"
        )
    
    if leave_data.from_date > leave_data.to_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="From date must be before or equal to to date"
        )
    
    new_leave = LeaveRequest(
        employee_id=current_user.id,
        department=current_user.department,
        from_date=leave_data.from_date,
        to_date=leave_data.to_date,
        reason=leave_data.reason,
        status="Pending"
    )
    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)
    return new_leave


@router.get("/my", response_model=list[LeaveRequestResponse])
def get_my_leaves(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    leaves = db.query(LeaveRequest).filter(
        LeaveRequest.employee_id == current_user.id
    ).order_by(LeaveRequest.from_date.desc()).all()
    return leaves


@router.get("/pending", response_model=list[LeaveRequestResponse])
def get_pending_leaves(
    current_user: User = Depends(require_role("manager")),
    db: Session = Depends(get_db)
):
    pending_leaves = db.query(LeaveRequest).filter(
        LeaveRequest.department == current_user.department,
        LeaveRequest.status == "Pending"
    ).join(User).order_by(LeaveRequest.from_date).all()
    
    return [
        LeaveRequestResponse(
            id=l.id,
            employee_id=l.employee_id,
            department=l.department,
            from_date=l.from_date,
            to_date=l.to_date,
            reason=l.reason,
            status=l.status,
            employee_name=l.employee.name
        ) for l in pending_leaves
    ]


@router.post("/approve", response_model=LeaveRequestResponse)
def approve_leave(
    approval: LeaveApprovalRequest,
    current_user: User = Depends(require_role("manager")),
    db: Session = Depends(get_db)
):
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == approval.leave_id).first()
    if not leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found"
        )
    
    if leave.department != current_user.department:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only approve leaves from your department"
        )
    
    if leave.status != "Pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Leave request is not pending"
        )
    
    if approval.status not in ["Approved", "Rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be 'Approved' or 'Rejected'"
        )
    
    leave.status = approval.status
    db.commit()
    db.refresh(leave)
    return leave
