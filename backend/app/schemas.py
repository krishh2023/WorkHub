from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    department: str
    skills: List[str] = []


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    
    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class LeaveRequestCreate(BaseModel):
    from_date: date
    to_date: date
    reason: str


class LeaveRequestResponse(BaseModel):
    id: int
    employee_id: int
    department: str
    from_date: date
    to_date: date
    reason: str
    status: str
    employee_name: Optional[str] = None
    
    class Config:
        from_attributes = True


class LeaveApprovalRequest(BaseModel):
    leave_id: int
    status: str  # Approved or Rejected


class CompliancePolicyCreate(BaseModel):
    title: str
    department: str
    due_date: date
    description: Optional[str] = None


class CompliancePolicyResponse(BaseModel):
    id: int
    title: str
    department: str
    due_date: date
    description: Optional[str] = None
    
    class Config:
        from_attributes = True


class LearningContentCreate(BaseModel):
    title: str
    tags: List[str] = []
    level: str
    description: Optional[str] = None


class LearningContentResponse(BaseModel):
    id: int
    title: str
    tags: List[str]
    level: str
    description: Optional[str] = None
    
    class Config:
        from_attributes = True


class DashboardConfigUpdate(BaseModel):
    show_leaves: Optional[bool] = None
    show_learning: Optional[bool] = None
    show_compliance: Optional[bool] = None


class DashboardConfigResponse(BaseModel):
    show_leaves: bool
    show_learning: bool
    show_compliance: bool
    
    class Config:
        from_attributes = True


class DashboardData(BaseModel):
    leave_requests: List[LeaveRequestResponse] = []
    recommendations: dict = {}
    team_members: List[UserResponse] = []
    pending_leaves: List[LeaveRequestResponse] = []
    config: Optional[DashboardConfigResponse] = None


class RecommendationResponse(BaseModel):
    learning_content: List[LearningContentResponse] = []
    compliance_policies: List[CompliancePolicyResponse] = []
    explanations: List[str] = []


class ChatbotRequest(BaseModel):
    message: str


class ChatbotResponse(BaseModel):
    response: str


class LeaveBalanceResponse(BaseModel):
    user_id: int
    user_name: str
    total_leaves: int
    used_leaves: int
    remaining_leaves: int
    year: int
    
    class Config:
        from_attributes = True


class CalendarEvent(BaseModel):
    leave_id: int
    employee_id: int
    employee_name: str
    from_date: date
    to_date: date
    reason: str
    status: str
    has_conflict: bool = False


class TeamCalendarResponse(BaseModel):
    events: List[CalendarEvent] = []
    conflicts: List[dict] = []


class BulkLeaveApprovalRequest(BaseModel):
    leave_ids: List[int]
    status: str
