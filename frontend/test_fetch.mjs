
const API_BASE_URL = 'http://localhost:8000';
const endpoint = '/tmdb/trending/all';
const params = { time_window: 'day' };

const searchParams = new URLSearchParams();
for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
    }
}

const queryString = searchParams.toString();
const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

console.log(`Fetching: ${url}`);

async function test() {
    try {
        const response = await fetch(url, { cache: 'no-store' });
        console.log(`Status: ${response.status} ${response.statusText}`);
        if (!response.ok) {
            const text = await response.text();
            console.log(`Body: ${text}`);
        } else {
            const json = await response.json();
            console.log(`Success! Result count: ${json.results?.length}`);
        }
    } catch (error) {
        console.error("Fetch failed:", error);
    }
}

test();
