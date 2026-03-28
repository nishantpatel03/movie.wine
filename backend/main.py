from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import engine, Base, get_db
import models
from routers import tmdb, community, lists, comments, watchlist, watched, links

# Create the database tables
Base.metadata.create_all(bind=engine)

# Create the FastAPI app
app = FastAPI(title="MovieWine Backend API")

# Include the routers
app.include_router(tmdb.router)
app.include_router(community.router)
app.include_router(lists.router)
app.include_router(comments.router)
app.include_router(watchlist.router)
app.include_router(watched.router)
app.include_router(links.router)

# Setup CORS to allow Next.js frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"], # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint to check API Health
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "MovieWine FastAPI Backend is running!"}

# Endpoint to check DB connection Health
@app.get("/health/db")
def db_health_check(db: Session = Depends(get_db)):
    try:
        # Execute a simple query
        result = db.execute(text("SELECT 1;")).fetchone()
        if result and result[0] == 1:
            return {"status": "ok", "message": "Successfully connected to Neon DB"}
        else:
            return {"status": "error", "message": "Query failed"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Entry point for serving the API
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
