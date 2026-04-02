'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, Monitor, Shield, Activity, X, Info, Globe, Maximize, Minimize, Settings, Lock } from 'lucide-react';
import { StreamingLink } from '@/lib/api';

interface StreamingPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    links: StreamingLink[];
    title: string;
    posterPath?: string | null;
}

export function StreamingPlayerModal({ isOpen, onClose, links, title, posterPath }: StreamingPlayerModalProps) {
    const [selectedLink, setSelectedLink] = useState<StreamingLink | null>(links[0] || null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isSourceOpen, setIsSourceOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [progress, setProgress] = useState(35); // Simulated progress


    // Update selected link if links change or when modal opens
    useEffect(() => {
        if (isOpen && links.length > 0) {
            setSelectedLink(links[0]);
            setIsPlaying(true);
            setIsSourceOpen(false);
        }
    }, [isOpen, links]);

    // Fullscreen handler
    const toggleFullscreen = () => {
        const elem = document.getElementById('streaming-player-container');
        if (!elem) return;

        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Listen for fullscreen changes
    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handler);
        return () => document.removeEventListener('fullscreenchange', handler);
    }, []);

    // Auto-hide controls
    useEffect(() => {
        if (!isPlaying || isSourceOpen) {
            setShowControls(true);
            return;
        }

        const timer = setTimeout(() => {
            setShowControls(false);
        }, 3000); // 3 seconds for better UX

        return () => clearTimeout(timer);
    }, [isPlaying, showControls, isSourceOpen]);

    const handleMouseMove = () => {
        if (!showControls) setShowControls(true);
    };

    if (!isOpen || links.length === 0) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 lg:p-12">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        id="streaming-player-container"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-[#0d0d0d] border border-white/10 rounded-[32px] md:rounded-[48px] shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[90vh] fullscreen:rounded-none fullscreen:max-h-screen fullscreen:max-w-none group/player"
                        onClick={(e) => e.stopPropagation()}
                        onMouseMove={handleMouseMove}
                    >
                        {/* Header - Sleek & Minimal with Auto-hide */}
                        <motion.div 
                            animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : -20 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-b from-black to-transparent backdrop-blur-xl absolute top-0 inset-x-0 z-50 pointer-events-auto"
                            style={{ pointerEvents: showControls ? 'auto' : 'none' }}
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(244,192,37,0.1)]">
                                    <Monitor className="text-primary w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-serif text-white leading-tight font-bold tracking-tight">
                                        {title}
                                    </h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                            <Activity className="w-3 h-3" />
                                            Live Session
                                        </div>
                                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">Cinematic Player v2.0</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Enhanced Source Selector */}
                                <div className="relative hidden md:block">
                                    <button 
                                        onClick={() => setIsSourceOpen(!isSourceOpen)}
                                        className="flex items-center gap-4 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all hover:border-white/20 active:scale-95"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                                <Shield className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 leading-none mb-1">Source</p>
                                                <p className="text-xs font-black text-white leading-none">{selectedLink?.provider_name} <span className="text-primary ml-1">{selectedLink?.quality}</span></p>
                                            </div>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-500 ${isSourceOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isSourceOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 top-full mt-3 w-64 bg-[#0d0d0d]/95 border border-white/10 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden z-50 backdrop-blur-3xl p-1"
                                            >
                                                {links.map((link) => (
                                                    <button
                                                        key={link.id}
                                                        onClick={() => {
                                                            setSelectedLink(link);
                                                            setIsSourceOpen(false);
                                                            setIsPlaying(true);
                                                        }}
                                                        className={`w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all text-left group ${selectedLink?.id === link.id ? 'bg-primary/5 border-primary/10' : ''}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2 h-2 rounded-full ${selectedLink?.id === link.id ? 'bg-primary shadow-[0_0_10px_rgba(244,192,37,0.5)]' : 'bg-white/10'}`} />
                                                            <div>
                                                                <p className={`font-black text-xs tracking-tight ${selectedLink?.id === link.id ? 'text-primary' : 'text-white'}`}>{link.provider_name}</p>
                                                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">{link.quality} • STABLE</p>
                                                            </div>
                                                        </div>
                                                        {selectedLink?.id === link.id && <div className="material-symbols-outlined text-primary text-sm">check_circle</div>}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button 
                                    onClick={toggleFullscreen}
                                    className="w-12 h-12 hidden md:flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all active:scale-90 group"
                                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                                >
                                    {isFullscreen ? <Minimize className="w-5 h-5 text-white/50" /> : <Maximize className="w-5 h-5 text-white/50" />}
                                </button>

                                <button 
                                    onClick={onClose} 
                                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-all active:scale-90 group"
                                >
                                    <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Player Content */}
                        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden min-h-[500px]">
                            {/* Cinematic Background Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-primary/5 blur-[150px] opacity-20 pointer-events-none" />

                            {!isPlaying ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center space-y-10 z-10 p-12 text-center overflow-hidden"
                                >
                                    {/* Movie Backdrop Placeholder Overlay */}
                                    {(selectedLink?.poster_path || posterPath) && (
                                        <div className="absolute inset-0 z-0">
                                            <img 
                                                src={`https://image.tmdb.org/t/p/original${selectedLink?.poster_path || posterPath}`} 
                                                className="w-full h-full object-cover opacity-20 blur-sm scale-110"
                                                alt=""
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20" />
                                        </div>
                                    )}

                                    <div className="relative z-20 flex flex-col items-center">
                                        <motion.button
                                            whileHover={{ scale: 1.05, rotate: 5 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsPlaying(true)}
                                            className="group relative"
                                        >
                                            <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full group-hover:bg-primary/40 transition-all duration-500" />
                                            <div className="w-24 h-24 md:w-32 md:h-32 bg-primary rounded-[32px] flex items-center justify-center shadow-2xl relative z-10 overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                                <Play className="w-12 h-12 md:w-16 md:h-16 text-black fill-current translate-x-1" />
                                            </div>
                                        </motion.button>

                                        <div className="mt-10 max-w-xl">
                                            <motion.h3 
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="text-3xl md:text-5xl font-serif text-white mb-4 tracking-tight"
                                            >
                                                Start Your Journey
                                            </motion.h3>
                                            <motion.p 
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                                className="text-white/40 text-sm md:text-base font-medium leading-relaxed tracking-wide"
                                            >
                                                Streaming from <span className="text-primary font-black uppercase tracking-widest">{selectedLink?.provider_name}</span> in crystal clear <span className="text-white font-black">{selectedLink?.quality}</span> quality. 
                                                The ultimate cinematic experience is just a click away.
                                            </motion.p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="w-full h-full relative aspect-video bg-black flex items-center justify-center">
                                    {selectedLink?.url ? (
                                        <>
                                            <iframe 
                                                src={
                                                    selectedLink.url.startsWith('//') 
                                                        ? `https:${selectedLink.url}` 
                                                        : selectedLink.url.startsWith('http') 
                                                            ? selectedLink.url 
                                                            : `https://${selectedLink.url}`
                                                } 
                                                className="w-full h-full relative z-10"
                                                allowFullScreen
                                                allow="autoplay; encrypted-media"
                                                referrerPolicy="no-referrer"
                                                sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin"
                                            ></iframe>
                                            
                                            {/* Link Fallback Overlay - Repositioned and Styled more elegantly */}
                                            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                                <a 
                                                    href={selectedLink.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="px-6 py-2.5 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full text-white/60 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center gap-3 shadow-2xl"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    External Player Fix
                                                </a>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-12 text-center text-white/20">
                                            <Globe className="w-16 h-16 mb-6 opacity-10 animate-pulse" />
                                            <h4 className="text-2xl font-serif">Playback Error</h4>
                                            <p className="text-sm mt-2 max-w-xs">We couldn't negotiate a connection to this stream provider. Please try another source.</p>
                                        </div>
                                    )}
                                    {/* Mobile Source Toggle Overlay */}
                                    <div className="absolute bottom-10 left-10 md:hidden z-30">
                                        <button 
                                            onClick={() => setIsSourceOpen(!isSourceOpen)}
                                            className="px-6 py-3 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl"
                                        >
                                            Switch Source
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
