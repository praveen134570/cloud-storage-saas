from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FolderCreate(BaseModel):
    name: str
    parent_id: Optional[str] = None  # Optional, because root folders don't have parents

class FolderResponse(BaseModel):
    id: str
    name: str
    owner_id: str
    parent_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True