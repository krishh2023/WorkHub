from app.database import SessionLocal, engine
from app.models import Base, User, DashboardConfig, CompliancePolicy, LearningContent
from app.auth import get_password_hash
import json

Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    users_data = [
        {
            "name": "John Employee",
            "email": "employee@company.com",
            "password": "password123",
            "role": "employee",
            "department": "Engineering",
            "skills": ["Python", "React", "Docker"]
        },
        {
            "name": "Jane Manager",
            "email": "manager@company.com",
            "password": "password123",
            "role": "manager",
            "department": "Engineering",
            "skills": ["Leadership", "Project Management"]
        },
        {
            "name": "Admin HR",
            "email": "hr@company.com",
            "password": "password123",
            "role": "hr",
            "department": "HR",
            "skills": ["HR Management", "Compliance"]
        },
        {
            "name": "Bob Developer",
            "email": "bob@company.com",
            "password": "password123",
            "role": "employee",
            "department": "Engineering",
            "skills": ["JavaScript", "Node.js"]
        },
        {
            "name": "Alice Sales",
            "email": "alice@company.com",
            "password": "password123",
            "role": "employee",
            "department": "Sales",
            "skills": ["Sales", "Communication"]
        }
    ]
    
    for user_data in users_data:
        existing = db.query(User).filter(User.email == user_data["email"]).first()
        if existing:
            # Update existing user with new password hash
            existing.password_hash = get_password_hash(user_data["password"])
            existing.name = user_data["name"]
            existing.role = user_data["role"]
            existing.department = user_data["department"]
            existing.skills = json.dumps(user_data["skills"])
            db.commit()
            user = existing
        else:
            user = User(
                name=user_data["name"],
                email=user_data["email"],
                password_hash=get_password_hash(user_data["password"]),
                role=user_data["role"],
                department=user_data["department"],
                skills=json.dumps(user_data["skills"])
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # Ensure dashboard config exists
        config = db.query(DashboardConfig).filter(DashboardConfig.user_id == user.id).first()
        if not config:
            config = DashboardConfig(
                user_id=user.id,
                show_leaves=True,
                show_learning=True,
                show_compliance=True
            )
            db.add(config)
            db.commit()
    
    compliance_policies = [
        {
            "title": "Data Privacy Policy",
            "department": "Engineering",
            "due_date": "2024-12-31",
            "description": "Annual data privacy compliance review"
        },
        {
            "title": "Code Review Standards",
            "department": "Engineering",
            "due_date": "2024-11-30",
            "description": "Updated code review guidelines"
        },
        {
            "title": "Sales Ethics Training",
            "department": "Sales",
            "due_date": "2024-12-15",
            "description": "Quarterly sales ethics compliance"
        }
    ]
    
    for policy_data in compliance_policies:
        existing = db.query(CompliancePolicy).filter(
            CompliancePolicy.title == policy_data["title"],
            CompliancePolicy.department == policy_data["department"]
        ).first()
        if not existing:
            from datetime import datetime
            policy = CompliancePolicy(
                title=policy_data["title"],
                department=policy_data["department"],
                due_date=datetime.strptime(policy_data["due_date"], "%Y-%m-%d").date(),
                description=policy_data["description"]
            )
            db.add(policy)
    
    learning_content = [
        {
            "title": "Responsible AI Practices",
            "tags": ["AI", "Ethics", "Engineering"],
            "level": "Intermediate",
            "description": "Learn about ethical AI development and deployment"
        },
        {
            "title": "Advanced React Patterns",
            "tags": ["React", "JavaScript", "Frontend"],
            "level": "Advanced",
            "description": "Master advanced React patterns and best practices"
        },
        {
            "title": "Docker and Containerization",
            "tags": ["Docker", "DevOps", "Engineering"],
            "level": "Intermediate",
            "description": "Comprehensive guide to Docker and container orchestration"
        },
        {
            "title": "Sales Communication Skills",
            "tags": ["Sales", "Communication", "Soft Skills"],
            "level": "Beginner",
            "description": "Improve your sales communication and negotiation skills"
        }
    ]
    
    for content_data in learning_content:
        existing = db.query(LearningContent).filter(
            LearningContent.title == content_data["title"]
        ).first()
        if not existing:
            content = LearningContent(
                title=content_data["title"],
                tags=json.dumps(content_data["tags"]),
                level=content_data["level"],
                description=content_data["description"]
            )
            db.add(content)
    
    db.commit()
    print("Database seeded successfully!")
    
except Exception as e:
    print(f"Error seeding database: {e}")
    db.rollback()
finally:
    db.close()
