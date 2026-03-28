'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Shield, Activity, Plus, Save } from 'lucide-react';
import { addStreamingLink, StreamingLink } from '@/lib/api';

interface AddLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    tmdbId: number;
    mediaType: 'movie' | 'tv';
    title: string;
    posterPath?: string | null;
    seasonNumber?: number;
    episodeNumber?: number;
    onSuccess?: (link: StreamingLink) => void;
}

export function AddLinkModal({ 
    isOpen, 
    onClose, 
    tmdbId, 
    mediaType, 
    title, 
    posterPath,
    seasonNumber, 
    episodeNumber,
    onSuccess 
}: AddLinkModalProps) {
    const { user } = useUser();
    const [url, setUrl] = useState('');
    const [provider, setProvider] = useState('Direct');
    const [quality, setQuality] = useState('HD');
    const [sNum, setSNum] = useState<number | ''>(seasonNumber || '');
    const [eNum, setENum] = useState<number | ''>(episodeNumber || '');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setUrl('');
            setProvider('Direct');
            setQuality('HD');
            setSNum(seasonNumber || '');
            setENum(episodeNumber || '');
            setIsPreviewOpen(false);
        }
    }, [isOpen, seasonNumber, episodeNumber]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !url) return;

        try {
            setIsSubmitting(true);
            const newLink = await addStreamingLink(user.id, {
                tmdb_id: tmdbId,
                media_type: mediaType,
                title,
                poster_path: posterPath,
                url,
                provider_name: provider,
                quality,
                season_number: typeof sNum === 'number' ? sNum : undefined,
                episode_number: typeof eNum === 'number' ? eNum : undefined
            });
            onSuccess?.(newLink);
            onClose();
        } catch (error) {
            console.error('Error adding link:', error);
            alert('Failed to add link. Check console for details.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-[#0d0d0d] border border-white/10 rounded-[40px] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <div>
                                <h2 className="text-2xl font-serif italic text-white flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">add_link</span>
                                    Add Streaming Link
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">
                                    {title} {mediaType === 'tv' && `(S${seasonNumber} E${episodeNumber})`}
                                </p>
                            </div>
                            <button onClick={onClose} className="p-3 rounded-full hover:bg-white/10 transition-colors text-slate-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-2">
                            {/* Left: Form */}
                            <div className="p-8 space-y-8 border-r border-white/5">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Embed URL</label>
                                        <div className="relative group">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                            <input 
                                                type="url" 
                                                required
                                                placeholder="https://vidsrc.to/embed/movie/..." 
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {mediaType === 'tv' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Season Number</label>
                                                <input 
                                                    type="number" 
                                                    min="0"
                                                    placeholder="e.g. 1" 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                                                    value={sNum}
                                                    onChange={(e) => setSNum(e.target.value === '' ? '' : parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Episode Number</label>
                                                <input 
                                                    type="number" 
                                                    min="1"
                                                    placeholder="e.g. 1" 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                                                    value={eNum}
                                                    onChange={(e) => setENum(e.target.value === '' ? '' : parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Provider</label>
                                            <div className="relative group">
                                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary" />
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. Vidsrc" 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                                                    value={provider}
                                                    onChange={(e) => setProvider(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Quality</label>
                                            <div className="relative group">
                                                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary" />
                                                <select 
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all font-medium appearance-none"
                                                    value={quality}
                                                    onChange={(e) => setQuality(e.target.value)}
                                                >
                                                    <option value="4K">4K Ultra HD</option>
                                                    <option value="1080p">1080p Full HD</option>
                                                    <option value="HD">HD</option>
                                                    <option value="SD">SD</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                                            className="flex-1 px-8 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/10"
                                        >
                                            {isPreviewOpen ? 'CLOSE PREVIEW' : 'TEST LINK'}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !url}
                                            className="flex-1 px-8 py-4 rounded-2xl bg-primary text-black font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-black/30 border-t-black animate-spin rounded-full"></div>
                                            ) : (
                                                <>
                                                    <Save className="w-5 h-5" />
                                                    SAVE LINK
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Right: Live Preview */}
                            <div className="bg-black/50 p-8 flex flex-col items-center justify-center relative min-h-[400px]">
                                {isPreviewOpen && url ? (
                                    <div className="w-full h-full flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">LIVE PREVIEW</span>
                                            <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{url}</span>
                                        </div>
                                        <div className="flex-1 bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative aspect-video">
                                            <iframe 
                                                src={url} 
                                                className="w-full h-full"
                                                allowFullScreen
                                                sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin"
                                            ></iframe>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-4">
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-dashed border-white/20">
                                            <Globe className="w-8 h-8 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-white font-serif italic text-lg">No Link Active</p>
                                            <p className="text-slate-500 text-sm max-w-[240px] mt-2">Enter an embed URL on the left and click "Test Link" to verify the stream.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
