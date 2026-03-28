'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { WatchlistItem, getWatchlist, getImageUrl, createSlug, getUserComments, getWatchStats } from '@/lib/api';

// Animation Variants
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

export default function DashboardOverviewPage() {
    const { user, isLoaded } = useUser();
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [commentCount, setCommentCount] = useState(0);
    const [watchTime, setWatchTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoaded && user) {
            fetchData();
        }
    }, [isLoaded, user]);

    async function fetchData() {
        try {
            const [watchlistData, commentsData, watchStats] = await Promise.all([
                getWatchlist(user!.id),
                getUserComments(user!.id),
                getWatchStats(user!.id)
            ]);
            setWatchlist(watchlistData.slice(0, 4)); // Only show top 4
            setCommentCount(commentsData.length);
            setWatchTime(watchStats.total_runtime_minutes);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden md:block mb-12"
            >
                <h1 className="text-4xl font-serif italic text-white mb-2">Welcome to your cellar</h1>
                <p className="text-slate-400">Here's an overview of your cinematic journey.</p>
            </motion.div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-12"
            >
                {/* Stats Overview */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { label: "Movies in Cellar", value: watchlist.length >= 4 ? "4+" : watchlist.length.toString(), trend: "Your saved collection", icon: "movie", color: "text-blue-400" },
                        { label: "Comments", value: commentCount.toString(), trend: "Share your thoughts", icon: "edit_document", color: "text-accent-purple" },
                        { label: "Watchtime (hrs)", value: Math.round(watchTime / 60).toString(), trend: "Start your journey", icon: "schedule", color: "text-primary" }
                    ].map((stat, i) => (
                        <motion.div key={i} variants={fadeInUp} className="glassmorphism p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`material-symbols-outlined text-3xl ${stat.color} p-2 rounded-xl bg-white/5`}>{stat.icon}</span>
                            </div>
                            <h3 className="text-4xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-slate-400 font-medium mb-2">{stat.label}</p>
                            <p className="text-xs text-slate-500 font-bold tracking-wide uppercase">{stat.trend}</p>
                        </motion.div>
                    ))}
                </section>

                {/* Recent Watchlist */}
                <section>
                    <div className="flex items-end justify-between mb-6">
                        <h2 className="text-2xl font-serif italic text-white">Recently Added to Watchlist</h2>
                        <Link href="/dashboard/watchlist" className="text-primary hover:text-white text-sm font-bold transition-colors">View All</Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : watchlist.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {watchlist.map((item) => (
                                <Link 
                                    key={`${item.media_type}-${item.tmdb_id}`}
                                    href={item.media_type === 'movie' ? `/movies/${item.tmdb_id}` : `/series/${createSlug(item.tmdb_id, item.title)}`}
                                >
                                    <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} className="relative aspect-[2/3] rounded-xl overflow-hidden group cursor-pointer border border-white/5">
                                        <img src={getImageUrl(item.poster_path)} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 w-full p-4">
                                            <p className="text-primary text-[10px] font-bold mb-1 uppercase tracking-wider">{item.media_type}</p>
                                            <h4 className="text-white font-serif italic text-sm group-hover:text-primary transition-colors line-clamp-2">{item.title}</h4>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="glassmorphism p-12 rounded-2xl border border-white/5 text-center">
                            <p className="text-slate-400 italic font-serif">Your watchlist is empty.</p>
                            <Link href="/movies" className="text-primary text-sm font-bold mt-4 inline-block hover:underline">Start Exploring</Link>
                        </div>
                    )}
                </section>

            </motion.div>
        </>
    );
}
