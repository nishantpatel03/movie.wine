import os
import requests
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

DATABASE_URL = os.getenv("DATABASE_URL")
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

def backfill():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        print("Fetching links without metadata...")
        # Get unique tmdb_id, media_type pairs that have no title
        results = conn.execute(text("SELECT DISTINCT tmdb_id, media_type FROM streaming_links WHERE title IS NULL")).fetchall()
        
        for tmdb_id, media_type in results:
            print(f"Fetching metadata for {media_type} {tmdb_id}...")
            url = f"https://api.themoviedb.org/3/{media_type}/{tmdb_id}?api_key={TMDB_API_KEY}"
            try:
                resp = requests.get(url).json()
                title = resp.get('title') or resp.get('name')
                poster_path = resp.get('poster_path')
                
                if title and poster_path:
                    conn.execute(
                        text("UPDATE streaming_links SET title = :title, poster_path = :poster_path WHERE tmdb_id = :tmdb_id AND media_type = :media_type"),
                        {"title": title, "poster_path": poster_path, "tmdb_id": tmdb_id, "media_type": media_type}
                    )
                    print(f"Updated {title}")
            except Exception as e:
                print(f"Error fetching metadata: {e}")
        
        conn.commit()
        print("Backfill complete!")

if __name__ == "__main__":
    backfill()
