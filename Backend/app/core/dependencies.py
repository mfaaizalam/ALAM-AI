from fastapi import Depends,HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_access_token
from app.models.user import User
from app.services.auth_service import get_email

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)

def get_current_user(
       token: str = Depends(oauth2_scheme),
        db:Session =Depends(get_db)
):  
    payload = verify_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )
    email = payload.get('sub')
    user = get_email(email,db)
    if not user:
        raise HTTPException(
        status_code=401,
        detail="User not found"
    )
    return user