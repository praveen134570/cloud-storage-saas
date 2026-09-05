from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import user, folder, file
from app.routes import auth, folder as folder_router, file as file_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cloud Storage API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(folder_router.router)
app.include_router(file_router.router)

@app.get("/")
def read_root():
    return {"message": "Cloud Storage API is running and connected to DB!"}