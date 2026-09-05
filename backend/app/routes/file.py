import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File as FastAPIFile, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.file import File

# We assume you have a get_current_user function in your auth route. 
# If it's named something else, we will fix it in the next step!
from app.routes.auth import get_current_user

router = APIRouter(prefix="/files", tags=["Files"])

# Create a folder to hold the uploaded files temporarily
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(
    file: UploadFile = FastAPIFile(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        # 1. Save the file locally (The fastest way for your demo!)
        file_location = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)

        # 2. Save the details to your Neon database
        new_file = File(
            name=file.filename,
            size=os.path.getsize(file_location),
            mime_type=file.content_type or "application/octet-stream",
            storage_path=file_location,
            owner_id=current_user.id
        )
        db.add(new_file)
        db.commit()
        db.refresh(new_file)
        
        return {"message": "File uploaded successfully", "file": new_file}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@router.get("/")
def get_my_files(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Fetch all files that belong to the logged-in user
    files = db.query(File).filter(File.owner_id == current_user.id, File.is_deleted == False).all()
    return files