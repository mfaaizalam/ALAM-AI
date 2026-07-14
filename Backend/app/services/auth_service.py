from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import CreateUser,UserLogin
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token
)

# get email function
def get_email(email:str,db:Session):
    user = db.query(User).filter(User.email ==email).first()
    return user

def register_user(
        user:CreateUser,
        db:Session
):
    existing_email = get_email(user.email,db)
    if existing_email:
        raise Exception("Email Already Exist")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        name =user.name,
        email=user.email,
        password = hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def authenticate_user(
        db:Session,
        credentials:UserLogin
):
    user = get_email(
        credentials.email,
        db
    )
    if not user:
        return None
    if not  verify_password(
        credentials.password,
        user.password
    ):
        return None
    
    # Generate JWT.
    token = create_access_token(
        {
            "sub":user.email
        }
    )
    return token