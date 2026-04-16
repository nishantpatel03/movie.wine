import sqlite3
import os

# Connect to the database (assuming it's a sqlite db for now based on engine setup usually being local)
# Wait, main.py says Neon DB, so it's Postgres.
# I don't have easy access to psql.

# Let's check database.py to see connection string.
with open('d:/movie.wine/backend/database.py', 'r') as f:
    print(f.read())
