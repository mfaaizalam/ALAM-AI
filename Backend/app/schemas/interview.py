from pydantic import BaseModel
from typing import Any
from datetime import datetime

class InsterviewCreate(BaseModel):
    candidate_profile: dict
    

class InterviewResponse(BaseModel):
    id: int
    status: str
    current_question: int
    total_questions: int
    candidate_profile: dict
    score: int | None = None
    feedback: str | None = None
    started_at: datetime
    completed_at: datetime | None = None

class SubmitAnswerRequest(BaseModel):
    session_id:int
    answer:str

    class Config:
        from_attributes = True
    