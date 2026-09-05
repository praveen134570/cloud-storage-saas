from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

# 1. IMPORT YOUR MODELS (This tells SQLAlchemy to create the tables)
from app.models import user, folder, file

# 2. IMPORT YOUR ROUTERS
from app.routes import auth, folder as folder_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cloud Storage API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. INCLUDE YOUR ROUTERS
app.include_router(auth.router)
app.include_router(folder_router.router) # <-- Add this line!

@app.get("/")
def read_root():
    return {"message": "Cloud Storage API is running and connected to DB!"}