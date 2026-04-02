'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { useState, useEffect } from 'react';

export function MovieTrailerModal({ videoKey, btnText = "WATCH TRAILER", isHero = false }: { videoKey: string | null, btnText?: string, isHero?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!videoKey) {
        return (
            <button disabled className={`flex items-center gap-2 px-8 py-3 lg:px-10 lg:py-4 rounded-xl font-bold transition-all ${isHero ? 'bg-primary/50 text-background-dark/50 cursor-not-allowed' : 'bg-white/5 text-white/50 cursor-not-allowed border border-white/10'}`}>
                <Play className="fill-current w-5 h-5" />
                NO TRAILER
            </button>
        );
    }

    return (
        <>
            {/* Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className={`flex items-center gap-2 rounded-2xl font-black transition-all ${
                    isHero 
                    ? 'px-6 py-3.5 lg:px-8 lg:py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)] text-[11px] tracking-widest' 
                    : 'px-5 py-3 bg-white/5 text-white border border-white/10 hover:bg-white/10 text-[10px] tracking-widest'}`}
            >
                <div className="w-5 h-5 flex items-center justify-center">
                    <Play className="fill-current w-4 h-4" />
                </div>
                {btnText}
            </motion.button>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-12"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setIsOpen(false);
                        }}
                    >
                        {/* Close Button */}
                        <motion.button
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                            className="absolute top-6 right-6 lg:top-12 lg:right-12 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="w-8 h-8" />
                        </motion.button>

                        {/* Video Container */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 relative"
                        >
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
