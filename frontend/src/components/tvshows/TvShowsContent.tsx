'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { TVShow, getImageUrl } from '@/lib/api';
import Link from 'next/link';

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
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
        <section className="px-6 lg:px-12 py-12">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-12">
                {filters.map((filter) => (
                    <motion.button
                        key={filter}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all border ${activeFilter === filter
                            ? 'bg-primary border-primary text-background-dark shadow-[0_0_15px_rgba(244,192,37,0.3)]'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
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
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-12"
            >
                {filteredShows.map((show) => (
                    <motion.div
                        key={show.id}
                        variants={fadeInUp}
                        className="relative group cursor-pointer flex flex-col h-full"
                    >
                        <Link href={`/tv-shows/${show.id}`} className="flex flex-col h-full w-full">
                            {/* Poster Image */}
                            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 border border-white/5 shadow-lg group-hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all">
                                <img
                                    src={getImageUrl(show.poster_path)}
                                    alt={show.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Hover Play Button Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="h-16 w-16 bg-white/90 text-background-dark rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.5)] transform translate-y-4 group-hover:translate-y-0"
                                    >
                                        <span className="material-symbols-outlined text-3xl font-bold ml-1">play_arrow</span>
                                    </motion.div>
                                </div>

                                {/* Rating Badges */}
                                {show.vote_average > 0 && (
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold tracking-wider text-white">
                                        <span className="material-symbols-outlined text-primary text-[12px]">star</span>
                                        {show.vote_average.toFixed(1)}
                                    </div>
                                )}
                            </div>

                            {/* Metadata Details */}
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-accent-purple tracking-wider uppercase truncate max-w-[60%]">
                                        {show.genre_ids[0] ? GENRE_MAP[show.genre_ids[0]] : 'TV Show'}
                                    </span>
                                    <span className="text-xs text-slate-500 font-medium">
                                        {show.first_air_date ? show.first_air_date.substring(0, 4) : 'N/A'}
                                    </span>
                                </div>
                                <h3 className="text-white font-serif italic text-lg group-hover:text-accent-purple transition-colors line-clamp-2">
                                    {show.name}
                                </h3>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {filteredShows.length === 0 && (
                <div className="w-full py-20 text-center text-slate-500">
                    <span className="material-symbols-outlined text-4xl mb-4 block opacity-50">live_tv</span>
                    <p>No episodes found for this genre on our network.</p>
                </div>
            )}
        </section>
    );
}
