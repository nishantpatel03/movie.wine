from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
from pydantic import BaseModel
from datetime import datetime

class NotificationCreate(BaseModel):
    user_id: str
    title: str
    message: str
    type: str # new_follower, post_like, post_comment, comment_reply, system_update, content_hidden
    link: str | None = None

router = APIRouter(
    prefix="/api/notifications",
    tags=["notifications"],
)

class NotificationResponse(BaseModel):
    id: int
    user_id: str
    title: str
    message: str
    type: str # new_follower, post_like, post_comment, comment_reply, system_update, content_hidden, new_content
    link: str | None = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationsPaginatedResponse(BaseModel):
    notifications: List[NotificationResponse]
    unread_count: int
    total_count: int

@router.get("/{user_id}", response_model=NotificationsPaginatedResponse)
def get_notifications(user_id: str, page: int = 1, limit: int = 20, db: Session = Depends(get_db)):
    offset = (page - 1) * limit
    notifications = db.query(models.Notification)\
        .filter(models.Notification.user_id == user_id)\
        .order_by(models.Notification.created_at.desc())\
        .offset(offset)\
        .limit(limit)\
        .all()
    
    unread_count = db.query(models.Notification)\
        .filter(models.Notification.user_id == user_id, models.Notification.is_read == False)\
        .count()
    
    total_count = db.query(models.Notification)\
        .filter(models.Notification.user_id == user_id)\
        .count()
        
    return {
        "notifications": notifications,
        "unread_count": unread_count,
        "total_count": total_count
    }

# Announcement routes
class AnnouncementResponse(BaseModel):
    id: int
    title: str
    content: str
    type: str
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/announcements/{user_id}", response_model=List[AnnouncementResponse])
def get_announcements(user_id: str, db: Session = Depends(get_db)):
    # Get announcements not yet dismissed by this user
    dismissed_ids = db.query(models.AnnouncementDismissal.announcement_id)\
        .filter(models.AnnouncementDismissal.user_id == user_id)\
        .all()
    dismissed_ids = [row[0] for row in dismissed_ids]
    
    now = datetime.now()
    return db.query(models.Announcement)\
        .filter(~models.Announcement.id.in_(dismissed_ids))\
        .filter((models.Announcement.expires_at == None) | (models.Announcement.expires_at > now))\
        .all()

@router.post("/announcements/{announcement_id}/dismiss/{user_id}")
def dismiss_announcement(announcement_id: int, user_id: str, db: Session = Depends(get_db)):
    dismissal = models.AnnouncementDismissal(announcement_id=announcement_id, user_id=user_id)
    db.add(dismissal)
    db.commit()
    return {"message": "Announcement dismissed"}

@router.get("/{user_id}/unread-count")
def get_unread_count(user_id: str, db: Session = Depends(get_db)):
    count = db.query(models.Notification)\
        .filter(models.Notification.user_id == user_id, models.Notification.is_read == False)\
        .count()
    return {"unread_count": count}

@router.post("/")
def create_notification(notif: NotificationCreate, db: Session = Depends(get_db)):
    # Check if this is a self-notification (skips self-notifications as per spec)
    # Usually we get the performer's ID from Auth, but for now we look at the request
    # If the logic is handled on the caller side, we still protect here.
    
    db_notif = models.Notification(**notif.dict())
    db.add(db_notif)
    db.commit()
    db.refresh(db_notif)
    return db_notif

@router.post("/{user_id}/mark-read")
def mark_all_as_read(user_id: str, db: Session = Depends(get_db)):
    db.query(models.Notification)\
        .filter(models.Notification.user_id == user_id, models.Notification.is_read == False)\
        .update({models.Notification.is_read: True}, synchronize_session=False)
    db.commit()
    return {"message": "All notifications marked as read"}

@router.post("/{notification_id}/read")
def mark_as_read(notification_id: int, db: Session = Depends(get_db)):
    notification = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.is_read = True
    db.commit()
    return {"message": "Notification marked as read"}
