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
        print("Starting migration...")
        
        # List of columns to add
        columns = [
            ("bio", "TEXT"),
            ("favourite_genres", "VARCHAR"),
            ("default_feed", "VARCHAR DEFAULT 'all'"),
            ("content_language", "VARCHAR DEFAULT 'en'"),
            ("show_mature", "BOOLEAN DEFAULT FALSE"),
            ("notif_digest", "BOOLEAN DEFAULT TRUE"),
            ("notif_watchparty", "BOOLEAN DEFAULT TRUE"),
            ("notif_discussion", "BOOLEAN DEFAULT TRUE")
        ]
        
        for col_name, col_type in columns:
            try:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                print(f"Added column: {col_name}")
            except Exception as e:
                if "already exists" in str(e).lower():
                    print(f"Column {col_name} already exists, skipping.")
                else:
                    print(f"Error adding {col_name}: {e}")
        
        conn.commit()
        print("Migration complete!")

if __name__ == "__main__":
    migrate()
