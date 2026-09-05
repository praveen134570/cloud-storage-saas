from pydantic import BaseModel
from datetime import datetime

# What the frontend sends us when they register
class UserCreate(BaseModel):
    email: str
    password: str
    name: str

# What we send back to the frontend (Notice: no password here!)
class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True  # Allows Pydantic to read SQLAlchemy database models