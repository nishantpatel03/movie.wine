export default async function DebugPage() {
    let result = null;
    let error = null;
    const url = 'http://127.0.0.1:8000/health';

    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
            result = await res.json();
        } else {
            error = `Backend status: ${res.status} ${res.statusText}`;
        }
    } catch (e: any) {
        error = `Fetch failed: ${e.message}`;
    }

    return (
        <div style={{ padding: '40px', fontFamily: 'monospace', background: '#000', color: '#fff' }}>
            <h1>Backend Debugger</h1>
            <p>Target: 127.0.0.1:8000</p>
            <hr />
            {error ? (
                <div style={{ color: '#ff4444' }}>
                    <h3>Error:</h3>
                    <pre>{error}</pre>
                </div>
            ) : (
                <div style={{ color: '#44ff44' }}>
                    <h3>Success!</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
