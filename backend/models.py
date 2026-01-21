from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
<<<<<<< HEAD
    description = Column(Text, nullable=True)
    status = Column(String(20), default="Pending") # Options: Pending, In Progress, Completed
    created_time = Column(DateTime(timezone=True), server_default=func.now())
    updated_time = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
=======
    description = Column(Text)
    status = Column(String(20), default="Pending")
    created_time = Column(DateTime)
    updated_time = Column(DateTime)
>>>>>>> d78cdcdc293517165db2d872974559cc34e9d7ec
