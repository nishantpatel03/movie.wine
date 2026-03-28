'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, Monitor, Shield, Activity, X } from 'lucide-react';
import { StreamingLink } from '@/lib/api';

interface StreamingPlayerProps {
    links: StreamingLink[];
    title: string;
}

export function StreamingPlayer({ links, title }: StreamingPlayerProps) {
    const [selectedLink, setSelectedLink] = useState<StreamingLink | null>(links[0] || null);
    const [isSourceOpen, setIsSourceOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    if (links.length === 0) return null;

    return (
        <section className="w-full space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-serif italic text-white flex items-center gap-3">
                        <Monitor className="text-primary w-8 h-8" />
                        Watch Now
                    </h2>
                    <p className="text-slate-400 mt-1">Select a source below to start streaming <span className="text-white font-medium">{title}</span>.</p>
                </div>

                {/* Source Selector */}
                <div className="relative">
                    <button 
                        onClick={() => setIsSourceOpen(!isSourceOpen)}
                        className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4 text-primary" />
                            <div className="text-left">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Source</p>
                                <p className="text-sm font-bold text-white">{selectedLink?.provider_name} ({selectedLink?.quality})</p>
                            </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isSourceOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isSourceOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 top-full mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
                            >
                                {links.map((link) => (
                                    <button
                                        key={link.id}
                                        onClick={() => {
                                            setSelectedLink(link);
                                            setIsSourceOpen(false);
                                            setIsPlaying(true);
                                        }}
                                        className={`w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0 ${selectedLink?.id === link.id ? 'bg-primary/10' : ''}`}
                                    >
                                        <div>
                                            <p className={`font-bold text-sm ${selectedLink?.id === link.id ? 'text-primary' : 'text-white'}`}>{link.provider_name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Activity className="w-3 h-3 text-slate-500" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">{link.quality}</span>
                                            </div>
                                        </div>
                                        {selectedLink?.id === link.id && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Player Container */}
            <div className="relative aspect-video w-full bg-black rounded-[40px] overflow-hidden border border-white/5 shadow-2xl group">
                {!isPlaying ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 z-10">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsPlaying(true)}
                            className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,179,71,0.4)] relative z-20 group"
                        >
                            <Play className="w-10 h-10 text-black fill-current translate-x-1" />
                        </motion.button>
                        <p className="text-xl font-serif italic text-white relative z-20">Click to Begin Streaming</p>
                    </div>
                ) : (
                    <div className="w-full h-full relative">
                        <iframe 
                            src={selectedLink?.url} 
                            className="w-full h-full"
                            allowFullScreen
                            allow="autoplay; encrypted-media"
                            sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin"
                        ></iframe>
                        <button 
                            onClick={() => setIsPlaying(false)}
                            className="absolute top-6 right-6 p-3 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 p-6 bg-white/5 border border-white/5 rounded-3xl">
                <Shield className="w-6 h-6 text-primary" />
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    <span className="text-white">Pro Tip:</span> If the video doesn't load or is slow, try switching the source from the dropdown above. We recommend using sources with the <span className="text-primary font-bold">4K</span> or <span className="text-primary font-bold">1080p</span> tag for the best experience.
                </p>
            </div>
        </section>
    );
}
