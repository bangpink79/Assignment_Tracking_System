
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from datetime import datetime

from database import SessionLocal, engine, Base
from models import Assignment
from schemas import AssignmentCreate, AssignmentResponse, AssignmentUpdate

# Create tables
Base.metadata.create_all(bind=engine)

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

@app.post("/api/assignments", response_model=AssignmentResponse, status_code=201)
def create_assignment(data: AssignmentCreate, db: Session = Depends(get_db)):
    assignment = Assignment(**data.model_dump())
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment

@app.get("/api/assignments", response_model=List[AssignmentResponse])
def list_assignments(db: Session = Depends(get_db)):
    return db.query(Assignment).filter(Assignment.deleted == False).all()

@app.get("/api/assignments/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id, Assignment.deleted == False).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment

@app.patch("/api/assignments/{assignment_id}", response_model=AssignmentResponse)
def update_assignment(assignment_id: int, data: AssignmentUpdate, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id, Assignment.deleted == False).first()
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
    """Soft delete - moves assignment to trash"""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id, Assignment.deleted == False).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    assignment.deleted = True
    assignment.deleted_time = datetime.now()
    db.commit()

@app.get("/api/assignments/trash/list", response_model=List[AssignmentResponse])
def list_trash(db: Session = Depends(get_db)):
    """Get all deleted assignments"""
    return db.query(Assignment).filter(Assignment.deleted == True).all()

@app.post("/api/assignments/{assignment_id}/restore", response_model=AssignmentResponse)
def restore_assignment(assignment_id: int, db: Session = Depends(get_db)):
    """Restore a deleted assignment from trash"""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id, Assignment.deleted == True).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found in trash")

    assignment.deleted = False
    assignment.deleted_time = None
    db.commit()
    db.refresh(assignment)
    return assignment

@app.delete("/api/assignments/{assignment_id}/permanent", status_code=204)
def permanent_delete(assignment_id: int, db: Session = Depends(get_db)):
    """Permanently delete an assignment from trash"""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id, Assignment.deleted == True).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found in trash")

    db.delete(assignment)
    db.commit()

@app.delete("/api/assignments/trash/empty", status_code=204)
def empty_trash(db: Session = Depends(get_db)):
    """Permanently delete all assignments in trash"""
    deleted_assignments = db.query(Assignment).filter(Assignment.deleted == True).all()
    for assignment in deleted_assignments:
        db.delete(assignment)
    db.commit()
