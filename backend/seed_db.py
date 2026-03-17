from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from datetime import datetime, timedelta

def seed():
    db = SessionLocal()
    
    # 1. Clear existing data (optional, but good for idempotency during development)
    db.query(models.WatchPartyAttendee).delete()
    db.query(models.WatchParty).delete()
    db.query(models.DiscussionLike).delete()
    db.query(models.DiscussionReply).delete()
    db.query(models.Discussion).delete()
    db.query(models.User).delete()
    db.commit()

    # 2. Create Users
    users = [
        models.User(clerk_id="user_1", username="CinemaVérité", avatar_url="C", role="columnist", title="Chief Editor", specialty="Art House Cinema"),
        models.User(clerk_id="user_2", username="NightOwl_Reels", avatar_url="N", role="columnist", title="Senior Critic", specialty="Psychological Thrillers"),
        models.User(clerk_id="user_3", username="FilmScoreFanatic", avatar_url="F", role="columnist", title="Audio Expert", specialty="Original Scores"),
        models.User(clerk_id="user_4", username="AnimeArchivist", avatar_url="A", role="user"),
        models.User(clerk_id="user_5", username="CoenBrothersClub", avatar_url="B", role="user"),
        models.User(clerk_id="user_6", username="QuentinFan", avatar_url="Q", role="user"),
        models.User(clerk_id="user_7", username="KoreanCinema_", avatar_url="K", role="user"),
        models.User(clerk_id="user_8", username="IndustryInsider", avatar_url="I", role="user"),
    ]
    db.add_all(users)
    db.commit()

    # 3. Create Discussions
    discussions = [
        models.Discussion(
            author_id="user_1",
            title="Is Oppenheimer the greatest biopic ever made?",
            category="DEBATE",
            movie_title="Oppenheimer",
            tmdb_movie_id=872585,
            release_year=2023,
            excerpt="Christopher Nolan's latest masterpiece has divided critics and cinephiles alike. The non-linear narrative is either genius or frustrating depending on who you ask.",
            poster_url="https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
            is_hot=True,
            is_featured=True
        ),
        models.Discussion(
            author_id="user_3",
            title="Perfect Scores Masterclass: How Ennio Morricone changed cinema forever",
            category="ANALYSIS",
            movie_title="The Good, the Bad and the Ugly",
            tmdb_movie_id=429,
            release_year=1966,
            excerpt="A deep dive into the compositional genius of Morricone and how his leitmotifs created an entirely new cinematic language...",
            poster_url="https://image.tmdb.org/t/p/w500/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg",
            is_hot=False,
            is_featured=False
        ),
        models.Discussion(
            author_id="user_6",
            title="Top-tier Villains: Why Hans Landa remains unbeatable",
            category="DISCUSSION",
            movie_title="Inglourious Basterds",
            tmdb_movie_id=16869,
            release_year=2009,
            excerpt="Christoph Waltz's portrayal of Colonel Landa redefined what a movie villain could be. Charming, multilingual, terrifyingly intelligent...",
            poster_url="https://image.tmdb.org/t/p/w500/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg",
            is_hot=True,
            is_featured=False
        ),
        models.Discussion(
            author_id="user_7",
            title="The hidden symbolism in Parasite you probably missed",
            category="EDITORIAL",
            movie_title="Parasite",
            tmdb_movie_id=496243,
            release_year=2019,
            excerpt="Bong Joon-ho wove layers of social commentary into every frame. From the geography of the homes to the choice of food, every detail in Parasite serves a distinct narrative purpose exploring class struggle.",
            poster_url="https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
            is_hot=False,
            is_featured=True
        ),
    ]
    db.add_all(discussions)
    db.commit()

    # 4. Create Watch Parties
    watch_parties = [
        models.WatchParty(
            host_id="user_1",
            movie_title="2001: A Space Odyssey",
            tmdb_movie_id=62,
            genre="SCI-FI",
            scheduled_at=datetime.now() + timedelta(days=2)
        ),
        models.WatchParty(
            host_id="user_4",
            movie_title="Spirited Away",
            tmdb_movie_id=129,
            genre="ANIMATION",
            scheduled_at=datetime.now() + timedelta(days=3)
        ),
        models.WatchParty(
            host_id="user_5",
            movie_title="No Country for Old Men",
            tmdb_movie_id=1422,
            genre="NEO-NOIR",
            scheduled_at=datetime.now() + timedelta(days=5)
        ),
    ]
    db.add_all(watch_parties)
    db.commit()

    print("Database seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed()
