from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from database import SessionLocal, engine, Base
from models import Assignment
<<<<<<< HEAD
from schemas import AssignmentCreate, AssignmentResponse, AssignmentUpdate

# Create tables
Base.metadata.create_all(bind=engine)
=======
from schemas import AssignmentCreate
>>>>>>> d78cdcdc293517165db2d872974559cc34e9d7ec

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

<<<<<<< HEAD
@app.post("/api/assignments", response_model=AssignmentResponse, status_code=201)
def create_assignment(data: AssignmentCreate, db: Session = Depends(get_db)):
    assignment = Assignment(**data.model_dump())
=======
@app.post("/api/assignments", status_code=201)
def create_assignment(data: AssignmentCreate, db: Session = Depends(get_db)):
    assignment = Assignment(
        title=data.title,
        description=data.description,
        status="Pending"
    )

>>>>>>> d78cdcdc293517165db2d872974559cc34e9d7ec
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment

<<<<<<< HEAD
@app.get("/api/assignments", response_model=List[AssignmentResponse])
=======

@app.get("/api/assignments")
>>>>>>> d78cdcdc293517165db2d872974559cc34e9d7ec
def list_assignments(db: Session = Depends(get_db)):
    return db.query(Assignment).all()

@app.get("/api/assignments/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment

@app.patch("/api/assignments/{assignment_id}", response_model=AssignmentResponse)
def update_assignment(assignment_id: int, data: AssignmentUpdate, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(assignment, key, value)

    db.commit()
    db.refresh(assignment)
    return assignment

@app.delete("/api/assignments/{assignment_id}", status_code=204)
def delete_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    db.delete(assignment)
    db.commit()