import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Folder(Base):
    __tablename__ = "folders"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    
    # Links this folder to the user who created it
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # If None, it's a "Root" folder. If it has an ID, it's inside another folder!
    parent_id = Column(String, ForeignKey("folders.id"), nullable=True) 

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())