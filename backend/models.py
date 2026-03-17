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
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    discussions = relationship("Discussion", back_populates="author")
    replies = relationship("DiscussionReply", back_populates="author")
    hosted_parties = relationship("WatchParty", back_populates="host")
    watch_party_attendances = relationship("WatchPartyAttendee", back_populates="user")
    likes = relationship("DiscussionLike", back_populates="user")

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
