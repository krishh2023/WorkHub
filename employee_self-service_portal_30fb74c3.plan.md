---
name: Employee Self-Service Portal
overview: Build a full-stack Employee Self-Service Portal with React frontend, FastAPI backend, role-based access control, leave management, AI recommendations, dashboard personalization, and Echo chatbot. The system will be Dockerized and ready for demo.
todos: []
---

# Employee Self-Service Portal Implementation Plan

## Architecture Overview

The application follows a standard three-tier architecture:

- **Frontend**: React with responsive design (MUI or Tailwind)
- **Backend**: FastAPI with SQLAlchemy ORM
- **Database**: SQLite (development-ready, easily upgradeable)

## Project Structure

```
WorkHub/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── config.py             # Configuration settings
│   │   ├── database.py           # SQLAlchemy setup
│   │   ├── models.py             # Database models
│   │   ├── schemas.py            # Pydantic schemas
│   │   ├── auth.py               # JWT authentication logic
│   │   ├── dependencies.py       # FastAPI dependencies
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── auth.py           # Login/register endpoints
│   │       ├── users.py          # User management
│   │       ├── dashboard.py      # Dashboard data & config
│   │       ├── leave.py          # Leave management
│   │       ├── admin.py          # HR admin operations
│   │       ├── recommendations.py # AI recommendations
│   │       └── chatbot.py        # Echo chatbot
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── EmployeeDashboard.jsx
│   │   │   │   ├── ManagerDashboard.jsx
│   │   │   │   ├── HRDashboard.jsx
│   │   │   │   ├── DashboardCard.jsx
│   │   │   │   └── PersonalizationPanel.jsx
│   │   │   ├── Leave/
│   │   │   │   ├── LeaveApplication.jsx
│   │   │   │   ├── LeaveList.jsx
│   │   │   │   └── LeaveApproval.jsx
│   │   │   ├── Admin/
│   │   │   │   ├── UserManagement.jsx
│   │   │   │   ├── ComplianceManagement.jsx
│   │   │   │   └── LearningManagement.jsx
│   │   │   ├── Chatbot/
│   │   │   │   └── Echo.jsx
│   │   │   └── common/
│   │   │       ├── Navbar.jsx
│   │   │       └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   └── api.js            # API client with JWT handling
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication state
│   │   └── utils/
│   │       └── constants.js
│   ├── package.json
│   ├── vite.config.js            # Vite config with proxy
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Implementation Phases

### Phase 1: Backend Foundation

#### 1.1 Database Models ([backend/app/models.py](backend/app/models.py))

- **User**: id, name, email, password_hash, role, department, skills (JSON)
- **LeaveRequest**: id, employee_id, department, from_date, to_date, reason, status
- **CompliancePolicy**: id, title, department, due_date, description
- **LearningContent**: id, title, tags (JSON), level, description
- **DashboardConfig**: user_id, show_leaves, show_learning, show_compliance

#### 1.2 Authentication System ([backend/app/auth.py](backend/app/auth.py))

- Password hashing with bcrypt
- JWT token generation (access token with role + department + user_id)
- Token validation middleware
- Role-based dependency injection

#### 1.3 API Endpoints

**Auth Router** ([backend/app/routers/auth.py](backend/app/routers/auth.py)):

- `POST /auth/login` - Returns JWT token
- `POST /auth/register` - Create new user (HR only or open for demo)

**User Router** ([backend/app/routers/users.py](backend/app/routers/users.py)):

- `GET /me` - Current user profile
- `GET /users/{id}` - Get user by ID (with department check for managers)

**Dashboard Router** ([backend/app/routers/dashboard.py](backend/app/routers/dashboard.py)):

- `GET /dashboard` - Aggregated dashboard data based on role
- `POST /dashboard/config` - Save personalization preferences

**Leave Router** ([backend/app/routers/leave.py](backend/app/routers/leave.py)):

- `POST /leave/apply` - Employee creates leave request
- `GET /leave/my` - Employee's own leave requests
- `GET /leave/pending` - Manager's pending requests (department-filtered)
- `POST /leave/approve` - Manager approves/rejects (with validation)

**Admin Router** ([backend/app/routers/admin.py](backend/app/routers/admin.py)):

- `POST /admin/user` - Create employee (HR only)
- `DELETE /admin/user/{id}` - Delete user (HR only)
- `POST /admin/compliance` - Add compliance policy
- `POST /admin/learning` - Add learning content

**Recommendations Router** ([backend/app/routers/recommendations.py](backend/app/routers/recommendations.py)):

- `GET /recommendations` - AI-driven recommendations based on role, department, skills

**Chatbot Router** ([backend/app/routers/chatbot.py](backend/app/routers/chatbot.py)):

- `POST /chatbot/echo` - Echo chatbot endpoint (rule-based responses)

#### 1.4 Access Control Logic

- Dependency functions in [backend/app/dependencies.py](backend/app/dependencies.py):
  - `get_current_user` - Validates JWT and returns user
  - `require_role(role)` - Ensures user has specific role
  - `require_manager_department` - Ensures manager can only access their department

### Phase 2: Frontend Foundation

#### 2.1 Setup & Routing

- React Router for navigation
- AuthContext for global authentication state
- API service with axios interceptors for JWT handling
- Protected route wrapper component

#### 2.2 Authentication UI ([frontend/src/components/Login.jsx](frontend/src/components/Login.jsx))

- Email/password form
- Error handling
- Redirect to dashboard on success

#### 2.3 Dashboard Components

**Employee Dashboard** ([frontend/src/components/Dashboard/EmployeeDashboard.jsx](frontend/src/components/Dashboard/EmployeeDashboard.jsx)):

- Toggleable cards: Leave Status, Learning Recommendations, Compliance Reminders
- Personalization panel (toggle switches)
- Apply leave button

**Manager Dashboard** ([frontend/src/components/Dashboard/ManagerDashboard.jsx](frontend/src/components/Dashboard/ManagerDashboard.jsx)):

- Team members list (department-filtered)
- Pending leave requests table
- Approve/Reject actions

**HR Dashboard** ([frontend/src/components/Dashboard/HRDashboard.jsx](frontend/src/components/Dashboard/HRDashboard.jsx)):

- User management interface
- Compliance policy management
- Learning content management

### Phase 3: AI Recommendations Engine

#### 3.1 Recommendation Logic ([backend/app/routers/recommendations.py](backend/app/routers/recommendations.py))

- Rule-based matching:
  - Match learning content by department and skill tags
  - Match compliance policies by department
  - Prioritize by due dates and user level
- Returns structured JSON with explanations

### Phase 4: Echo Chatbot

#### 4.1 Chatbot Component ([frontend/src/components/Chatbot/Echo.jsx](frontend/src/components/Chatbot/Echo.jsx))

- Floating chat icon
- Chat window with message history
- Rule-based response handler:
  - "How do I apply for leave?" → Instructions
  - "What compliance policies apply to me?" → Calls `/recommendations`
  - "What courses are recommended?" → Calls `/recommendations`

#### 4.2 Backend Handler ([backend/app/routers/chatbot.py](backend/app/routers/chatbot.py))

- Pattern matching for common queries
- Integration with existing APIs for dynamic responses

### Phase 5: Docker Configuration

#### 5.1 Dockerfiles

- **Backend Dockerfile**: Python 3.11, install dependencies, expose port 8000
- **Frontend Dockerfile**: Node.js, build React app, serve with nginx, expose port 3000

#### 5.2 Docker Compose ([docker-compose.yml](docker-compose.yml))

- Frontend service (port 3000)
- Backend service (port 8000)
- Volume mounts for development
- Environment variables for configuration

## Key Implementation Details

### Security

- JWT tokens expire after 24 hours
- Password hashing with bcrypt (cost factor 12)
- All role checks performed server-side
- Department filtering enforced in database queries

### Database Relationships

- User → LeaveRequest (one-to-many)
- User → DashboardConfig (one-to-one)
- No foreign keys for CompliancePolicy/LearningContent (department-based matching)

### API Response Format

```json
{
  "success": true,
  "data": {...},
  "message": "Optional message"
}
```

### Error Handling

- Standardized error responses (400, 401, 403, 404, 500)
- Frontend error boundaries for React components

## Technology Choices

- **UI Library**: Material-UI (MUI) for professional components
- **State Management**: React Context API (sufficient for scope)
- **HTTP Client**: Axios with interceptors
- **Date Handling**: Python `datetime`, JavaScript `date-fns`

## Demo Flow Implementation

1. Seed database with sample users (employee, manager, HR)
2. Login flow with JWT storage in localStorage
3. Role-based dashboard rendering
4. Leave application → Manager approval workflow
5. Dashboard personalization persistence
6. AI recommendations display
7. Echo chatbot interaction
8. Docker startup verification

## Testing Strategy

- Manual testing for demo flow
- API endpoint validation via Postman/curl
- Frontend responsive testing (laptop + mobile viewports)