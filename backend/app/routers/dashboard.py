from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, LeaveRequest, DashboardConfig, CompliancePolicy, LearningContent, LeaveBalance
from app.schemas import DashboardData, DashboardConfigUpdate, DashboardConfigResponse, LeaveRequestResponse, UserResponse
from app.dependencies import get_current_user
from datetime import date, datetime
import json

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardData)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    config = db.query(DashboardConfig).filter(DashboardConfig.user_id == current_user.id).first()
    if not config:
        config = DashboardConfig(
            user_id=current_user.id,
            show_leaves=True,
            show_learning=True,
            show_compliance=True
        )
        db.add(config)
        db.commit()
        db.refresh(config)
    
    dashboard_data = DashboardData(config=DashboardConfigResponse(
        show_leaves=config.show_leaves,
        show_learning=config.show_learning,
        show_compliance=config.show_compliance
    ))
    
    if current_user.role == "employee":
        leaves = db.query(LeaveRequest).filter(
            LeaveRequest.employee_id == current_user.id
        ).all()
        dashboard_data.leave_requests = [
            LeaveRequestResponse(
                id=l.id,
                employee_id=l.employee_id,
                department=l.department,
                from_date=l.from_date,
                to_date=l.to_date,
                reason=l.reason,
                status=l.status
            ) for l in leaves
        ]
    
    elif current_user.role == "manager":
        team_members = db.query(User).filter(
            User.department == current_user.department,
            User.role == "employee"
        ).all()
        
        today = date.today()
        current_year = datetime.now().year
        
        team_members_with_status = []
        for u in team_members:
            current_leave = db.query(LeaveRequest).filter(
                LeaveRequest.employee_id == u.id,
                LeaveRequest.status == "Approved",
                LeaveRequest.from_date <= today,
                LeaveRequest.to_date >= today
            ).first()
            
            availability_status = "On Leave" if current_leave else "Available"
            
            member_data = {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "department": u.department,
                "skills": json.loads(u.skills) if u.skills else [],
                "availability_status": availability_status,
                "current_leave": current_leave.reason if current_leave else None
            }
            team_members_with_status.append(member_data)
        
        dashboard_data.team_members = [
            UserResponse(
                id=m["id"],
                name=m["name"],
                email=m["email"],
                role=m["role"],
                department=m["department"],
                skills=m["skills"]
            ) for m in team_members_with_status
        ]
        
        pending_leaves = db.query(LeaveRequest).filter(
            LeaveRequest.department == current_user.department,
            LeaveRequest.status == "Pending"
        ).join(User).all()
        dashboard_data.pending_leaves = [
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
        
        team_stats = {
            "total_team_size": len(team_members),
            "on_leave_count": len([m for m in team_members_with_status if m["availability_status"] == "On Leave"]),
            "available_count": len([m for m in team_members_with_status if m["availability_status"] == "Available"]),
            "pending_approvals": len(pending_leaves)
        }
        dashboard_data.recommendations = team_stats
    
    return dashboard_data


@router.post("/config", response_model=DashboardConfigResponse)
def update_dashboard_config(
    config_update: DashboardConfigUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    config = db.query(DashboardConfig).filter(DashboardConfig.user_id == current_user.id).first()
    if not config:
        config = DashboardConfig(user_id=current_user.id)
        db.add(config)
    
    if config_update.show_leaves is not None:
        config.show_leaves = config_update.show_leaves
    if config_update.show_learning is not None:
        config.show_learning = config_update.show_learning
    if config_update.show_compliance is not None:
        config.show_compliance = config_update.show_compliance
    
    db.commit()
    db.refresh(config)
    return DashboardConfigResponse(
        show_leaves=config.show_leaves,
        show_learning=config.show_learning,
        show_compliance=config.show_compliance
    )
