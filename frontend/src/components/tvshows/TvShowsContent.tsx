'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { TVShow, getImageUrl } from '@/lib/api';
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

// Simple genre mapping for the UI filters since TMDB returns IDs (TV Shows)
const GENRE_MAP: Record<number, string> = {
    10759: 'Action & Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    10762: 'Kids', 9648: 'Mystery', 10763: 'News', 10764: 'Reality',
    10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk',
    10768: 'War & Politics', 37: 'Western'
};

export function TvShowsContent({ initialShows }: { initialShows: TVShow[] }) {
    const [activeFilter, setActiveFilter] = useState('All');

    // UI filters we want to show
    const filters = ['All', 'Action & Adventure', 'Sci-Fi & Fantasy', 'Drama', 'Comedy', 'Mystery', 'Crime'];

    // Map TMDB genre IDs to our filter names for filtering math
    const filterToId: Record<string, number> = {
        'Action & Adventure': 10759, 'Sci-Fi & Fantasy': 10765, 'Drama': 18, 'Comedy': 35, 'Mystery': 9648, 'Crime': 80
    };

    const filteredShows = activeFilter === 'All'
        ? initialShows
        : initialShows.filter(m => m.genre_ids.includes(filterToId[activeFilter]));

    return (
        <section className="px-6 lg:px-12 py-16 max-w-screen-2xl mx-auto">
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                {filters.map((filter) => (
                    <motion.button
                        key={filter}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${activeFilter === filter
                            ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white backdrop-blur-md border border-white/5'
                            }`}
                    >
                        {filter}
                    </motion.button>
                ))}
            </div>

            {/* TV Shows Grid */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                key={activeFilter} // Re-trigger animation when filter changes
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12"
            >
                {filteredShows.map((show) => (
                    <motion.div
                        key={show.id}
                        variants={fadeInUp}
                        className="relative group cursor-pointer flex flex-col h-full"
                    >
                        <Link href={`/tv-shows/${show.id}`} className="flex flex-col h-full w-full">
                            {/* Poster Image */}
                            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-5 bg-slate-800/50 shadow-xl group-hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.2)] transition-all duration-500 border border-white/5 group-hover:border-accent-purple/30">
                                <img
                                    src={getImageUrl(show.poster_path)}
                                    alt={show.name}
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

                                {/* Rating Badges */}
                                {show.vote_average > 0 && (
                                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider text-white shadow-lg">
                                        <span className="material-symbols-outlined text-accent-purple text-[14px]">star</span>
                                        {show.vote_average.toFixed(1)}
                                    </div>
                                )}
                            </div>

                            {/* Metadata Details */}
                            <div className="flex-1 flex flex-col px-1">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-bold text-accent-purple/90 tracking-widest uppercase truncate max-w-[65%]">
                                        {show.genre_ids[0] ? GENRE_MAP[show.genre_ids[0]] : 'TV Show'}
                                    </span>
                                    <span className="text-xs text-slate-500 font-medium">
                                        {show.first_air_date ? show.first_air_date.substring(0, 4) : '—'}
                                    </span>
                                </div>
                                <h3 className="text-white font-medium text-base group-hover:text-accent-purple transition-colors line-clamp-2 leading-snug">
                                    {show.name}
                                </h3>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {filteredShows.length === 0 && (
                <div className="w-full py-32 flex flex-col items-center justify-center text-slate-500">
                    <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl opacity-50">live_tv</span>
                    </div>
                    <h3 className="text-xl text-white font-medium mb-2">No episodes found</h3>
                    <p>We couldn't find any titles matching this genre.</p>
                </div>
            )}
        </section>
    );
}
