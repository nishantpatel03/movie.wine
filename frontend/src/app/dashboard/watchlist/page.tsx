'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Play, Info, Bookmark } from 'lucide-react';
import { WatchlistItem, getWatchlist, removeFromWatchlist, getImageUrl, createSlug } from '@/lib/api';

export default function WatchlistPage() {
    const { user, isLoaded } = useUser();
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoaded && user) {
            fetchWatchlist();
        }
    }, [isLoaded, user]);

    async function fetchWatchlist() {
        try {
            const data = await getWatchlist(user!.id);
            setWatchlist(data);
        } catch (error) {
            console.error('Error fetching watchlist:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRemove(tmdbId: number, mediaType: 'movie' | 'tv') {
        if (!user) return;

        // Optimistic update
        setWatchlist(watchlist.filter(item => !(item.tmdb_id === tmdbId && item.media_type === mediaType)));

        try {
            await removeFromWatchlist(user.id, tmdbId, mediaType);
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            // Re-fetch on error to ensure sync
            fetchWatchlist();
            alert('Failed to remove item. Please try again.');
        }
    }

    if (!isLoaded || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <Bookmark className="w-6 h-6 fill-primary" />
                        <span className="text-sm font-bold uppercase tracking-widest">Your Private Collection</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white font-serif italic">Watchlist</h1>
                    <p className="text-slate-400 mt-2">Movies and series you've saved for later.</p>
                </div>
                
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-slate-400 text-sm font-medium">Total Items: </span>
                    <span className="text-primary font-bold">{watchlist.length}</span>
                </div>
            </header>

            {watchlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    <AnimatePresence>
                        {watchlist.map((item) => (
                            <motion.div
                                key={`${item.media_type}-${item.tmdb_id}`}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="group relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 bg-white/5"
                            >
                                <img 
                                    src={getImageUrl(item.poster_path)} 
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                                    <h3 className="text-white font-bold text-sm line-clamp-2 mb-3">{item.title}</h3>
                                    
                                    <div className="flex gap-2">
                                        <Link 
                                            href={item.media_type === 'movie' ? `/movies/${item.tmdb_id}` : `/series/${createSlug(item.tmdb_id, item.title)}`}
                                            className="flex-1 h-9 bg-primary text-background-dark rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold hover:bg-primary-light transition-colors"
                                        >
                                            <Info className="w-3.5 h-3.5" />
                                            Details
                                        </Link>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => handleRemove(item.tmdb_id, item.media_type)}
                                    className="absolute top-2 right-2 size-8 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-center text-white hover:bg-red-500 hover:border-red-400 transition-all opacity-0 group-hover:opacity-100"
                                    title="Remove from watchlist"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {/* Badge */}
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                    {item.media_type === 'movie' ? 'Movie' : 'TV'}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-24 glassmorphism border border-white/5 rounded-[40px] max-w-2xl mx-auto"
                >
                    <div className="size-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
                        <Bookmark className="w-10 h-10 text-slate-600" />
                    </div>
                    <h2 className="text-3xl font-serif italic text-white mb-4">Your Watchlist is Empty</h2>
                    <p className="text-slate-400 mb-10 max-w-sm mx-auto leading-relaxed">
                        Start exploring cinematic wines and bookmark your favorites to enjoy them later.
                    </p>
                    <Link 
                        href="/movies"
                        className="bg-primary hover:bg-primary-light text-background-dark font-bold px-10 py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(244,192,37,0.15)] inline-flex items-center gap-2"
                    >
                        <Play className="w-5 h-5 fill-background-dark" />
                        Explore Movies
                    </Link>
                </motion.div>
            )}
        </div>
    );
}
