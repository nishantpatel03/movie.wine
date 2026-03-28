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
            <main className="flex-1">

                {/* Page Hero */}
                <section className="relative w-full pt-24 pb-12 px-6 lg:px-12 flex flex-col items-center justify-center border-b border-white/5 overflow-hidden text-center">
                    <div className="absolute inset-0 bg-background-dark z-0"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[200px] bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-xs font-medium tracking-wider text-slate-300 uppercase">Cinema Collection</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif italic mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50 tracking-tight">The Archives</h1>
                        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Explore our curated collection of cinematic masterpieces. From timeless classics to modern marvels.
                        </p>
                    </div>
                </section>

                {/* Filters & Grid Section (Client Component) */}
                <MoviesContent initialMovies={initialMovies} />

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
