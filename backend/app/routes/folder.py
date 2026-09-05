from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.folder import Folder
from app.models.user import User
from app.schemas.folder import FolderCreate, FolderResponse
from app.core.security import get_current_user

router = APIRouter(prefix="/folders", tags=["Folders"])

@router.post("/", response_model=FolderResponse)
def create_folder(
    folder: FolderCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user) # PROTECTS THE ROUTE
):
    new_folder = Folder(
        name=folder.name,
        owner_id=current_user.id,
        parent_id=folder.parent_id
    )
    db.add(new_folder)
    db.commit()
    db.refresh(new_folder)
    return new_folder

@router.get("/", response_model=list[FolderResponse])
def get_folders(
    parent_id: str | None = None, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Only fetch folders that belong to the logged-in user!
    folders = db.query(Folder).filter(
        Folder.owner_id == current_user.id,
        Folder.parent_id == parent_id
    ).all()
    return folders