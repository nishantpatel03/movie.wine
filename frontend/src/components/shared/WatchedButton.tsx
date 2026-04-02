'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Tv, X } from 'lucide-react';
import { checkWatched, addToWatched, removeFromWatched } from '@/lib/api';

interface WatchedButtonProps {
    tmdbId: number;
    mediaType: 'movie' | 'tv';
    title: string;
    posterPath: string | null;
    runtime?: number;
    isHero?: boolean;
}

export function WatchedButton({ tmdbId, mediaType, title, posterPath, runtime = 0, isHero = false }: WatchedButtonProps) {
    const { user, isLoaded } = useUser();
    const [isWatched, setIsWatched] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (isLoaded && user) {
            checkStatus();
        }
    }, [isLoaded, user, tmdbId]);

    async function checkStatus() {
        try {
            const status = await checkWatched(user!.id, tmdbId, mediaType);
            setIsWatched(status);
        } catch (error) {
            console.error('Error checking watched status:', error);
        }
    }

    async function handleToggle() {
        if (!user) return;

        if (isWatched) {
            // If already watched, maybe just remove it or do nothing.
            // Requirement says "Watched" button with confirmation.
            // Let's allow removing it too if clicked again? 
            // Or just leave it as "Watched".
            // For now, let's allow removal for better UX.
            try {
                setIsProcessing(true);
                await removeFromWatched(user.id, tmdbId, mediaType);
                setIsWatched(false);
            } catch (error) {
                console.error('Error removing from watched:', error);
            } finally {
                setIsProcessing(false);
            }
        } else {
            setShowConfirm(true);
        }
    }

    async function confirmWatched() {
        if (!user) return;
        try {
            setIsProcessing(true);
            await addToWatched(user.id, {
                tmdb_id: tmdbId,
                media_type: mediaType,
                title,
                poster_path: posterPath,
                runtime
            });
            setIsWatched(true);
            setShowConfirm(false);
        } catch (error) {
            console.error('Error adding to watched:', error);
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isProcessing}
                onClick={handleToggle}
                className={`flex items-center gap-2 rounded-2xl font-black transition-all border ${
                    isWatched 
                    ? 'bg-primary/20 text-primary border-primary/40 shadow-[0_0_20px_rgba(244,192,37,0.1)]' 
                    : isHero 
                        ? 'bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 hover:border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                        : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                } ${isHero ? 'px-6 py-3.5 lg:px-8 lg:py-4 text-[11px] tracking-widest uppercase' : 'px-5 py-3 text-xs tracking-widest uppercase'}`}
            >
                {isWatched ? <Check className={isHero ? "w-5 h-5" : "w-4 h-4"} /> : <Tv className={isHero ? "w-5 h-5" : "w-4 h-4"} />}
                WATCHED
            </motion.button>

            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                        onClick={() => setShowConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-background-dark border border-white/10 p-8 rounded-[32px] max-w-sm w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    <Tv className="w-6 h-6 text-primary" />
                                </div>
                                <button onClick={() => setShowConfirm(false)} className="text-slate-500 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <h3 className="text-2xl font-serif italic text-white mb-2">Finished watching?</h3>
                            <p className="text-slate-400 mb-8">Did you finish watching <span className="text-white font-medium">{title}</span>? This will add the runtime to your total watch time.</p>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-6 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                                >
                                    Not yet
                                </button>
                                <button
                                    onClick={confirmWatched}
                                    className="px-6 py-3 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
                                >
                                    Yes, finished
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
