from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import engine
from app.models.user import Base

from app.router.auth import router as auth_router
from app.router.cv import router as cv_router
from app.router.interview import router as interview_router

app = FastAPI(title="Alam AI")

# Create database tables
Base.metadata.create_all(bind=engine)

# CORS (Localhost + Vercel Frontend)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://alam-ai-zl8n.vercel.app",  # Replace with your frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_router)
app.include_router(cv_router)
app.include_router(interview_router)

@app.get("/")
async def root():
    return {"message": "Backend is running 🚀"}