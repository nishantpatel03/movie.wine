from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from database import get_db
import models

router = APIRouter(prefix="/watchlist", tags=["Watchlist"])

# --- Pydantic Models ---

class WatchlistItemBase(BaseModel):
    tmdb_id: int
    media_type: str  # "movie" or "tv"
    title: str
    poster_path: Optional[str] = None

class WatchlistItemCreate(WatchlistItemBase):
    pass

class WatchlistItemResponse(WatchlistItemBase):
    id: int
    user_id: str
    added_at: datetime

    class Config:
        from_attributes = True

# --- API Endpoints ---

@router.get("/{clerk_id}", response_model=List[WatchlistItemResponse])
def get_watchlist(clerk_id: str, db: Session = Depends(get_db)):
    return db.query(models.WatchlistItem).filter(models.WatchlistItem.user_id == clerk_id).order_by(models.WatchlistItem.added_at.desc()).all()

@router.post("/{clerk_id}", response_model=WatchlistItemResponse)
def add_to_watchlist(clerk_id: str, item: WatchlistItemCreate, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(models.User).filter(models.User.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if already in watchlist
    existing_item = db.query(models.WatchlistItem).filter(
        models.WatchlistItem.user_id == clerk_id,
        models.WatchlistItem.tmdb_id == item.tmdb_id,
        models.WatchlistItem.media_type == item.media_type
    ).first()
    
    if existing_item:
        return existing_item
    
    db_item = models.WatchlistItem(
        user_id=clerk_id,
        tmdb_id=item.tmdb_id,
        media_type=item.media_type,
        title=item.title,
        poster_path=item.poster_path
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{clerk_id}/{tmdb_id}")
def remove_from_watchlist(clerk_id: str, tmdb_id: int, media_type: str, db: Session = Depends(get_db)):
    db_item = db.query(models.WatchlistItem).filter(
        models.WatchlistItem.user_id == clerk_id,
        models.WatchlistItem.tmdb_id == tmdb_id,
        models.WatchlistItem.media_type == media_type
    ).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found in watchlist")
    
    db.delete(db_item)
    db.commit()
    return {"message": "Removed from watchlist"}
