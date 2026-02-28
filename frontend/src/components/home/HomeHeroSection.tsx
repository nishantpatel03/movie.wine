'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const scaleOnHover = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } }
};

export function HomeHeroSection({ trendingMovie }: { trendingMovie: any }) {
    const backdropUrl = trendingMovie?.backdrop_path ? `https://image.tmdb.org/t/p/original${trendingMovie.backdrop_path}` : "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop";

    return (
        <section className="relative h-[95vh] w-full overflow-hidden">
            <motion.div
                initial={{ scale: 1.15, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute inset-0"
            >
                <img className="h-full w-full object-cover scale-105" alt="Hero Background" src={backdropUrl} />
                {/* Advanced Multi-layered Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/60 to-transparent"></div>
                <div className="absolute inset-0 bg-black/20"></div>
            </motion.div>

            <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-end pb-24 lg:pb-32">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="max-w-3xl space-y-8"
                >
                    <motion.div variants={fadeInUp} className="flex items-center gap-4">
                        <span className="bg-primary text-background-dark px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(244,192,37,0.4)]">
                            Trending Now
                        </span>
                        <div className="flex items-center gap-2 text-white/60 text-xs font-bold tracking-widest uppercase">
                            <span>{trendingMovie?.release_date?.substring(0, 4) || "2026"}</span>
                            <span className="w-1 h-1 rounded-full bg-white/30"></span>
                            <span>{trendingMovie?.media_type === 'tv' ? 'TV Series' : 'Movie'}</span>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="space-y-4">
                        <h1 className="text-6xl lg:text-8xl font-serif text-white leading-[0.9] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] tracking-tight">
                            {trendingMovie?.title || trendingMovie?.name || "In the Blink of an Eye"}
                        </h1>
                    </motion.div>

                    <motion.p variants={fadeInUp} className="text-white/70 text-lg lg:text-xl leading-relaxed max-w-xl text-shadow-premium line-clamp-3 font-medium">
                        {trendingMovie?.overview || "Three storylines, spanning thousands of years, intersect and reflect on hope, connection and the circle of life."}
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6 pt-4">
                        <Link href={`/${trendingMovie?.media_type === 'tv' ? 'tv-shows' : 'movies'}/${trendingMovie?.id}`}>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(244,192,37,0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-primary text-background-dark px-10 py-4 rounded-2xl font-black text-sm tracking-widest flex items-center gap-3 transition-all group"
                            >
                                <span className="material-symbols-outlined fill-1 transition-transform group-hover:scale-125">play_arrow</span>
                                WATCH NOW
                            </motion.button>
                        </Link>

                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                            whileTap={{ scale: 0.95 }}
                            className="premium-blur bg-white/10 text-white border border-white/20 px-10 py-4 rounded-2xl font-black text-sm tracking-widest flex items-center gap-3 transition-all"
                        >
                            <span className="material-symbols-outlined">add</span>
                            MY LIST
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Elegant bottom fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background-dark to-transparent"></div>
        </section>
    );
}
