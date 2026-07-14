from datetime import datetime,timedelta,timezone
from jose import JWTError,jwt
from passlib.context import CryptContext
from app.core.config import setting

# Create Password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated = "auto"
    )
def get_password_hash(password:str)->str:
    return pwd_context.hash(password)

# verify password
def verify_password(
        plain_password:str,
        hashed_password
)->bool:
    return pwd_context.verify(
        plain_password,
        hashed_password
    )

# Create JWT Token

def create_access_token(data:dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=setting.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        setting.SECKRET_KEY,
        algorithm = setting.ALGORITHM
    )
    return encoded_jwt

def verify_access_token(token:str):
    try:
        payload = jwt.decode(
            token,
            setting.SECKRET_KEY,
            algorithms=[setting.ALGORITHM]
        )
        return payload 
    except JWTError:
        return None