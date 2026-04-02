'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, Monitor, Shield, Activity, X } from 'lucide-react';
import { StreamingLink } from '@/lib/api';

interface StreamingPlayerProps {
    links: StreamingLink[];
    title: string;
    posterPath?: string | null;
}

export function StreamingPlayer({ links, title, posterPath }: StreamingPlayerProps) {
    const [selectedLink, setSelectedLink] = useState<StreamingLink | null>(links[0] || null);
    const [isSourceOpen, setIsSourceOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    if (links.length === 0) return null;

    return (
        <section className="w-full space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-[28px] flex items-center justify-center border border-primary/20 shadow-2xl shrink-0">
                        <Monitor className="text-primary w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif text-white font-bold tracking-tight">
                            Watch {title}
                        </h2>
                        <p className="text-white/40 mt-1.5 text-sm font-medium">Select your preferred streaming provider below.</p>
                    </div>
                </div>

                {/* Professional Source Selector */}
                <div className="relative">
                    <button 
                        onClick={() => setIsSourceOpen(!isSourceOpen)}
                        className="flex items-center gap-6 px-7 py-4 bg-white/5 border border-white/10 rounded-[24px] hover:bg-white/10 transition-all hover:border-white/20 group shadow-xl active:scale-95"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 leading-none mb-1.5">Active Line</p>
                                <p className="text-sm font-black text-white">{selectedLink?.provider_name} <span className="text-primary ml-1">{selectedLink?.quality}</span></p>
                            </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-white/30 transition-all duration-500 ${isSourceOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isSourceOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                className="absolute right-0 top-full mt-4 w-72 bg-[#0d0d0d]/95 border border-white/10 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden z-50 backdrop-blur-3xl p-1.5"
                            >
                                {links.map((link) => (
                                    <button
                                        key={link.id}
                                        onClick={() => {
                                            setSelectedLink(link);
                                            setIsSourceOpen(false);
                                            setIsPlaying(true);
                                        }}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all text-left ${selectedLink?.id === link.id ? 'bg-primary/5' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-2 rounded-full ${selectedLink?.id === link.id ? 'bg-primary shadow-[0_0_10px_rgba(244,192,37,0.5)]' : 'bg-white/10'}`} />
                                            <div>
                                                <p className={`font-black text-sm tracking-tight ${selectedLink?.id === link.id ? 'text-primary' : 'text-white'}`}>{link.provider_name}</p>
                                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">{link.quality} • SECURE</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Player Container */}
            <div className="relative aspect-video w-full bg-black rounded-[48px] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
                {!isPlaying ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 z-10 p-12">
                        {/* Background Poster Blur Overlay */}
                        {(selectedLink?.poster_path || posterPath) && (
                            <div className="absolute inset-0 z-0">
                                <img 
                                    src={`https://image.tmdb.org/t/p/original${selectedLink?.poster_path || posterPath}`} 
                                    className="w-full h-full object-cover opacity-10 blur-xl scale-125"
                                    alt=""
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsPlaying(true)}
                            className="group relative z-20"
                        >
                            <div className="absolute inset-0 bg-primary/30 blur-[40px] rounded-full group-hover:bg-primary/50 transition-all" />
                            <div className="w-28 h-28 bg-primary rounded-[36px] flex items-center justify-center shadow-2xl relative">
                                <Play className="w-12 h-12 text-black fill-current translate-x-1" />
                            </div>
                        </motion.button>
                        <div className="text-center relative z-20">
                            <h3 className="text-3xl font-serif text-white mb-3">Begin Streaming</h3>
                            <p className="text-white/40 font-medium max-w-sm">Connected to <span className="text-primary font-bold">{selectedLink?.provider_name}</span>. Press play to start the show.</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full relative">
                        <iframe 
                            src={selectedLink?.url} 
                            className="w-full h-full relative z-10"
                            allowFullScreen
                            allow="autoplay; encrypted-media"
                            sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin"
                        ></iframe>
                        <button 
                            onClick={() => setIsPlaying(false)}
                            className="absolute top-8 right-8 z-20 p-4 bg-black/40 backdrop-blur-2xl rounded-full text-white/50 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 shadow-2xl border border-white/10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-6 p-8 bg-white/[0.02] border border-white/5 rounded-[32px] backdrop-blur-md">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Shield className="w-6 h-6 text-primary" />
                </div>
                <p className="text-[13px] text-white/40 leading-relaxed font-medium">
                    <span className="text-white font-bold mr-1">Pro Tip:</span> 
                    For the most robust experience, we recommend sources tagged <span className="text-primary font-bold">1080p</span> or <span className="text-primary font-bold">4K</span>. 
                    If playback fails to start, verify your network connection or toggle the <span className="text-primary font-bold">Active Line</span> source above.
                </p>
            </div>
        </section>
    );
}
