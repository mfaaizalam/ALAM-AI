from pydantic import BaseModel,EmailStr

class CreateUser(BaseModel):
    name:str
    email:EmailStr
    password:str

class UserLogin(BaseModel):
    email:EmailStr
    password:str

class UserResponse(BaseModel):
    id:int
    name:str
    email:EmailStr


    class Config:
        from_attribute =True

# "We use Pydantic schemas because they validate incoming request data and define the structure of API responses. SQLAlchemy models are designed for interacting with the database, while Pydantic schemas are designed for data validation and serialization. Separating these concerns improves security, maintainability, and flexibility."