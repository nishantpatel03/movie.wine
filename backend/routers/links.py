from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from database import get_db
import models
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/links",
    tags=["links"],
    responses={404: {"description": "Not found"}},
)

class StreamingLinkCreate(BaseModel):
    tmdb_id: int
    media_type: str
    title: Optional[str] = None
    poster_path: Optional[str] = None
    season_number: Optional[int] = None
    episode_number: Optional[int] = None
    url: str
    provider_name: str = "Direct"
    quality: str = "HD"

class StreamingLinkResponse(BaseModel):
    id: int
    tmdb_id: int
    media_type: str
    title: Optional[str] = None
    poster_path: Optional[str] = None
    season_number: Optional[int] = None
    episode_number: Optional[int] = None
    url: str
    provider_name: str
    quality: str
    added_at: datetime

    class Config:
        from_attributes = True

# Helper to check if user is admin
def verify_admin(clerk_id: str, db: Session):
    user = db.query(models.User).filter(models.User.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Admin access denied: User {clerk_id} not found in database. Ensure you have logged in to sync your profile."
        )
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Admin access denied: User {clerk_id} has role '{user.role}', but 'admin' is required. If you just updated your role in Clerk, please refresh the page."
        )
    return user

@router.post("/{clerk_id}", response_model=StreamingLinkResponse)
def add_streaming_link(clerk_id: str, link: StreamingLinkCreate, db: Session = Depends(get_db)):
    verify_admin(clerk_id, db)
    
    db_link = models.StreamingLink(**link.dict())
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link

@router.get("/{tmdb_id}", response_model=List[StreamingLinkResponse])
def get_streaming_links(
    tmdb_id: int, 
    media_type: str, 
    season: Optional[int] = None, 
    episode: Optional[int] = None, 
    db: Session = Depends(get_db)
):
    query = db.query(models.StreamingLink).filter(
        models.StreamingLink.tmdb_id == tmdb_id,
        models.StreamingLink.media_type == media_type
    )
    
    if season is not None:
        query = query.filter(models.StreamingLink.season_number == season)
    if episode is not None:
        query = query.filter(models.StreamingLink.episode_number == episode)
        
    return query.all()

@router.delete("/{clerk_id}/{link_id}")
def delete_streaming_link(clerk_id: str, link_id: int, db: Session = Depends(get_db)):
    verify_admin(clerk_id, db)
    
    db_link = db.query(models.StreamingLink).filter(models.StreamingLink.id == link_id).first()
    if not db_link:
        raise HTTPException(status_code=404, detail="Link not found")
        
    db.delete(db_link)
    db.commit()
    return {"message": "Link successfully deleted"}

@router.get("/stats/summary")
def get_link_stats(db: Session = Depends(get_db)):
    from sqlalchemy import func
    total = db.query(func.count(models.StreamingLink.id)).scalar()
    movies = db.query(func.count(models.StreamingLink.id)).filter(models.StreamingLink.media_type == "movie").scalar()
    tv = db.query(func.count(models.StreamingLink.id)).filter(models.StreamingLink.media_type == "tv").scalar()
    users = db.query(func.count(models.User.clerk_id)).scalar()
    
    return {
        "total_links": total or 0,
        "movie_links": movies or 0,
        "tv_links": tv or 0,
        "total_users": users or 0
    }

@router.get("/content/active")
def get_active_content(db: Session = Depends(get_db)):
    from sqlalchemy import distinct
    # Use DISTINCT ON (tmdb_id, media_type) to get one row per movie/series
    # In SQLAlchemy with Postgres, this needs order_by matching the distinct columns
    results = db.query(
        models.StreamingLink.tmdb_id,
        models.StreamingLink.media_type,
        models.StreamingLink.title,
        models.StreamingLink.poster_path
    ).distinct(models.StreamingLink.tmdb_id, models.StreamingLink.media_type) \
     .order_by(models.StreamingLink.tmdb_id, models.StreamingLink.media_type) \
     .all()
    
    return [
        {
            "tmdb_id": r.tmdb_id,
            "media_type": r.media_type,
            "title": r.title,
            "poster_path": r.poster_path
        } for r in results if r.title and r.poster_path # Only show items with metadata
    ]
