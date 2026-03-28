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
        print("Creating comments table...")
        
        create_table_query = """
        CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR NOT NULL,
            tmdb_id INTEGER NOT NULL,
            media_type VARCHAR NOT NULL,
            title VARCHAR NOT NULL,
            poster_path VARCHAR,
            content TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (clerk_id)
        );
        CREATE INDEX IF NOT EXISTS ix_comments_id ON comments (id);
        CREATE INDEX IF NOT EXISTS ix_comments_user_id ON comments (user_id);
        CREATE INDEX IF NOT EXISTS ix_comments_tmdb_id ON comments (tmdb_id);
        """
        
        try:
            conn.execute(text(create_table_query))
            conn.commit()
            print("Comments table created successfully!")
        except Exception as e:
            print(f"Error creating comments table: {e}")

if __name__ == "__main__":
    migrate()
