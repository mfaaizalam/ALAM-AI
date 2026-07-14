from app.core.database import Base
from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Text,
    DateTime,
    JSON
)
from sqlalchemy.sql import func

class InterviewSession(Base):
    __tablename__ = "interview_sessions"
    
    id = Column(Integer,primary_key=True)
    user_id = Column(Integer,ForeignKey("users.id"),nullable=False)

    candidate_profile = Column(JSON,nullable=False)
    interviewer_name = Column(String, nullable=False, default="Alam")
    current_question = Column( Integer,nullable=True,default=1)
    total_questions = Column(Integer,nullable=False,default=10)
    status = Column(String,nullable=False,default="in_progress")
    score =Column(Integer,nullable=True)
    feedback = Column(String,nullable=True)
    started_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    completed_at = Column(
        DateTime(timezone=True),
        nullable=True
    )