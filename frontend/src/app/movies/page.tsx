import Link from 'next/link';
import { HomeNavBar } from '@/components/home/HomeNavBar';
import { MoviesContent } from '@/components/movies/MoviesContent';
import { discoverMovies } from '@/lib/api';

// This is now a Server Component
export default async function MoviesPage() {
    let initialMovies: any[] = [];

    try {
        // Fetch real list of top popular movies from TMDB
        const response = await discoverMovies(1, 'popularity.desc');
        initialMovies = response.results;
    } catch (e) {
        console.error("Error fetching movies from backend: ", e);
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-background-dark text-slate-100 font-display">
            {/* Navigation (Shared with Home) */}
            <HomeNavBar />

            {/* Main Content */}
            <main className="flex-1 pt-32 lg:pt-40">

                {/* Page Hero */}
                <section className="relative w-full py-20 px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between border-b border-white/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 to-background-dark z-0"></div>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                    <div className="relative z-10 max-w-3xl animate-in slide-in-from-left duration-700">
                        <h1 className="text-5xl md:text-7xl font-serif italic text-white mb-6">The Archives</h1>
                        <p className="text-xl text-slate-300 max-w-xl leading-relaxed">
                            Explore our curated collection of cinematic masterpieces. From timeless classics to modern marvels.
                        </p>
                    </div>
                </section>

                {/* Filters & Grid Section (Client Component) */}
                <MoviesContent initialMovies={initialMovies} />

            </main>

            {/* Shared Footer (Copied from Home) */}
            <footer className="border-t border-white/5 bg-background-dark py-16 px-10">
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
                            <li><Link href="/tv-shows" className="hover:text-primary transition-colors">TV Shows</Link></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}
