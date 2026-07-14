from fastapi import FastAPI
from app.router.auth import router as auth_router
from app.core.database import engine
from app.models.user import Base
from app.router.cv import router as cv_router
from app.router.interview import router as interview_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Alam AI")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # or ["*"] during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
# include Auth routes
app.include_router(auth_router)

#include cv routes
app.include_router(cv_router)
# include interview 
app.include_router(interview_router)



@app.get("/")
def root():
    return {
        "message":"Alam Ai is Runnig Successfully"
    }