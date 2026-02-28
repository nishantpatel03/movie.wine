// Base URL for the local FastAPI Python backend
const API_BASE_URL = 'http://localhost:8000/tmdb';

export interface TMDBResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export interface Movie {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    popularity: number;
    media_type?: string;
}

export interface TVShow {
    id: number;
    name: string;
    original_name: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    popularity: number;
    media_type?: string;
}

/**
 * Fetch data from our FastAPI backend
 */
async function fetchFromBackend<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    // Construct query string
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    }

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

    try {
        // For development, we bypass cache to ensure fresh TMDB keys are used.
        // Replace with { next: { revalidate: 3600 } } in production.
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to fetch from backend: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Backend fetch error:", error);
        throw error;
    }
}

// --- Specific API Calls ---

export async function getTrending(mediaType: 'all' | 'movie' | 'tv' | 'person' = 'all', timeWindow: 'day' | 'week' = 'day'): Promise<TMDBResponse<any>> {
    return fetchFromBackend(`/trending/${mediaType}`, { time_window: timeWindow });
}

export async function discoverMovies(page: number = 1, sortBy: string = 'popularity.desc', withGenres?: string): Promise<TMDBResponse<Movie>> {
    return fetchFromBackend(`/discover/movie`, { page, sort_by: sortBy, with_genres: withGenres });
}

export async function discoverTV(page: number = 1, sortBy: string = 'popularity.desc', withGenres?: string): Promise<TMDBResponse<TVShow>> {
    return fetchFromBackend(`/discover/tv`, { page, sort_by: sortBy, with_genres: withGenres });
}

export async function getMovieDetails(id: number): Promise<any> {
    return fetchFromBackend(`/movie/${id}`);
}

export async function getTVDetails(id: number): Promise<any> {
    return fetchFromBackend(`/tv/${id}`);
}

export async function searchMulti(query: string, page: number = 1): Promise<TMDBResponse<any>> {
    return fetchFromBackend(`/search/multi`, { query, page });
}

// Helper to get full image URLs from TMDB paths
export function getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500'): string {
    if (!path) return '/placeholder-poster.png'; // Make sure you have a fallback image in your public folder
    return `https://image.tmdb.org/t/p/${size}${path}`;
}
