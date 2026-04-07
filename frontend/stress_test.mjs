
const API_BASE_URL = 'http://127.0.0.1:8000';

async function fetchOne(endpoint, params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    }
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
    console.log(`Fetching: ${url}`);
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
}

async function stress() {
    try {
        const results = await Promise.all([
            fetchOne('/tmdb/trending/all', { time_window: 'day' }),
            fetchOne('/tmdb/trending/movie', { time_window: 'week' }),
            fetchOne('/tmdb/trending/tv', { time_window: 'week' }),
            fetchOne('/tmdb/discover/movie', { sort_by: 'vote_average.desc', 'vote_count.gte': 1000, page: 1 }),
            fetchOne('/tmdb/discover/tv', { sort_by: 'vote_average.desc', 'vote_count.gte': 500, page: 1 }),
        ]);
        console.log("All 5 requests succeeded!");
    } catch (error) {
        console.error("Stress test failed:", error);
    }
}

stress();
