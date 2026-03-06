import os
import httpx
from fastapi import APIRouter, HTTPException
from typing import Optional
from dotenv import load_dotenv

router = APIRouter(prefix="/tmdb", tags=["TMDB"])

# Dynamically loud .env because it may have changed after server startup
TMDB_BASE_URL = "https://api.themoviedb.org/3"

async def fetch_tmdb(endpoint: str, params: Optional[dict] = None):
    load_dotenv(override=True)
    tmdb_key = os.getenv("TMDB_API_KEY", "")
    
    if not params:
        params = {}
    params["api_key"] = tmdb_key
    
    url = f"{TMDB_BASE_URL}{endpoint}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json().get("status_message", "TMDB API Error"))
        return response.json()

@router.get("/trending/{media_type}")
async def get_trending(media_type: str = "all", time_window: str = "day"):
    # media_type can be 'all', 'movie', 'tv', 'person'
    # time_window can be 'day', 'week'
    data = await fetch_tmdb(f"/trending/{media_type}/{time_window}")
    return data

@router.get("/discover/movie")
async def discover_movies(page: int = 1, sort_by: str = "popularity.desc", with_genres: Optional[str] = None):
    params = {"page": page, "sort_by": sort_by}
    if with_genres:
        params["with_genres"] = with_genres
    data = await fetch_tmdb("/discover/movie", params)
    return data

@router.get("/discover/tv")
async def discover_tv(page: int = 1, sort_by: str = "popularity.desc", with_genres: Optional[str] = None):
    params = {"page": page, "sort_by": sort_by}
    if with_genres:
        params["with_genres"] = with_genres
    data = await fetch_tmdb("/discover/tv", params)
    return data

@router.get("/movie/{movie_id}")
async def get_movie_details(movie_id: int):
    # append_to_response to get videos and credits in one call
    data = await fetch_tmdb(f"/movie/{movie_id}", params={"append_to_response": "videos,credits,similar"})
    return data

@router.get("/tv/{tv_id}")
async def get_tv_details(tv_id: int):
    data = await fetch_tmdb(f"/tv/{tv_id}", params={"append_to_response": "videos,credits,similar"})
    return data

@router.get("/tv/{tv_id}/season/{season_number}")
async def get_tv_season_details(tv_id: int, season_number: int):
    data = await fetch_tmdb(f"/tv/{tv_id}/season/{season_number}")
    return data

@router.get("/person/{person_id}")
async def get_person_details(person_id: int):
    # append_to_response combined_credits fetches movies and tv shows the person was in
    data = await fetch_tmdb(f"/person/{person_id}", params={"append_to_response": "combined_credits"})
    return data

@router.get("/search/multi")
async def search_multi(query: str, page: int = 1):
    data = await fetch_tmdb("/search/multi", params={"query": query, "page": page})
    return data
