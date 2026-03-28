from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from database import get_db
import models

router = APIRouter(prefix="/comments", tags=["Comments"])

# --- Pydantic Schemas ---

class UserSchema(BaseModel):
    clerk_id: str
    username: str
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True

class CommentBase(BaseModel):
    tmdb_id: int
    media_type: str
    title: str
    poster_path: Optional[str] = None
    content: str

class CommentCreate(CommentBase):
    pass

class CommentUpdate(BaseModel):
    content: str

class CommentResponse(CommentBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime
    author: UserSchema

    class Config:
        from_attributes = True

# --- API Endpoints ---

@router.get("/media/{tmdb_id}", response_model=List[CommentResponse])
def get_media_comments(tmdb_id: int, db: Session = Depends(get_db)):
    """Get all comments for a specific movie or series"""
    comments = db.query(models.Comment).filter(models.Comment.tmdb_id == tmdb_id).order_by(models.Comment.created_at.desc()).all()
    return comments

@router.get("/user/{clerk_id}", response_model=List[CommentResponse])
def get_user_comments(clerk_id: str, db: Session = Depends(get_db)):
    """Get all comments written by a specific user"""
    comments = db.query(models.Comment).filter(models.Comment.user_id == clerk_id).order_by(models.Comment.created_at.desc()).all()
    return comments

@router.post("/{clerk_id}", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(clerk_id: str, comment: CommentCreate, db: Session = Depends(get_db)):
    """Create a new comment"""
    
    # Ensure the user exists (just like in lists.py)
    db_user = db.query(models.User).filter(models.User.clerk_id == clerk_id).first()
    if not db_user:
        base_username = f"user_{clerk_id.replace('_', '').replace('|', '')[:16]}"
        existing = db.query(models.User).filter(models.User.username == base_username).first()
        if existing:
            base_username = f"user_{clerk_id[-12:]}"
        db_user = models.User(clerk_id=clerk_id, username=base_username)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
    db_comment = models.Comment(
        user_id=clerk_id,
        tmdb_id=comment.tmdb_id,
        media_type=comment.media_type,
        title=comment.title,
        poster_path=comment.poster_path,
        content=comment.content
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.patch("/{clerk_id}/{comment_id}", response_model=CommentResponse)
def update_comment(clerk_id: str, comment_id: int, comment: CommentUpdate, db: Session = Depends(get_db)):
    """Update a comment"""
    db_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if db_comment.user_id != clerk_id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this comment")
        
    db_comment.content = comment.content
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.delete("/{clerk_id}/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(clerk_id: str, comment_id: int, db: Session = Depends(get_db)):
    """Delete a comment"""
    db_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if db_comment.user_id != clerk_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")
        
    db.delete(db_comment)
    db.commit()
    return None
