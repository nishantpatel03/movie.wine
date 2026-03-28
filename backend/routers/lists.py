from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from database import get_db
import models

router = APIRouter(prefix="/lists", tags=["User Lists"])


# ─── Pydantic Schemas ──────────────────────────────────────────────────────────

class ListItemCreate(BaseModel):
    tmdb_id: int
    media_type: str  # "movie" or "tv"
    title: str
    poster_path: Optional[str] = None


class ListItemResponse(BaseModel):
    id: int
    list_id: int
    tmdb_id: int
    media_type: str
    title: str
    poster_path: Optional[str] = None
    added_at: datetime

    class Config:
        from_attributes = True


class UserListCreate(BaseModel):
    name: str


class UserListResponse(BaseModel):
    id: int
    user_id: str
    name: str
    created_at: datetime
    items: List[ListItemResponse] = []

    class Config:
        from_attributes = True


class UserListSummary(BaseModel):
    """Lightweight list without items (for sidebar / dropdowns)."""
    id: int
    user_id: str
    name: str
    created_at: datetime
    item_count: int = 0

    class Config:
        from_attributes = True


class ItemCheckResponse(BaseModel):
    tmdb_id: int
    list_ids: List[int]  # list IDs that already contain this item


# ─── Helper: ensure user exists ────────────────────────────────────────────────

def _get_or_create_user_stub(clerk_id: str, db: Session) -> models.User:
    """Ensure there is a User row for this clerk_id (stub with minimal data)."""
    user = db.query(models.User).filter(models.User.clerk_id == clerk_id).first()
    if not user:
        # Use a unique username that won't collide — full clerk_id suffix
        base_username = f"user_{clerk_id.replace('_', '').replace('|', '')[:16]}"
        # Check if username already taken and make it unique
        existing = db.query(models.User).filter(models.User.username == base_username).first()
        if existing:
            base_username = f"user_{clerk_id[-12:]}"
        user = models.User(
            clerk_id=clerk_id,
            username=base_username,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def _get_list_and_verify_owner(list_id: int, clerk_id: str, db: Session) -> models.UserList:
    """
    Fetch a UserList by ID and verify it belongs to the given clerk_id.
    Raises 404 if not found, 403 if wrong owner.
    This prevents any data mismatch or cross-user access.
    """
    lst = db.query(models.UserList).filter(models.UserList.id == list_id).first()
    if not lst:
        raise HTTPException(status_code=404, detail="List not found")
    if lst.user_id != clerk_id:
        raise HTTPException(
            status_code=403,
            detail="Access denied: this list does not belong to you"
        )
    return lst


# ─── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/{clerk_id}", response_model=List[UserListSummary])
def get_user_lists(clerk_id: str, db: Session = Depends(get_db)):
    """Get all lists for a user (without items for performance).
    Only returns lists that belong to this specific clerk_id — no data mismatch possible.
    """
    lists = db.query(models.UserList).filter(models.UserList.user_id == clerk_id).all()
    result = []
    for lst in lists:
        summary = UserListSummary(
            id=lst.id,
            user_id=lst.user_id,
            name=lst.name,
            created_at=lst.created_at,
            item_count=len(lst.items),
        )
        result.append(summary)
    return result


@router.post("/{clerk_id}", response_model=UserListSummary, status_code=status.HTTP_201_CREATED)
def create_list(clerk_id: str, body: UserListCreate, db: Session = Depends(get_db)):
    """Create a new named list for a user. The list is strictly scoped to this clerk_id."""
    _get_or_create_user_stub(clerk_id, db)
    new_list = models.UserList(user_id=clerk_id, name=body.name)
    db.add(new_list)
    db.commit()
    db.refresh(new_list)
    return UserListSummary(
        id=new_list.id,
        user_id=new_list.user_id,
        name=new_list.name,
        created_at=new_list.created_at,
        item_count=0,
    )


@router.delete("/{clerk_id}/list/{list_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_list(clerk_id: str, list_id: int, db: Session = Depends(get_db)):
    """Delete a list — only if it belongs to the requesting clerk_id."""
    lst = _get_list_and_verify_owner(list_id, clerk_id, db)
    db.delete(lst)
    db.commit()


@router.get("/{clerk_id}/list/{list_id}/items", response_model=UserListResponse)
def get_list_items(clerk_id: str, list_id: int, db: Session = Depends(get_db)):
    """Get a list with all its items — only if it belongs to the requesting clerk_id."""
    lst = _get_list_and_verify_owner(list_id, clerk_id, db)
    return lst


@router.post("/{clerk_id}/list/{list_id}/items", response_model=ListItemResponse, status_code=status.HTTP_201_CREATED)
def add_item_to_list(clerk_id: str, list_id: int, body: ListItemCreate, db: Session = Depends(get_db)):
    """Add a movie or series to a list. Verifies clerk_id ownership. Ignores duplicates."""
    lst = _get_list_and_verify_owner(list_id, clerk_id, db)

    # Check for duplicate
    existing = db.query(models.UserListItem).filter(
        models.UserListItem.list_id == lst.id,
        models.UserListItem.tmdb_id == body.tmdb_id,
    ).first()
    if existing:
        return existing

    item = models.UserListItem(
        list_id=list_id,
        tmdb_id=body.tmdb_id,
        media_type=body.media_type,
        title=body.title,
        poster_path=body.poster_path,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{clerk_id}/list/{list_id}/items/{tmdb_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_item_from_list(clerk_id: str, list_id: int, tmdb_id: int, db: Session = Depends(get_db)):
    """Remove a specific item — only if the list belongs to the requesting clerk_id."""
    lst = _get_list_and_verify_owner(list_id, clerk_id, db)

    item = db.query(models.UserListItem).filter(
        models.UserListItem.list_id == lst.id,
        models.UserListItem.tmdb_id == tmdb_id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in list")
    db.delete(item)
    db.commit()


@router.get("/{clerk_id}/check/{tmdb_id}", response_model=ItemCheckResponse)
def check_item_in_lists(clerk_id: str, tmdb_id: int, db: Session = Depends(get_db)):
    """Return which of THIS user's lists already contain this media item.
    Strictly filtered by clerk_id — no cross-user data possible.
    """
    user_lists = db.query(models.UserList).filter(models.UserList.user_id == clerk_id).all()
    list_ids_with_item = []
    for lst in user_lists:
        match = db.query(models.UserListItem).filter(
            models.UserListItem.list_id == lst.id,
            models.UserListItem.tmdb_id == tmdb_id,
        ).first()
        if match:
            list_ids_with_item.append(lst.id)
    return ItemCheckResponse(tmdb_id=tmdb_id, list_ids=list_ids_with_item)
