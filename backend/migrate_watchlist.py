from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get DB URL
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)

def migrate():
    with engine.connect() as conn:
        print("Creating watchlist_items table...")
        
        create_table_query = """
        CREATE TABLE IF NOT EXISTS watchlist_items (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR NOT NULL,
            tmdb_id INTEGER NOT NULL,
            media_type VARCHAR NOT NULL,
            title VARCHAR NOT NULL,
            poster_path VARCHAR,
            added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (clerk_id)
        );
        CREATE INDEX IF NOT EXISTS ix_watchlist_items_id ON watchlist_items (id);
        CREATE INDEX IF NOT EXISTS ix_watchlist_items_user_id ON watchlist_items (user_id);
        CREATE INDEX IF NOT EXISTS ix_watchlist_items_tmdb_id ON watchlist_items (tmdb_id);
        """
        
        try:
            conn.execute(text(create_table_query))
            conn.commit()
            print("Watchlist table created successfully!")
        except Exception as e:
            print(f"Error creating watchlist table: {e}")

if __name__ == "__main__":
    migrate()
