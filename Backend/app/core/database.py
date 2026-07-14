from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base,sessionmaker
from app.core.config import setting

# Create engine
engine = create_engine(setting.DATABASE_URL, pool_pre_ping=True)

# 
SessionLocal =sessionmaker(
    autocommit =False,
    autoflush=False,
    bind=engine
)

# # Base class for all models
Base = declarative_base()
# Dependency
def get_db():
    db=SessionLocal()   #db is an instance (object) of SQLAlchemy's Session class.
    try:
        yield db
    finally:
        db.close()

# We use yield instead of return because yield pauses the function and allows FastAPI to execute cleanup code after the request is completed. This ensures that the database session is automatically closed, preventing connection leaks. If we used return, the function would finish immediately, and we would lose the opportunity to execute the cleanup logic in the finally block.