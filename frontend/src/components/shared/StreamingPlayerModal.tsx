'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, Monitor, Shield, Activity, X, Info, Globe } from 'lucide-react';
import { StreamingLink } from '@/lib/api';

interface StreamingPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    links: StreamingLink[];
    title: string;
}

export function StreamingPlayerModal({ isOpen, onClose, links, title }: StreamingPlayerModalProps) {
    const [selectedLink, setSelectedLink] = useState<StreamingLink | null>(links[0] || null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isSourceOpen, setIsSourceOpen] = useState(false);

    // Update selected link if links change or when modal opens
    useEffect(() => {
        if (isOpen && links.length > 0) {
            setSelectedLink(links[0]);
            setIsPlaying(true);
            setIsSourceOpen(false);
        }
    }, [isOpen, links]);

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
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-[#0d0d0d] border border-white/10 rounded-[32px] md:rounded-[48px] shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md sticky top-0 z-20">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/20 rounded-2xl hidden md:block">
                                    <Monitor className="text-primary w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-serif italic text-white leading-tight truncate max-w-[200px] md:max-w-md">
                                        {title}
                                    </h2>
                                    <p className="text-slate-400 text-xs md:text-sm font-medium mt-0.5">Cinematic Streaming Experience</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Source Selector in Header for Desktop */}
                                <div className="relative hidden md:block">
                                    <button 
                                        onClick={() => setIsSourceOpen(!isSourceOpen)}
                                        className="flex items-center gap-4 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Shield className="w-4 h-4 text-primary" />
                                            <div className="text-left">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 leading-none mb-1">Source</p>
                                                <p className="text-xs font-bold text-white leading-none">{selectedLink?.provider_name} ({selectedLink?.quality})</p>
                                            </div>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isSourceOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isSourceOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-2xl"
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
                                                            <p className={`font-bold text-xs ${selectedLink?.id === link.id ? 'text-primary' : 'text-white'}`}>{link.provider_name}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Activity className="w-3 h-3 text-slate-500" />
                                                                <span className="text-[10px] font-bold text-slate-500 uppercase">{link.quality}</span>
                                                            </div>
                                                        </div>
                                                        {selectedLink?.id === link.id && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button 
                                    onClick={onClose} 
                                    className="p-3 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Player Content */}
                        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
                            {!isPlaying ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 z-10 p-8 text-center">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsPlaying(true)}
                                        className="w-24 h-24 md:w-32 md:h-32 bg-primary rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(255,179,71,0.5)] relative z-20 group"
                                    >
                                        <Play className="w-10 h-10 md:w-14 md:h-14 text-black fill-current translate-x-1" />
                                    </motion.button>
                                    <div className="relative z-20">
                                        <h3 className="text-2xl md:text-3xl font-serif italic text-white mb-2">Ready to Start?</h3>
                                        <p className="text-slate-400 font-medium max-w-md">Click the button above to begin streaming from <span className="text-primary font-bold">{selectedLink?.provider_name}</span> in <span className="text-primary font-bold">{selectedLink?.quality}</span> quality.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full relative aspect-video max-h-[70vh] bg-black">
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
                                                className="w-full h-full"
                                                allowFullScreen
                                                allow="autoplay; encrypted-media"
                                                referrerPolicy="no-referrer"
                                                sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin"
                                            ></iframe>
                                            
                                            {/* Link Fallback Overlay */}
                                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                                                <a 
                                                    href={selectedLink.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-primary text-[10px] font-bold uppercase tracking-wider hover:bg-primary hover:text-black transition-all flex items-center gap-2"
                                                >
                                                    <Play className="w-3 h-3 fill-current" />
                                                    Open in New Tab (If player doesn't load)
                                                </a>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500">
                                            <Globe className="w-12 h-12 mb-4 opacity-20" />
                                            <p className="font-serif italic text-lg">No playback link available</p>
                                        </div>
                                    )}
                                    
                                    {/* Mobile Source Toggle Overlay */}
                                    <div className="absolute bottom-6 left-6 md:hidden">
                                        <button 
                                            onClick={() => setIsSourceOpen(!isSourceOpen)}
                                            className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-white text-xs font-bold"
                                        >
                                            Switch Source
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer / Controls */}
                        <div className="p-6 md:p-8 bg-white/5 border-t border-white/5 backdrop-blur-md">
                            <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                                <div className="flex items-center gap-4 text-slate-500">
                                    <Info className="w-5 h-5 text-primary shrink-0" />
                                    <p className="text-[11px] md:text-xs leading-relaxed font-medium">
                                        <span className="text-white">Pro Tip:</span> If the video doesn't load or is slow, use the <span className="text-primary font-bold">Source Selector</span> to try a different provider. We recommend <span className="text-primary font-bold">4K</span> or <span className="text-primary font-bold">1080p</span> sources for the best cinematic experience.
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 bg-white/5 rounded-md border border-white/10 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Secure Stream</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
