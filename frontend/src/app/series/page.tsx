import Link from 'next/link';
import { HomeNavBar } from '@/components/home/HomeNavBar';
import { SeriesContent } from '@/components/series/SeriesContent';
import { discoverTV } from '@/lib/api';

// This is now a Server Component
export default async function TvShowsPage() {
    let initialShows: any[] = [];

    try {
        // Fetch real list of top popular TV shows from TMDB
        const response = await discoverTV(1, 'popularity.desc');
        initialShows = response.results;
    } catch (e) {
        console.error("Error fetching TV Shows from backend: ", e);
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-background-dark text-slate-100 font-display">
            {/* Navigation (Shared with Home) */}
            <HomeNavBar />

            {/* Main Content */}
            <main className="flex-1">


                {/* Filters & Grid Section (Client Component) */}
                <SeriesContent initialShows={initialShows} />

            </main>

            {/* Shared Footer (Copied from Home) */}
            <footer className="border-t border-white/5 bg-background-dark py-16 px-10 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                    <div className="col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-3xl">movie_filter</span>
                            <h2 className="text-white text-2xl font-bold font-serif italic">MovieWine</h2>
                        </div>
                        <p className="text-slate-500 max-w-xs leading-relaxed">The premier destination for the discerning viewer. Experience cinema like never before.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6">Explore</h4>
                        <ul className="space-y-4 text-slate-500 text-sm">
                            <li><Link href="/movies" className="hover:text-primary transition-colors">Movies</Link></li>
                            <li><Link href="/series" className="hover:text-primary transition-colors">Series</Link></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}
