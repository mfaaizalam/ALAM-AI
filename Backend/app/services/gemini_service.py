# from google import genai

# from app.core.config import setting
# from app.utils.json_parse import parse_json
# from app.models.interview_session import InterviewSession
# client = genai.Client(
#     api_key=setting.GEMINI_API_KEY
# )

# def analyze_cv(cv_text:str)->str:
#     prompt = f"""
#     You are an expert technical interviewer.

#     Analyze the following CV.

#     Return ONLY valid JSON.

#     The JSON must contain:

#     {{
#         "name":"",
#         "education":"",
#         "experience_level":"",
#         "skills":[],
#         "projects":[],
#         "strengths":[],
#         "difficulty":"Easy | Medium | Hard"
#     }}

#     CV:

#     {cv_text}
#     """
#     response = client.models.generate_content(
#         model ="gemini-2.5-flash",
#         contents =prompt
#     )
#     return  parse_json(response.text)


# def generate_next_question(
#         candidate_profile:dict,
#         conversation_history:list,
#         total_questions:int,
#         current_question:int,
#         interviewer_name:str = "Alam"          # <-- new param
# )->str:
#     prompt=f"""You are an experienced software engineering interviewer named {interviewer_name}.

# You are conducting a complete interview.

# Candidate Profile:
# {candidate_profile}

# Conversation History:
# {conversation_history}

# Current Question:
# {current_question}

# Total Questions:
# {total_questions}

# Instructions:

# - If this is Question 1, introduce yourself by name as {interviewer_name} before asking anything.
# - Never introduce yourself with any name other than {interviewer_name}.
# - Then gradually move to projects.
# - Then technical skills.
# - Finally behavioral questions.
# - Ask only ONE question.
# - Never ask multiple questions.
# - Never repeat a previous question.
# - Do not answer your own question.
# - Return plain text only."""
    
#     response = client.models.generate_content(
#     model="gemini-2.5-flash",
#     contents=prompt
#     )  
#     return response.text.strip()


# def evaluate_interview(
#        candidate_profile:dict,
#        conversation_history:list
# )->dict:
#     prompt = f"""
# You are a Senior Software Engineering Interviewer with over 15 years of experience.

# Your task is to evaluate a completed mock interview.

# Candidate Profile:
# {candidate_profile}

# Complete Interview Conversation:
# {conversation_history}

# Evaluate the candidate fairly and professionally.

# Scoring Guidelines:

# - Technical Knowledge
# - Problem Solving
# - Communication Skills
# - Project Understanding
# - Confidence
# - Overall Performance

# Return ONLY valid JSON.

# Format:

# {{
#     "score": 0,
#     "strengths": [
#         ""
#     ],
#     "weaknesses": [
#         ""
#     ],
#     "feedback": "",
#     "recommendation": "Hire | Consider | Reject"
# }}

# Rules:

# - Score must be between 0 and 100.
# - Be objective.
# - Mention both strengths and weaknesses.
# - Feedback should be constructive.
# - Do not include markdown.
# - Do not include explanation outside JSON.
# """
#     response = client.models.generate_content(
#     model="gemini-2.5-flash",
#     contents=prompt
#     )  
#     return parse_json(response.text)

from google import genai

from app.core.config import setting
from app.utils.json_parse import parse_json
from app.models.interview_session import InterviewSession
client = genai.Client(
    api_key=setting.GEMINI_API_KEY
)

def analyze_cv(cv_text:str)->str:
    prompt = f"""
    You are an expert technical interviewer.

    Analyze the following CV.

    Return ONLY valid JSON.

    The JSON must contain:

    {{
        "name":"",
        "education":"",
        "experience_level":"",
        "skills":[],
        "projects":[],
        "strengths":[],
        "difficulty":"Easy | Medium | Hard"
    }}

    CV:

    {cv_text}
    """
    response = client.models.generate_content(
        model ="gemini-2.5-flash",
        contents =prompt
    )
    return  parse_json(response.text)


def generate_next_question(
        candidate_profile:dict,
        conversation_history:list,
        total_questions:int,
        current_question:int,
        interviewer_name:str = "Alam"
)->str:
    prompt=f"""You are an experienced software engineering interviewer named {interviewer_name}.

You are conducting a complete interview.

Candidate Profile:
{candidate_profile}

Conversation History:
{conversation_history}

Current Question:
{current_question}

Total Questions:
{total_questions}

Instructions:

- If this is Question 1, introduce yourself by name as {interviewer_name} before asking anything.
- Never introduce yourself with any name other than {interviewer_name}.
- Then gradually move to projects.
- Then technical skills.
- Finally behavioral questions.
- Ask only ONE question.
- Never ask multiple questions.
- Never repeat a previous question.
- Do not answer your own question.
- Return plain text only."""
    
    response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt
    )  
    return response.text.strip()


def evaluate_interview(
       candidate_profile:dict,
       conversation_history:list
)->dict:
    prompt = f"""
You are a Senior Software Engineering Interviewer with over 15 years of experience.

Your task is to evaluate a completed mock interview.

Candidate Profile:
{candidate_profile}

Complete Interview Conversation:
{conversation_history}

Evaluate the candidate fairly and professionally.

Scoring Guidelines:

- Technical Knowledge
- Problem Solving
- Communication Skills
- Project Understanding
- Confidence
- Overall Performance

Return ONLY valid JSON.

Format:

{{
    "score": 0,
    "strengths": [
        ""
    ],
    "weaknesses": [
        ""
    ],
    "feedback": "",
    "recommendation": "Hire | Consider | Reject"
}}

Rules:

- Score must be between 0 and 100.
- Be objective.
- Mention both strengths and weaknesses.
- Feedback should be constructive.
- Do not include markdown.
- Do not include explanation outside JSON.
"""
    response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt
    )  
    return parse_json(response.text)