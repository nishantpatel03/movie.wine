from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

# Load environment variables from backend/.env
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Get DB URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

def migrate():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        print("Migrating streaming_links table...")
        try:
            conn.execute(text("ALTER TABLE streaming_links ADD COLUMN title VARCHAR;"))
            print("Added 'title' column.")
        except Exception as e:
            print(f"Column 'title' might already exist: {e}")

        try:
            conn.execute(text("ALTER TABLE streaming_links ADD COLUMN poster_path VARCHAR;"))
            print("Added 'poster_path' column.")
        except Exception as e:
            print(f"Column 'poster_path' might already exist: {e}")
            
        conn.commit()
        print("Migration complete!")

if __name__ == "__main__":
    migrate()
