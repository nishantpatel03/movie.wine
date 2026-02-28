'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function TopPicksBento({ topPicks }: { topPicks: any[] }) {
    if (!topPicks || topPicks.length === 0) return null;

    // We assume topPicks is the full list. 
    // Usually indices 0 is hero, 1-5 are top picks.
    // But in page.tsx, topPicks is already processed.
    const featured = topPicks[0];
    const rest = topPicks.slice(1, 5);

    return (
        <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-end justify-between mb-12"
            >
                <div className="space-y-2">
                    <h2 className="text-sm font-black tracking-[0.3em] text-primary uppercase">Curated For You</h2>
                    <p className="text-4xl lg:text-5xl font-serif text-white tracking-tight">Top Picks</p>
                </div>
                <Link href="/movies" className="text-white/40 hover:text-primary transition-colors text-xs font-black tracking-widest flex items-center gap-2 group">
                    EXPLORE ALL
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 min-h-[700px]">
                {/* Feature Item */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-[2rem] bg-background-light border border-white/5 shadow-2xl"
                >
                    <Link href={`/${featured.media_type === 'tv' ? 'tv-shows' : 'movies'}/${featured.id}`}>
                        <div className="relative h-full w-full">
                            <img
                                src={`https://image.tmdb.org/t/p/w780${featured.poster_path}`}
                                alt={featured.title || featured.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent"></div>

                            <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform group-hover:-translate-y-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="premium-blur bg-white/10 text-white/90 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/10">
                                        {featured.media_type === 'tv' ? 'Series' : 'Feature'}
                                    </span>
                                    <div className="flex items-center gap-1 text-primary">
                                        <span className="material-symbols-outlined text-sm fill-1">star</span>
                                        <span className="text-xs font-black">{featured.vote_average?.toFixed(1)}</span>
                                    </div>
                                </div>
                                <h3 className="text-3xl lg:text-4xl font-serif text-white mb-3 group-hover:text-primary transition-colors">
                                    {featured.title || featured.name}
                                </h3>
                                <p className="text-white/60 text-sm line-clamp-2 font-medium max-w-md">
                                    {featured.overview}
                                </p>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Secondary Items */}
                {rest.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative overflow-hidden rounded-[1.5rem] bg-background-light border border-white/5 shadow-xl aspect-square md:aspect-auto"
                    >
                        <Link href={`/${item.media_type === 'tv' ? 'tv-shows' : 'movies'}/${item.id}`}>
                            <div className="relative h-full w-full">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`}
                                    alt={item.title || item.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

                                <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform group-hover:-translate-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center gap-1 text-primary">
                                            <span className="material-symbols-outlined text-[10px] fill-1">star</span>
                                            <span className="text-[10px] font-black">{item.vote_average?.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-serif text-white line-clamp-1 group-hover:text-primary transition-colors">
                                        {item.title || item.name}
                                    </h3>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
