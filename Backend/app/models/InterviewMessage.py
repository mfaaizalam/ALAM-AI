from sqlalchemy import (
    DateTime,
    Integer,
    String,
    Column,
    ForeignKey,
    Text,
    func,
)
from datetime import datetime
from app.core.database import Base
class InterviewMessage(Base):
    __tablename__ = "interview_messages"
    id = Column(Integer, primary_key=True,index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id"), nullable=False)
    role = Column(String, nullable=False)  # Assistant or Candidate
    message = Column(Text, nullable=False)
    question_number = Column(Integer, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )