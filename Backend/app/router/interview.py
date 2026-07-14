# from fastapi import (
#     APIRouter,
#     Depends,
#     UploadFile,
#     File
# )
# from sqlalchemy.orm import Session
# from app.core.database import get_db
# from app.core.dependencies import get_current_user
# from app.services.interview_service import submit_answer
# from app.services.cv_service import processs_cv
# from app.schemas.interview import SubmitAnswerRequest
# from app.models.InterviewMessage import InterviewMessage
# from app.services.interview_service import get_interview_session
# from fastapi import Form
# from app.services.gemini_service import (
#     analyze_cv,
#     generate_next_question
# )
# from app.services.interview_service import create_interview_session,save_message
# router = APIRouter(
#     prefix="/interview",
#     tags = ["Interview"]
# )
# @router.post("/start")
# @router.post("/start")
# def start_interview(
#     cv: UploadFile = File(...),
#     interviewer_name: str = Form("Alam"),      # <-- new
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user)
# ):
#     cv_text = processs_cv(cv)
#     candidate_profile = analyze_cv(cv_text)
#     interview = create_interview_session(
#         db=db,
#         user_id=current_user.id,
#         candidate_profile=candidate_profile,
#         interviewer_name=interviewer_name,      # <-- new
#     )
#     first_question = generate_next_question(
#         candidate_profile=candidate_profile,
#         conversation_history=[],
#         current_question=1,
#         total_questions=interview.total_questions,
#         interviewer_name=interview.interviewer_name,   # <-- new
#     )
#     ...

#     save_message(
#         db,
#         session_id=interview.id,
#         role="assistant",
#         message = first_question,
#         question_number=1
#     )
#     return {
#         "message":"Interview Started Successfully.",
#         "session_id":interview.id,
#         "question_number":1,
#         "question":first_question
#     }

# @router.post("/submit")
# def handle_submit(
#     request:SubmitAnswerRequest,
#     db:Session =Depends(get_db),
#     current_user = Depends(get_current_user)
# ):
#     result = submit_answer(
#         db=db,
#         session_id=request.session_id,
#         answer = request.answer 
#     )
#     return result


# @router.get("/{session_id}/result")
# def get_interview_result(
#     session_id:int,
#     db:Session=Depends(get_db),
#     current_user=Depends(get_current_user)

# ):
#     interview = get_interview_session(
#         db=db,
#         session_id=session_id
#     )
#     return interview

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form
)
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.services.interview_service import submit_answer
from app.services.cv_service import processs_cv
from app.schemas.interview import SubmitAnswerRequest
from app.models.InterviewMessage import InterviewMessage
from app.services.interview_service import get_interview_session
from app.services.gemini_service import (
    analyze_cv,
    generate_next_question
)
from app.services.interview_service import create_interview_session,save_message
router = APIRouter(
    prefix="/interview",
    tags = ["Interview"]
)
@router.post("/start")
def start_interview(
    cv:UploadFile = File(...),
    interviewer_name: str = Form("Alam"),
    db:Session =Depends(get_db),
    current_user = Depends(get_current_user)
):
    cv_text = processs_cv(cv)
    candidate_profile = analyze_cv(cv_text)
    interview = create_interview_session(
        db=db,
        user_id=current_user.id,
        candidate_profile=candidate_profile,
        interviewer_name=interviewer_name
    )
    first_question = generate_next_question(
        candidate_profile=candidate_profile,
        conversation_history=[],
        current_question=1,
        total_questions=interview.total_questions,
        interviewer_name=interview.interviewer_name

    )

    save_message(
        db,
        session_id=interview.id,
        role="assistant",
        message = first_question,
        question_number=1
    )
    return {
        "message":"Interview Started Successfully.",
        "session_id":interview.id,
        "question_number":1,
        "question":first_question
    }

@router.post("/submit")
def handle_submit(
    request:SubmitAnswerRequest,
    db:Session =Depends(get_db),
    current_user = Depends(get_current_user)
):
    result = submit_answer(
        db=db,
        session_id=request.session_id,
        answer = request.answer 
    )
    return result


@router.get("/{session_id}/result")
def get_interview_result(
    session_id:int,
    db:Session=Depends(get_db),
    current_user=Depends(get_current_user)

):
    interview = get_interview_session(
        db=db,
        session_id=session_id
    )
    return interview


@router.post("/{session_id}/interviewer")
def change_interviewer(
    session_id: int,
    interviewer_name: str = Form(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    interview = get_interview_session(db, session_id)

    interview.interviewer_name = interviewer_name
    db.commit()
    db.refresh(interview)

    first_question = generate_next_question(
        candidate_profile=interview.candidate_profile,
        conversation_history=[],
        current_question=1,
        total_questions=interview.total_questions,
        interviewer_name=interviewer_name
    )

    return {
        "question": first_question
    }