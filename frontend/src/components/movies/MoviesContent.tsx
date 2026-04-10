'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Movie, getImageUrl, createSlug, getLibraryStats, getActiveContent } from '@/lib/api';
import Link from 'next/link';

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

// Simple genre mapping for the UI filters since TMDB returns IDs
const GENRE_MAP: Record<number, string> = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
    53: 'Thriller', 10752: 'War', 37: 'Western'
};

export function MoviesContent({ initialMovies }: { initialMovies: Movie[] }) {
    const [activeFilter, setActiveFilter] = useState('All');
    const [premiumMovies, setPremiumMovies] = useState<any[]>([]);
    const [stats, setStats] = useState<{ movie_links: number } | null>(null);
    const [isLoadingPremium, setIsLoadingPremium] = useState(false);

    // Fetch premium content and stats
    useEffect(() => {
        const fetchPremiumData = async () => {
            try {
                const [statsRes, activeRes] = await Promise.all([
                    getLibraryStats(),
                    getActiveContent()
                ]);
                setStats(statsRes);
                // Filter for movies only
                setPremiumMovies(activeRes.filter(item => item.media_type === 'movie'));
            } catch (err) {
                console.error("Error fetching premium data:", err);
            }
        };
        fetchPremiumData();
    }, []);

    // UI filters we want to show
    const filters = ['All', 'Premium', 'Action', 'Sci-Fi', 'Thriller', 'Drama', 'Horror', 'Comedy'];

    // Map TMDB genre IDs to our filter names for filtering math
    const filterToId: Record<string, number> = {
        'Action': 28, 'Sci-Fi': 878, 'Thriller': 53, 'Drama': 18, 'Horror': 27, 'Comedy': 35
    };

    let filteredMovies = [];
    if (activeFilter === 'All') {
        filteredMovies = initialMovies;
    } else if (activeFilter === 'Premium') {
        // Convert active content (which has tmdb_id) to Movie objects if they exist in initialMovies,
        // or just use the basic metadata from activeRes
        filteredMovies = premiumMovies.map(pm => {
            const fullMovie = initialMovies.find(m => m.id === pm.tmdb_id);
            if (fullMovie) return fullMovie;
            return {
                id: pm.tmdb_id,
                title: pm.title,
                poster_path: pm.poster_path,
                genre_ids: [],
                vote_average: 0,
                release_date: '',
                media_type: 'movie'
            } as any as Movie;
        });
    } else {
        filteredMovies = initialMovies.filter(m => m.genre_ids.includes(filterToId[activeFilter]));
    }

    return (
        <section className="px-6 lg:px-12 py-16 max-w-screen-2xl mx-auto">
            {/* Premium Library Card - Midnight Gold Refinement */}
            {activeFilter !== 'Premium' && stats && stats.movie_links > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5, scale: 1.01 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-12 relative group cursor-pointer"
                    onClick={() => setActiveFilter('Premium')}
                >
                    {/* Animated Gradient Border Glow */}
                    <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-r from-primary/50 via-primary/5 to-primary/50 opacity-30 group-hover:opacity-100 blur-[2px] transition-opacity duration-500"></div>
                    
                    {/* Main Card Body */}
                    <div className="relative overflow-hidden rounded-[2rem] bg-[#050505] border border-white/5 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-3xl shadow-2xl">
                        
                        {/* Background Spotlight / Shimmer */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                            <motion.div 
                                animate={{ 
                                    x: ['-100%', '200%'],
                                    opacity: [0, 0.1, 0]
                                }}
                                transition={{ 
                                    duration: 4, 
                                    repeat: Infinity, 
                                    ease: "linear",
                                    repeatDelay: 1
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                            />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full"></div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 w-full md:w-auto">
                            {/* Iconic Badge */}
                            <div className="relative h-24 w-24 flex-shrink-0">
                                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110 animate-pulse"></div>
                                <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 flex items-center justify-center shadow-2xl group-hover:border-primary/40 transition-colors duration-500 ring-1 ring-white/5">
                                    <span className="material-symbols-outlined text-primary text-5xl font-light scale-110 group-hover:rotate-12 transition-transform duration-500">
                                        workspace_premium
                                    </span>
                                </div>
                                {/* Small Glowing Orb */}
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full blur-[2px] shadow-[0_0_15px_#f4c025] animate-pulse"></div>
                            </div>

                            <div className="text-center md:text-left space-y-2">
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 mb-1">
                                    <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-ping"></span>
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Limited Access</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-serif italic text-white tracking-tight leading-none">
                                    The MW <span className="text-primary font-bold not-italic">Vault</span>
                                </h2>
                                <p className="text-slate-400 text-lg md:text-xl font-medium flex items-center justify-center md:justify-start gap-2">
                                    Discover <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white font-serif italic">{stats.movie_links}</span> curated masterpieces 
                                    <span className="hidden md:inline text-slate-600">•</span> 
                                    <span className="text-slate-500 text-sm uppercase tracking-tighter">Ready to Stream</span>
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 group/btn">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-10 py-4 bg-white text-black rounded-xl font-bold text-sm tracking-widest uppercase shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_15px_40px_-10px_rgba(244,192,37,0.4)] transition-all duration-500 flex items-center gap-3 overflow-hidden relative"
                            >
                                <span className="relative z-10">Explore Collection</span>
                                <span className="material-symbols-outlined relative z-10 text-xl group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                {/* Hover background effect */}
                                <div className="absolute inset-0 bg-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}


            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                {filters.map((filter) => (
                    <motion.button
                        key={filter}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${activeFilter === filter
                            ? filter === 'Premium' 
                                ? 'bg-primary text-black shadow-[0_0_20px_rgba(244,192,37,0.4)]'
                                : 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white backdrop-blur-md border border-white/5'
                            }`}
                    >
                        {filter === 'Premium' && (
                            <span className={`material-symbols-outlined text-[18px] ${activeFilter === filter ? 'text-black' : 'text-primary'}`}>
                                workspace_premium
                            </span>
                        )}
                        {filter}
                    </motion.button>
                ))}
            </div>

            {/* Movies Grid */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                key={activeFilter} // Re-trigger animation when filter changes
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12"
            >
                {filteredMovies.map((movie) => (
                    <motion.div
                        key={movie.id}
                        variants={fadeInUp}
                        className="relative group cursor-pointer flex flex-col h-full"
                    >
                        <Link href={`/movies/${createSlug(movie.id, movie.title)}`} className="flex flex-col h-full w-full">
                            {/* Poster Image */}
                            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-5 bg-slate-800/50 shadow-xl group-hover:shadow-[0_20px_40px_-15px_rgba(244,192,37,0.2)] transition-all duration-500 border border-white/5 group-hover:border-primary/30">
                                <img
                                    src={getImageUrl(movie.poster_path)}
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />

                                {/* Premium Vignette Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                                {/* Hover Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]">
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="h-16 w-16 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                                    >
                                        <span className="material-symbols-outlined text-3xl ml-1">play_arrow</span>
                                    </motion.div>
                                </div>

                                {/* Rating Badge */}
                                {movie.vote_average > 0 && (
                                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider text-white shadow-lg">
                                        <span className="material-symbols-outlined text-primary text-[14px]">star</span>
                                        {movie.vote_average.toFixed(1)}
                                    </div>
                                )}
                            </div>

                            {/* Metadata Details */}
                            <div className="flex-1 flex flex-col px-1">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-bold text-primary/90 tracking-widest uppercase truncate max-w-[65%]">
                                        {movie.genre_ids[0] ? GENRE_MAP[movie.genre_ids[0]] : 'Movie'}
                                    </span>
                                    <span className="text-xs text-slate-500 font-medium">
                                        {movie.release_date ? movie.release_date.substring(0, 4) : '—'}
                                    </span>
                                </div>
                                <h3 className="text-white font-medium text-base group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                    {movie.title}
                                </h3>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {filteredMovies.length === 0 && (
                <div className="w-full py-32 flex flex-col items-center justify-center text-slate-500">
                    <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl opacity-50">movie_off</span>
                    </div>
                    <h3 className="text-xl text-white font-medium mb-2">No movies found</h3>
                    <p>We couldn't find any titles matching this genre.</p>
                </div>
            )}
        </section>
    );
}
