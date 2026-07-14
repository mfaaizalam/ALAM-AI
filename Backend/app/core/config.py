from pydantic_settings import BaseSettings
# BaseSettings automatically reads values from .env
# Without it, we'd manually do something like:
# import os
# DATABASE_URL = os.getenv("DATABASE_URL")
class Setting(BaseSettings):
    DATABASE_URL:str
    SECKRET_KEY:str
    ALGORITHM:str
    ACCESS_TOKEN_EXPIRE_MINUTES :int
    GEMINI_API_KEY : str

    class Config:
        env_file = ".env"
setting = Setting()