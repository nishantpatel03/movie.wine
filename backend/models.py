from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    clerk_id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    avatar_url = Column(String, nullable=True)
    role = Column(String, default="user") # e.g., 'user', 'columnist', 'admin'
    title = Column(String, nullable=True) # e.g., 'Chief Editor'
    specialty = Column(String, nullable=True) # e.g., 'Art House Cinema'
    bio = Column(Text, nullable=True)
    favourite_genres = Column(String, nullable=True)  # comma-separated e.g. "Action,Drama"
    default_feed = Column(String, default="all")   # "all" | "movie" | "tv"
    content_language = Column(String, default="en")
    show_mature = Column(Boolean, default=False)
    notif_digest = Column(Boolean, default=True)
    notif_watchparty = Column(Boolean, default=True)
    notif_discussion = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    discussions = relationship("Discussion", back_populates="author")
    replies = relationship("DiscussionReply", back_populates="author")
    hosted_parties = relationship("WatchParty", back_populates="host")
    watch_party_attendances = relationship("WatchPartyAttendee", back_populates="user")
    likes = relationship("DiscussionLike", back_populates="user")
    lists = relationship("UserList", back_populates="owner", cascade="all, delete")
    comments = relationship("Comment", back_populates="author", cascade="all, delete")
    watchlist = relationship("WatchlistItem", back_populates="user", cascade="all, delete")
    watched_items = relationship("WatchedItem", back_populates="user", cascade="all, delete")

class WatchlistItem(Base):
    __tablename__ = "watchlist_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.clerk_id"), nullable=False, index=True)
    tmdb_id = Column(Integer, nullable=False, index=True)
    media_type = Column(String, nullable=False)  # "movie" or "tv"
    title = Column(String, nullable=False)
    poster_path = Column(String, nullable=True)
    added_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to User
    user = relationship("User", back_populates="watchlist")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.clerk_id"), nullable=False, index=True)
    tmdb_id = Column(Integer, nullable=False, index=True)           # TMDB movie/series ID
    media_type = Column(String, nullable=False)                      # "movie" or "tv"
    title = Column(String, nullable=False)                           # Movie/series name
    poster_path = Column(String, nullable=True)                      # Poster path
    content = Column(Text, nullable=False)                           # The comment text
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    author = relationship("User", back_populates="comments")

class Discussion(Base):
    __tablename__ = "discussions"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(String, ForeignKey("users.clerk_id"))
    title = Column(String, nullable=False)
    category = Column(String, nullable=False) # e.g., 'DEBATE', 'ANALYSIS', 'EDITORIAL'
    movie_title = Column(String, nullable=False)
    tmdb_movie_id = Column(Integer, nullable=True)
    release_year = Column(Integer, nullable=True)
    excerpt = Column(Text, nullable=False)
    content = Column(Text, nullable=True)
    poster_url = Column(String, nullable=True)
    is_hot = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    author = relationship("User", back_populates="discussions")
    replies = relationship("DiscussionReply", back_populates="discussion")
    likes = relationship("DiscussionLike", back_populates="discussion")

class DiscussionLike(Base):
    __tablename__ = "discussion_likes"

    discussion_id = Column(Integer, ForeignKey("discussions.id"), primary_key=True)
    user_id = Column(String, ForeignKey("users.clerk_id"), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    discussion = relationship("Discussion", back_populates="likes")
    user = relationship("User", back_populates="likes")

class DiscussionReply(Base):
    __tablename__ = "discussion_replies"

    id = Column(Integer, primary_key=True, index=True)
    discussion_id = Column(Integer, ForeignKey("discussions.id"))
    author_id = Column(String, ForeignKey("users.clerk_id"))
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    author = relationship("User", back_populates="replies")
    discussion = relationship("Discussion", back_populates="replies")

class WatchParty(Base):
    __tablename__ = "watch_parties"

    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(String, ForeignKey("users.clerk_id"))
    movie_title = Column(String, nullable=False)
    tmdb_movie_id = Column(Integer, nullable=True)
    genre = Column(String, nullable=True)
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    host = relationship("User", back_populates="hosted_parties")
    attendees = relationship("WatchPartyAttendee", back_populates="watch_party")

class WatchPartyAttendee(Base):
    __tablename__ = "watch_party_attendees"

    watch_party_id = Column(Integer, ForeignKey("watch_parties.id"), primary_key=True)
    user_id = Column(String, ForeignKey("users.clerk_id"), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    watch_party = relationship("WatchParty", back_populates="attendees")
    user = relationship("User", back_populates="watch_party_attendances")


class UserList(Base):
    __tablename__ = "user_lists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.clerk_id"), nullable=False, index=True)
    name = Column(String, nullable=False)  # e.g. "Watch Later", "Favourites"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    owner = relationship("User", back_populates="lists")
    items = relationship("UserListItem", back_populates="list", cascade="all, delete-orphan")


class UserListItem(Base):
    __tablename__ = "user_list_items"

    id = Column(Integer, primary_key=True, index=True)
    list_id = Column(Integer, ForeignKey("user_lists.id"), nullable=False, index=True)
    tmdb_id = Column(Integer, nullable=False)
    media_type = Column(String, nullable=False)  # "movie" or "tv"
    title = Column(String, nullable=False)
    poster_path = Column(String, nullable=True)
    added_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    list = relationship("UserList", back_populates="items")


class WatchedItem(Base):
    __tablename__ = "watched_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.clerk_id"), nullable=False, index=True)
    tmdb_id = Column(Integer, nullable=False, index=True)
    media_type = Column(String, nullable=False)  # "movie" or "tv"
    title = Column(String, nullable=False)
    poster_path = Column(String, nullable=True)
    runtime = Column(Integer, default=0) # in minutes
    watched_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to User
    user = relationship("User", back_populates="watched_items")


class StreamingLink(Base):
    __tablename__ = "streaming_links"

    id = Column(Integer, primary_key=True, index=True)
    tmdb_id = Column(Integer, nullable=False, index=True)
    media_type = Column(String, nullable=False)  # "movie" or "tv"
    title = Column(String, nullable=True) # Added for easy dashboard listing
    poster_path = Column(String, nullable=True) # Added for easy dashboard listing
    season_number = Column(Integer, nullable=True)
    episode_number = Column(Integer, nullable=True)
    url = Column(String, nullable=False)
    provider_name = Column(String, default="Direct")
    quality = Column(String, default="HD") # e.g., "4K", "1080p"
    added_at = Column(DateTime(timezone=True), server_default=func.now())
