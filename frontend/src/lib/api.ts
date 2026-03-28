// Base URL for the local FastAPI Python backend
const API_BASE_URL = 'http://127.0.0.1:8000';

export interface User {
    clerk_id: string;
    username: string;
    avatar_url: string | null;
    role: string;
    title: string | null;
    specialty: string | null;
    bio?: string | null;
    favourite_genres?: string | null;
    default_feed?: string;
    content_language?: string;
    show_mature?: boolean;
    notif_digest?: boolean;
    notif_watchparty?: boolean;
    notif_discussion?: boolean;
}

// --- Comments Types ---
export interface Comment {
    id: number;
    user_id: string;
    tmdb_id: number;
    media_type: 'movie' | 'tv';
    title: string;
    poster_path: string | null;
    content: string;
    created_at: string;
    updated_at: string;
    author: {
        clerk_id: string;
        username: string;
        avatar_url: string | null;
    };
}

export interface Discussion {
    id: number;
    author_id: string;
    title: string;
    category: string;
    movie_title: string;
    tmdb_movie_id: number | null;
    release_year: number | null;
    excerpt: string;
    content: string | null;
    poster_url: string | null;
    is_hot: boolean;
    is_featured: boolean;
    created_at: string;
    author: User;
    replies_count: number;
    likes_count: number;
}

export interface WatchParty {
    id: number;
    host_id: string;
    movie_title: string;
    tmdb_movie_id: number | null;
    genre: string | null;
    scheduled_at: string;
    created_at: string;
    host: User;
}

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

// --- Community API Calls ---

export async function getDiscussions(): Promise<Discussion[]> {
    return fetchFromBackend('/community/discussions');
}

export async function getWatchParties(): Promise<WatchParty[]> {
    return fetchFromBackend('/community/watch-parties');
}

export async function getColumnists(): Promise<User[]> {
    return fetchFromBackend('/community/columnists');
}

export async function syncUser(userData: Partial<User>): Promise<User> {
    const url = `${API_BASE_URL}/community/users/sync`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw new Error(`Failed to sync user: ${response.statusText}`);
    }
    return await response.json();
}

export async function updateUser(clerkId: string, userData: Partial<User>): Promise<User> {
    const url = `${API_BASE_URL}/community/users/${clerkId}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
    }
    return await response.json();
}

export async function getUserProfile(clerkId: string): Promise<User> {
    return fetchFromBackend(`/community/users/${clerkId}`);
}

// Actually, let's add a proper GET /users/{id} to backend if not already there.
// Wait, sync is POST. I should probably use a GET.
// Looking at community.py, there is no GET /users/{id}. 
// I'll add it to backend too.

export async function exportUserData(clerkId: string): Promise<any> {
    return fetchFromBackend(`/community/users/${clerkId}/export`);
}

// --- Comments API ---

export async function getMediaComments(tmdbId: number): Promise<Comment[]> {
    return fetchFromBackend(`/comments/media/${tmdbId}`);
}

export async function getUserComments(clerkId: string): Promise<Comment[]> {
    return fetchFromBackend(`/comments/user/${clerkId}`);
}

export async function createComment(clerkId: string, data: {
    tmdb_id: number;
    media_type: 'movie' | 'tv';
    title: string;
    poster_path: string | null;
    content: string;
}): Promise<Comment> {
    const url = `${API_BASE_URL}/comments/${clerkId}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to create comment: ${response.statusText}`);
    return response.json();
}

export async function updateComment(clerkId: string, commentId: number, content: string): Promise<Comment> {
    const url = `${API_BASE_URL}/comments/${clerkId}/${commentId}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error(`Failed to update comment: ${response.statusText}`);
    return response.json();
}

export async function deleteComment(clerkId: string, commentId: number): Promise<void> {
    const url = `${API_BASE_URL}/comments/${clerkId}/${commentId}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Failed to delete comment: ${response.statusText}`);
}

// --- User Lists Types ---

export interface UserListItem {
    id: number;
    list_id: number;
    tmdb_id: number;
    media_type: 'movie' | 'tv';
    title: string;
    poster_path: string | null;
    added_at: string;
}

export interface UserListSummary {
    id: number;
    user_id: string;
    name: string;
    created_at: string;
    item_count: number;
}

export interface UserListFull extends UserListSummary {
    items: UserListItem[];
}

export interface ItemCheckResponse {
    tmdb_id: number;
    list_ids: number[];
}

// --- User Lists API ---

export async function getUserLists(clerkId: string): Promise<UserListSummary[]> {
    return fetchFromBackend(`/lists/${clerkId}`);
}

export async function createUserList(clerkId: string, name: string): Promise<UserListSummary> {
    const url = `${API_BASE_URL}/lists/${clerkId}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error(`Failed to create list: ${response.statusText}`);
    return response.json();
}

export async function deleteUserList(clerkId: string, listId: number): Promise<void> {
    const url = `${API_BASE_URL}/lists/${clerkId}/list/${listId}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Failed to delete list: ${response.statusText}`);
}

export async function getListWithItems(clerkId: string, listId: number): Promise<UserListFull> {
    return fetchFromBackend(`/lists/${clerkId}/list/${listId}/items`);
}

export async function addItemToList(clerkId: string, listId: number, item: {
    tmdb_id: number;
    media_type: 'movie' | 'tv';
    title: string;
    poster_path?: string | null;
}): Promise<UserListItem> {
    const url = `${API_BASE_URL}/lists/${clerkId}/list/${listId}/items`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error(`Failed to add item: ${response.statusText}`);
    return response.json();
}

export async function removeItemFromList(clerkId: string, listId: number, tmdbId: number): Promise<void> {
    const url = `${API_BASE_URL}/lists/${clerkId}/list/${listId}/items/${tmdbId}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Failed to remove item: ${response.statusText}`);
}

export async function checkItemInLists(clerkId: string, tmdbId: number): Promise<ItemCheckResponse> {
    return fetchFromBackend(`/lists/${clerkId}/check/${tmdbId}`);
}


// --- TMDB API Calls (via proxy) ---

export async function getTrending(mediaType: 'all' | 'movie' | 'tv' | 'person' = 'all', timeWindow: 'day' | 'week' = 'day'): Promise<TMDBResponse<any>> {
    return fetchFromBackend(`/tmdb/trending/${mediaType}`, { time_window: timeWindow });
}

export async function discoverMovies(page: number = 1, sortBy: string = 'popularity.desc', withGenres?: string): Promise<TMDBResponse<Movie>> {
    return fetchFromBackend(`/tmdb/discover/movie`, { page, sort_by: sortBy, with_genres: withGenres });
}

export async function discoverTV(page: number = 1, sortBy: string = 'popularity.desc', withGenres?: string): Promise<TMDBResponse<TVShow>> {
    return fetchFromBackend(`/tmdb/discover/tv`, { page, sort_by: sortBy, with_genres: withGenres });
}

export async function getMovieDetails(id: number): Promise<any> {
    return fetchFromBackend(`/tmdb/movie/${id}`);
}

export async function getTVDetails(id: number): Promise<any> {
    return fetchFromBackend(`/tmdb/tv/${id}`);
}

export async function getTVSeasonDetails(tvId: number, seasonNumber: number): Promise<any> {
    return fetchFromBackend(`/tmdb/tv/${tvId}/season/${seasonNumber}`);
}

export async function getEpisodeDetails(tvId: number, seasonNumber: number, episodeNumber: number): Promise<any> {
    return fetchFromBackend(`/tmdb/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`);
}

export async function getPersonDetails(id: number): Promise<any> {
    return fetchFromBackend(`/tmdb/person/${id}`);
}

export async function searchMulti(query: string, page: number = 1): Promise<TMDBResponse<any>> {
    return fetchFromBackend(`/tmdb/search/multi`, { query, page });
}



// Helper to get full image URLs from TMDB paths
export function getImageUrl(path: string | null, size: 'w500' | 'w185' | 'original' = 'w500'): string {
    if (!path) return '/placeholder-poster.png'; // Make sure you have a fallback image in your public folder
    return `https://image.tmdb.org/t/p/${size}${path}`;
}
// Helper to create SEO-friendly slugs for URLs
export function createSlug(id: number | string, name: string): string {
    if (!name) return String(id);
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    return `${id}-${slug}`;
}
