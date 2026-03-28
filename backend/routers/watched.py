from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database import get_db
import models
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/watched",
    tags=["watched"],
    responses={404: {"description": "Not found"}},
)

class WatchedItemCreate(BaseModel):
    tmdb_id: int
    media_type: str
    title: str
    poster_path: str = None
    runtime: int = 0

class WatchedItemResponse(BaseModel):
    id: int
    user_id: str
    tmdb_id: int
    media_type: str
    title: str
    poster_path: str = None
    runtime: int
    watched_at: datetime

    class Config:
        from_attributes = True

@router.post("/{clerk_id}", response_model=WatchedItemResponse)
def add_to_watched(clerk_id: str, item: WatchedItemCreate, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(models.User).filter(models.User.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if already watched
    existing = db.query(models.WatchedItem).filter(
        models.WatchedItem.user_id == clerk_id,
        models.WatchedItem.tmdb_id == item.tmdb_id,
        models.WatchedItem.media_type == item.media_type
    ).first()
    
    if existing:
        return existing

    db_item = models.WatchedItem(
        user_id=clerk_id,
        tmdb_id=item.tmdb_id,
        media_type=item.media_type,
        title=item.title,
        poster_path=item.poster_path,
        runtime=item.runtime
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/{clerk_id}", response_model=List[WatchedItemResponse])
def get_watched_items(clerk_id: str, db: Session = Depends(get_db)):
    return db.query(models.WatchedItem).filter(models.WatchedItem.user_id == clerk_id).all()

@router.get("/{clerk_id}/check/{tmdb_id}")
def check_watched(clerk_id: str, tmdb_id: int, media_type: str, db: Session = Depends(get_db)):
    item = db.query(models.WatchedItem).filter(
        models.WatchedItem.user_id == clerk_id,
        models.WatchedItem.tmdb_id == tmdb_id,
        models.WatchedItem.media_type == media_type
    ).first()
    return {"is_watched": item is not None}

@router.get("/{clerk_id}/stats")
def get_watch_stats(clerk_id: str, db: Session = Depends(get_db)):
    total_runtime = db.query(func.sum(models.WatchedItem.runtime)).filter(
        models.WatchedItem.user_id == clerk_id
    ).scalar() or 0
    
    count = db.query(func.count(models.WatchedItem.id)).filter(
        models.WatchedItem.user_id == clerk_id
    ).scalar() or 0
    
    return {
        "total_runtime_minutes": total_runtime,
        "total_runtime_hours": round(total_runtime / 60, 1),
        "watched_count": count
    }

@router.delete("/{clerk_id}/{tmdb_id}")
def remove_from_watched(clerk_id: str, tmdb_id: int, media_type: str, db: Session = Depends(get_db)):
    db_item = db.query(models.WatchedItem).filter(
        models.WatchedItem.user_id == clerk_id,
        models.WatchedItem.tmdb_id == tmdb_id,
        models.WatchedItem.media_type == media_type
    ).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found in watched list")
        
    db.delete(db_item)
    db.commit()
    return {"message": "Successfully removed from watched list"}
