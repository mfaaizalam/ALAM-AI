from sqlalchemy import Column,Integer,String,DateTime

from app.core.database import Base
from sqlalchemy.sql import func
class User(Base):
    __tablename__ = "users"
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String,nullable =False)
    email = Column(String,nullable =False,unique=True,index=True)
    password = Column(String,nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )