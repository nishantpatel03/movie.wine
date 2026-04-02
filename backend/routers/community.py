from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from database import get_db
import models
import httpx
import os
import base64

router = APIRouter(prefix="/community", tags=["Community"])

# --- ImgBB API Key ---
IMGBB_API_KEY = os.getenv("IMGBB_API_KEY")

# --- Pydantic Models for Response ---

class UserBase(BaseModel):
    clerk_id: str
    username: str
    avatar_url: Optional[str] = None
    role: str = "user"
    title: Optional[str] = None
    specialty: Optional[str] = None
    bio: Optional[str] = None
    favourite_genres: Optional[str] = None
    default_feed: str = "all"
    content_language: str = "en"
    show_mature: bool = False
    notif_digest: bool = True
    notif_watchparty: bool = True
    notif_discussion: bool = True

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    bio: Optional[str] = None
    favourite_genres: Optional[str] = None
    default_feed: Optional[str] = None
    content_language: Optional[str] = None
    show_mature: Optional[bool] = None
    notif_digest: Optional[bool] = None
    notif_watchparty: Optional[bool] = None
    notif_discussion: Optional[bool] = None

class UserExport(BaseModel):
    profile: UserBase
    lists: List[dict] # Simplified for export

    class Config:
        from_attributes = True

class DiscussionBase(BaseModel):
    id: int
    author_id: str
    title: str
    category: str
    movie_title: str
    tmdb_movie_id: Optional[int] = None
    release_year: Optional[int] = None
    excerpt: str
    content: Optional[str] = None
    poster_url: Optional[str] = None
    is_hot: bool
    is_featured: bool
    created_at: datetime
    author: UserBase
    replies_count: int = 0
    likes_count: int = 0

    class Config:
        from_attributes = True

class WatchPartyBase(BaseModel):
    id: int
    host_id: str
    movie_title: str
    tmdb_movie_id: Optional[int] = None
    genre: Optional[str] = None
    scheduled_at: datetime
    created_at: datetime
    host: UserBase

    class Config:
        from_attributes = True

class DiscussionCreate(BaseModel):
    title: str
    category: str
    movie_title: str
    tmdb_movie_id: Optional[int] = None
    release_year: Optional[int] = None
    excerpt: str
    content: Optional[str] = None
    poster_url: Optional[str] = None

# --- API Endpoints ---

@router.post("/discussions/{author_id}", response_model=DiscussionBase)
def create_discussion(author_id: str, discussion: DiscussionCreate, db: Session = Depends(get_db)):
    db_discussion = models.Discussion(
        author_id=author_id,
        is_hot=False,
        is_featured=False,
        **discussion.dict()
    )
    db.add(db_discussion)
    db.commit()
    db.refresh(db_discussion)
    
    # Return with counts (0 for new)
    result = DiscussionBase.from_orm(db_discussion)
    result.replies_count = 0
    result.likes_count = 0
    return result

@router.get("/discussions", response_model=List[DiscussionBase])
def get_discussions(db: Session = Depends(get_db)):
    discussions = db.query(models.Discussion).all()
    # In a real app, we'd add counts for replies and likes here
    # For now, let's just return them and we can enhance later
    result = []
    for d in discussions:
        d_dict = DiscussionBase.from_orm(d)
        d_dict.replies_count = len(d.replies)
        d_dict.likes_count = len(d.likes)
        result.append(d_dict)
    return result

@router.get("/discussions/{discussion_id}", response_model=DiscussionBase)
def get_discussion(discussion_id: int, db: Session = Depends(get_db)):
    db_discussion = db.query(models.Discussion).filter(models.Discussion.id == discussion_id).first()
    if not db_discussion:
        raise HTTPException(status_code=404, detail="Discussion not found")
    
    result = DiscussionBase.from_orm(db_discussion)
    result.replies_count = len(db_discussion.replies)
    result.likes_count = len(db_discussion.likes)
    return result

@router.get("/watch-parties", response_model=List[WatchPartyBase])
def get_watch_parties(db: Session = Depends(get_db)):
    return db.query(models.WatchParty).all()

@router.get("/columnists", response_model=List[UserBase])
def get_columnists(db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.role == "columnist").all()

@router.post("/users/sync", response_model=UserBase)
def sync_user(user_data: UserBase, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.clerk_id == user_data.clerk_id).first()
    if db_user:
        db_user.username = user_data.username
        db_user.avatar_url = user_data.avatar_url
        db_user.role = user_data.role
        db_user.title = user_data.title
        db_user.specialty = user_data.specialty
    else:
        db_user = models.User(
            clerk_id=user_data.clerk_id,
            username=user_data.username,
            avatar_url=user_data.avatar_url,
            role=user_data.role,
            title=user_data.title,
            specialty=user_data.specialty
        )
        db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/users/{clerk_id}", response_model=UserBase)
def get_user(clerk_id: str, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.clerk_id == clerk_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.patch("/users/{clerk_id}", response_model=UserBase)
def update_user(clerk_id: str, user_update: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.clerk_id == clerk_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/users/{clerk_id}/export")
def export_user_data(clerk_id: str, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.clerk_id == clerk_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Fetch lists and items
    user_lists = []
    for l in db_user.lists:
        list_data = {
            "name": l.name,
            "created_at": l.created_at,
            "items": [
                {
                    "tmdb_id": item.tmdb_id,
                    "media_type": item.media_type,
                    "title": item.title,
                    "added_at": item.added_at
                } for item in l.items
            ]
        }
        user_lists.append(list_data)

    return {
        "profile": UserBase.from_orm(db_user),
        "lists": user_lists
    }

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    if not IMGBB_API_KEY:
        raise HTTPException(status_code=500, detail="ImgBB API key not configured")
    
    # Read file content
    contents = await file.read()
    
    # Encode to base64
    base64_image = base64.b64encode(contents).decode('utf-8')
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.imgbb.com/1/upload",
            data={
                "key": IMGBB_API_KEY,
                "image": base64_image,
            }
        )
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to upload image to ImgBB")
    
    data = response.json()
    return {"url": data["data"]["url"]}
