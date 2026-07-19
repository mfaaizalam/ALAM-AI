# from sqlalchemy.orm import Session
# from fastapi import HTTPException
# from app.models.interview_session import InterviewSession
# from app.services.gemini_service import (
#     evaluate_interview,
#     generate_next_question
# )
# from app.models.InterviewMessage import InterviewMessage
# def create_interview_session(
#    db: Session,
#    user_id: int,
#    candidate_profile: dict,
#    interviewer_name: str = "Alam",      # <-- new
# ):
#     interview = InterviewSession(
#         user_id = user_id,
#         candidate_profile = candidate_profile,
#         interviewer_name = interviewer_name,   # <-- new
#     )
#     db.add(interview)
#     db.commit()
#     db.refresh(interview)
#     return interview
# def get_interview_session(
#         db:Session,
#         session_id : int
# ):
#     interview = (
#         db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
#     )
#     if not interview:
#         raise HTTPException(
#             status_code = 404,
#             detail = "Interview session not found. "
#         )
#     return interview

# def save_message(
#         db:Session,
#         session_id :int,
#         role:str,
#         message:str,
#         question_number:int
# ):
#     interview_message = InterviewMessage(
#         session_id=session_id,
#         role=role,
#         message = message,
#         question_number = question_number
#     )
#     db.add(interview_message)
#     db.commit()
#     db.refresh(interview_message)
#     return interview_message


# def get_conversation_history(
#         db:Session,
#         session_id:int
# ):
#     conversation_history = db.query(InterviewMessage).filter(
#         InterviewMessage.session_id == session_id
#     ).order_by(
#         InterviewMessage.question_number
#     ).all()
#     return conversation_history

# def complete_interview(
#         db:Session,
#         interview:InterviewSession,
#         score:int,
#         feedback:str
# ):
#     interview.status = "completed"
#     interview.score =score
#     interview.feedback = feedback

#     db.commit()
#     db.refresh(interview)
#     return interview


# def increment_question(
#         db:Session,
#         interview:InterviewSession
# ):
#     interview.current_question+=1
#     db.commit()
#     db.refresh(interview)
#     return interview


# def submit_answer(
#     db:Session,
#     session_id:int,
#     answer:str
# ):
#     interview =get_interview_session(db,session_id)
#     save_message(
#         db=db,
#         session_id=session_id,
#         role="user",
#         message=answer,
#         question_number=interview.current_question
#     )
#     conversation_history  = get_conversation_history(db=db,session_id=session_id)
#     if (interview.current_question>=interview.total_questions):
#         evaluation=evaluate_interview(
#             candidate_profile = interview.candidate_profile,
#             conversation_history=conversation_history,
#         )
#         complete_interview(
#             db=db,
#             interview=interview,
#             score=evaluation["overall_score"],
#             feedback=evaluation["feedback"]
#         )
#         return  {
#             "Completed":True,
#             "result":evaluation,
#         }
#     else:
#         interview =increment_question(db=db,interview=interview)
#         next_question = generate_next_question(
#             candidate_profile = interview.candidate_profile,
#             conversation_history=conversation_history,
#             total_questions = interview.total_questions,
#             current_question =interview.current_question,
#             interviewer_name = interview.interviewer_name,   # <-- new
#         )
#         save_message(
#         db=db,
#         session_id=session_id,
#         role="assistant",
#         message=next_question,
#         question_number=interview.current_question
#         )
#         return {
#               "completed": False,
#               "question_number": interview.current_question,
#               "question": next_question
#             }

from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.interview_session import InterviewSession
from app.services.gemini_service import (
    evaluate_interview,
    generate_next_question
)
from app.models.InterviewMessage import InterviewMessage
def create_interview_session(
   db:Session,
   user_id:int,
   candidate_profile:dict,
   interviewer_name:str = "Alam"
):
    interview = InterviewSession(
        user_id = user_id,
        candidate_profile = candidate_profile,
        interviewer_name = interviewer_name
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview

def get_interview_session(
        db:Session,
        session_id : int
):
    interview = (
        db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    )
    if not interview:
        raise HTTPException(
            status_code = 404,
            detail = "Interview session not found. "
        )
    return interview

def save_message(
        db:Session,
        session_id :int,
        role:str,
        message:str,
        question_number:int
):
    interview_message = InterviewMessage(
        session_id=session_id,
        role=role,
        message = message,
        question_number = question_number
    )
    db.add(interview_message)
    db.commit()
    db.refresh(interview_message)
    return interview_message


def get_conversation_history(
        db:Session,
        session_id:int
):
    conversation_history = db.query(InterviewMessage).filter(
        InterviewMessage.session_id == session_id
    ).order_by(
        InterviewMessage.question_number
    ).all()
    return conversation_history

def complete_interview(
    db: Session,
    interview: InterviewSession,
    overall_score: int,
    technical_score: int,
    communication_score: int,
    problem_solving_score: int,
    confidence_score: int,
    project_knowledge_score: int,
    feedback: str
):
    interview.status = "completed"
    interview.overall_score = overall_score
    interview.technical_score = technical_score
    interview.communication_score = communication_score
    interview.problem_solving_score = problem_solving_score
    interview.confidence_score = confidence_score
    interview.project_knowledge_score = project_knowledge_score
    interview.feedback = feedback

    db.commit()
    db.refresh(interview)
    return interview

def increment_question(
        db:Session,
        interview:InterviewSession
):
    interview.current_question+=1
    db.commit()
    db.refresh(interview)
    return interview


def submit_answer(
    db:Session,
    session_id:int,
    answer:str
):
    interview =get_interview_session(db,session_id)
    
    save_message(
        db=db,
        session_id=session_id,
        role="user",
        message=answer,
        question_number=interview.current_question
    )
    conversation_history  = get_conversation_history(db=db,session_id=session_id)
    if (interview.current_question>=interview.total_questions):
        evaluation=evaluate_interview(
            candidate_profile = interview.candidate_profile,
            conversation_history=conversation_history,
        )
        complete_interview(
        db=db,
        interview=interview,
        overall_score=evaluation["overall_score"],
        technical_score=evaluation["technical_score"],
        communication_score=evaluation["communication_score"],
         problem_solving_score=evaluation["problem_solving_score"],
         confidence_score=evaluation["confidence_score"],
         project_knowledge_score=evaluation["project_knowledge_score"],
         feedback=evaluation["feedback"]
        )
        return {
           "completed": True,
            "result": evaluation,
            }
    else:
        interview =increment_question(db=db,interview=interview)
        next_question = generate_next_question(
            candidate_profile = interview.candidate_profile,
            conversation_history=conversation_history,
            total_questions = interview.total_questions,
            current_question =interview.current_question,
            interviewer_name = interview.interviewer_name
        )
        save_message(
        db=db,
        session_id=session_id,
        role="assistant",
        message=next_question,
        question_number=interview.current_question
        )
        return {
              "completed": False,
              "question_number": interview.current_question,
              "question": next_question
            }