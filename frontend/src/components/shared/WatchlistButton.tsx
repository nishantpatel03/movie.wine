'use client';

import { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '@/lib/api';

interface WatchlistButtonProps {
    tmdbId: number;
    mediaType: 'movie' | 'tv';
    title: string;
    posterPath: string | null;
    isHero?: boolean;
}

export function WatchlistButton({ tmdbId, mediaType, title, posterPath, isHero = false }: WatchlistButtonProps) {
    const { user, isLoaded } = useUser();
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoaded && user) {
            checkWatchlist();
        } else {
            setIsLoading(false);
        }
    }, [isLoaded, user, tmdbId]);

    async function checkWatchlist() {
        try {
            const watchlist = await getWatchlist(user!.id);
            const exists = watchlist.some(item => item.tmdb_id === tmdbId && item.media_type === mediaType);
            setIsInWatchlist(exists);
        } catch (error) {
            console.error('Error checking watchlist:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function toggleWatchlist() {
        if (!user) return;

        const previousState = isInWatchlist;
        setIsInWatchlist(!previousState); // Optimistic update

        try {
            if (previousState) {
                await removeFromWatchlist(user.id, tmdbId, mediaType);
            } else {
                await addToWatchlist(user.id, {
                    tmdb_id: tmdbId,
                    media_type: mediaType,
                    title,
                    poster_path: posterPath
                });
            }
        } catch (error) {
            console.error('Error toggling watchlist:', error);
            setIsInWatchlist(previousState); // Revert on error
            alert('Failed to update watchlist. Please try again.');
        }
    }

    if (!isLoaded) return <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />;

    if (!user) {
        return (
            <SignInButton mode="modal">
                <button 
                    className={`flex items-center justify-center gap-2 rounded-xl transition-all font-bold ${
                        isHero 
                        ? 'px-8 py-4 bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                        : 'p-3 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                >
                    <Bookmark className="w-5 h-5" />
                    {isHero && "Add to Watchlist"}
                </button>
            </SignInButton>
        );
    }

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleWatchlist}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 rounded-xl transition-all font-bold relative overflow-hidden group ${
                isInWatchlist 
                ? 'bg-primary/20 text-primary border border-primary/40' 
                : isHero 
                    ? 'px-8 py-4 bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                    : 'p-3 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
        >
            <AnimatePresence mode="wait">
                {isInWatchlist ? (
                    <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 45 }}
                    >
                        <BookmarkCheck className="w-5 h-5 fill-primary" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="bookmark"
                        initial={{ scale: 0, rotate: 45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: -45 }}
                    >
                        <Bookmark className="w-5 h-5" />
                    </motion.div>
                )}
            </AnimatePresence>
            
            {isHero && (
                <span>{isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
            )}

            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </motion.button>
    );
}
