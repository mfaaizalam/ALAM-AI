from fastapi import APIRouter,HTTPException,Depends
from app.schemas.auth import  CreateUser,UserLogin,UserResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.auth_service import (
    register_user,
    authenticate_user
)
router = APIRouter(
    prefix='/auth',
    tags =['Authentication']
)

@router.post("/register",response_model=UserResponse)
def register(user:CreateUser,db:Session=Depends(get_db)):
    return register_user(user,db)

@router.post("/login")
def login(credentials:UserLogin,db:Session=Depends(get_db)):
    token =  authenticate_user(db,credentials)
    if not token:
        raise HTTPException(
            status_code=401,# 401 Unauthorized
            detail="Invalid email or password"
        )
    return {
        "access_token":token,
        "token_type":"bearer"
    }