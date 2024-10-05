from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas
from .database import SessionLocal, engine, get_db
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=engine)
app = FastAPI()


origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/rides")
def get_route(db: Session  = Depends(get_db)):
    return db.query(models.Rides).all()
    # return {"message": "route successfully got"}

# @app.post("/rides")
# def post_route():
#     return {"message": "route successfully posted"}
