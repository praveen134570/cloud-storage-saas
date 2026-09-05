import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class File(Base):
    __tablename__ = "files"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    size = Column(Integer, nullable=False)      # Size in bytes
    mime_type = Column(String, nullable=False)  # e.g., 'image/jpeg', 'application/pdf'
    
    # The unique path where Supabase Storage actually saved the physical file
    storage_path = Column(String, nullable=False)

    # Relationships
    folder_id = Column(String, ForeignKey("folders.id"), nullable=True) # None = Root folder
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)

    # For the "Trash" feature later!
    is_deleted = Column(Boolean, default=False) 
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())