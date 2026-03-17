# Database Schema Plan for MovieWine

This plan outlines the database tables and SQLAlchemy models required for the MovieWine application, which we will deploy on NeonDB.

## Goal Description
The backend currently uses FastAPI and SQLAlchemy to connect to a NeonDB PostgreSQL database. The frontend utilizes Clerk for authentication and features a Community hub with trending discussions/articles, watch parties, and user profiles. To support these features, we need a robust relational database schema.

## Proposed Changes

We will create a new file `d:\movie.wine\backend\models.py` containing the SQLAlchemy declarative models for the application.

### Backend Database Models

#### [NEW] models.py(file:///d:/movie.wine/backend/models.py)
We will implement the following tables:

**1. `users`**
Stores user information synced from Clerk and extended profile details.
- `clerk_id` (String, Primary Key) - The unique ID provided by Clerk
- `username` (String, Unique, Not Null)
- `avatar_url` (String, Nullable)
- `role` (String, Default: 'user') - e.g., 'user', 'columnist', 'admin'
- `title` (String, Nullable) - e.g., 'Chief Editor'
- `specialty` (String, Nullable) - e.g., 'Art House Cinema'
- `created_at` (DateTime, Default: UTC Now)

**2. `discussions`**
Stores the trending discussions, essays, and debates for the community page.
- `id` (Integer, Primary Key)
- `author_id` (String, ForeignKey to `users.clerk_id`)
- `title` (String, Not Null)
- `category` (String, Not Null) - e.g., 'DEBATE', 'ANALYSIS', 'EDITORIAL'
- `movie_title` (String, Not Null)
- `tmdb_movie_id` (Integer, Nullable) - For linking TMDB data
- `release_year` (Integer, Nullable)
- `excerpt` (Text, Not Null)
- `content` (Text, Nullable) - Full markdown/HTML content
- `poster_url` (String, Nullable)
- `is_hot` (Boolean, Default: False)
- `is_featured` (Boolean, Default: False)
- `created_at` (DateTime, Default: UTC Now)
- *Relationships:* `author` (User), `replies` (DiscussionReply), `likes` (DiscussionLike)

**3. `discussion_likes`**
Handles the tracking of likes/favorites on discussions.
- `discussion_id` (Integer, ForeignKey to `discussions.id`, Primary Key component 1)
- `user_id` (String, ForeignKey to `users.clerk_id`, Primary Key component 2)
- `created_at` (DateTime, Default: UTC Now)

**4. `discussion_replies`**
Handles the comments/replies on each discussion.
- `id` (Integer, Primary Key)
- `discussion_id` (Integer, ForeignKey to `discussions.id`)
- `author_id` (String, ForeignKey to `users.clerk_id`)
- `content` (Text, Not Null)
- `created_at` (DateTime, Default: UTC Now)
- *Relationships:* `author` (User), `discussion` (Discussion)

**5. `watch_parties`**
Stores virtual screening events.
- `id` (Integer, Primary Key)
- `host_id` (String, ForeignKey to `users.id`)
- `movie_title` (String, Not Null)
- `tmdb_movie_id` (Integer, Nullable)
- `genre` (String, Nullable)
- `scheduled_at` (DateTime, Not Null)
- `created_at` (DateTime, Default: UTC Now)
- *Relationships:* `host` (User), `attendees` (WatchPartyAttendee)

**6. `watch_party_attendees`**
Handles RSVPs for watch parties.
- `watch_party_id` (Integer, ForeignKey to `watch_parties.id`, Primary Key component 1)
- `user_id` (String, ForeignKey to `users.id`, Primary Key component 2)
- `created_at` (DateTime, Default: UTC Now)

#### [MODIFY] database.py(file:///d:/movie.wine/backend/database.py)
- Import all models into [database.py](file:///d:/movie.wine/backend/database.py) or create a script to initialized them so that `Base.metadata.create_all(bind=engine)` can safely generate the schema in NeonDB.

## User Review Required
> [!IMPORTANT]
> - Do these tables cover all the data you need for the Community application features? 
> - Would you like to add any extra tables, like 'Watchlists' or 'Movie Ratings', for the core movie pages?
> - Are you planning to map the `id` of the `users` table directly to the Clerk User ID logic?

## Verification Plan

### Automated Tests
- We will query the newly created schema inside a test Python script to verify all constraints, foreign keys, and indexes are successfully applied in NeonDB.

### Manual Verification
- Manually check the NeonDB console to ensure tables are created with proper columns.
- Test endpoint health using `curl http://localhost:8000/health/db`.
