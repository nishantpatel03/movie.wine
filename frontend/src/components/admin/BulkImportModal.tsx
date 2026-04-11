'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { addStreamingLink, getImageUrl } from '@/lib/api';

interface ParsedEpisode {
    name: string;
    url: string;
    season: number;
    episode: number;
}

interface BulkImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    tmdbId: number;
    title: string;
    posterPath?: string | null;
    seasonNumber?: number;
    onSuccess?: () => void;
}

export function BulkImportModal({ 
    isOpen, 
    onClose, 
    tmdbId, 
    title, 
    posterPath,
    seasonNumber,
    onSuccess 
}: BulkImportModalProps) {
    const { user } = useUser();
    const [rawData, setRawData] = useState('');
    const [parsedEpisodes, setParsedEpisodes] = useState<ParsedEpisode[]>([]);
    const [importedCount, setImportedCount] = useState(0);
    const [failedCount, setFailedCount] = useState(0);
    const [isImporting, setIsImporting] = useState(false);
    const [hasParsed, setHasParsed] = useState(false);
    const [parseError, setParseError] = useState<string | null>(null);

    const parseEpisodeData = (data: string): ParsedEpisode[] => {
        const episodes: ParsedEpisode[] = [];
        const lines = data.trim().split('\n');
        console.log('Raw data lines:', lines.length);
        
        const episodePattern = /S0*(\d+)E0*(\d+)/i;
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            
            let namePart = '';
            let urlPart = '';
            
            if (trimmedLine.includes('|')) {
                const parts = trimmedLine.split('|');
                namePart = parts[0];
                urlPart = parts.slice(1).join('|');
            } else if (trimmedLine.includes('\t')) {
                const parts = trimmedLine.split('\t');
                namePart = parts[0];
                urlPart = parts.slice(1).join('\t');
            } else if (trimmedLine.includes(' ')) {
                const parts = trimmedLine.split(/\s+/);
                namePart = parts[0];
                urlPart = parts.slice(1).join(' ');
            }
            
            if (!namePart || !urlPart) {
                console.log('Skipping line - could not parse:', trimmedLine);
                continue;
            }
            
            const trimmedName = namePart.trim();
            const trimmedUrl = urlPart.trim();
            
            const match = trimmedName.match(episodePattern);
            
            if (match) {
                episodes.push({
                    name: trimmedName,
                    url: trimmedUrl,
                    season: parseInt(match[1]),
                    episode: parseInt(match[2])
                });
            }
        }
        
        console.log('Final episodes:', episodes);
        return episodes;
    };

    const handleParse = () => {
        setParseError(null);
        const parsed = parseEpisodeData(rawData);
        console.log('Parsed episodes:', parsed);
        
        if (parsed.length === 0) {
            setParseError('No episodes found. Check your data format: Filename|URL (one per line)');
            return;
        }
        
        setParsedEpisodes(parsed);
        setHasParsed(true);
    };

    const handleImport = async () => {
        if (!user || parsedEpisodes.length === 0) return;

        setIsImporting(true);
        let successCount = 0;
        let failCount = 0;

        for (const ep of parsedEpisodes) {
            try {
                await addStreamingLink(user.id, {
                    tmdb_id: tmdbId,
                    media_type: 'tv',
                    title: ep.name,
                    poster_path: posterPath,
                    url: ep.url,
                    provider_name: 'Direct',
                    quality: '1080p',
                    season_number: ep.season,
                    episode_number: ep.episode
                });
                successCount++;
            } catch (error) {
                console.error('Error importing:', error);
                failCount++;
            }
        }

        setImportedCount(successCount);
        setFailedCount(failCount);
        setIsImporting(false);
        onSuccess?.();
    };

    const handleClose = () => {
        setRawData('');
        setParsedEpisodes([]);
        setHasParsed(false);
        setImportedCount(0);
        setFailedCount(0);
        setParseError(null);
        onClose();
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
                        onClick={handleClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-[#0d0d0d] border border-white/10 rounded-[40px] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-white/5 flex items-center gap-6 bg-white/5">
                            <img 
                                src={getImageUrl(posterPath)} 
                                alt={title}
                                className="w-20 h-28 object-cover rounded-lg shadow-lg border border-white/10" 
                            />
                            <div className="flex-1">
                                <h2 className="text-2xl font-serif italic text-white flex items-center gap-3">
                                    <Upload className="w-6 h-6 text-primary" />
                                    Bulk Import Episodes
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">
                                    Paste episode data for {title} {seasonNumber ? `S${seasonNumber}` : ''}
                                </p>
                            </div>
                            <button onClick={handleClose} className="p-3 rounded-full hover:bg-white/10 transition-colors text-slate-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {!hasParsed && !isImporting ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                            Paste Episode Data
                                        </label>
                                        <p className="text-slate-500 text-xs mb-2">
                                            Format: Filename|URL (one per line)
                                        </p>
                                        <textarea
                                            value={rawData}
                                            onChange={(e) => setRawData(e.target.value)}
                                            placeholder={`Can.This.Love.Be.Translated.S01E04.1080p.10bit.WEB-DL.HIN-KOR.5.1.ESub-KatDrama.mkv|https://short.icu/hLp0uxA0I\nCan.This.Love.Be.Translated.S01E01.1080p.10bit.WEB-DL.HIN-KOR.5.1.ESub-KatDrama.mkv|https://short.icu/lP61sBTpH`}
                                            className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="flex-1 px-8 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all border border-white/10"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleParse}
                                            disabled={!rawData.trim()}
                                            className="flex-1 px-8 py-4 rounded-2xl bg-primary text-black font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <Upload className="w-5 h-5" />
                                            PARSE DATA
                                        </button>
                                    </div>
                                </>
                            ) : isImporting ? (
                                <div className="text-center py-12 space-y-4">
                                    <Loader className="w-12 h-12 text-primary animate-spin mx-auto" />
                                    <p className="text-white font-bold text-lg">Importing Episodes...</p>
                                    <p className="text-slate-500">{parsedEpisodes.length} episodes remaining</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {parseError ? (
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                                            <AlertCircle className="w-6 h-6 text-red-400" />
                                            <div>
                                                <p className="text-red-400 font-bold">Parse Error</p>
                                                <p className="text-red-400/60 text-sm">{parseError}</p>
                                            </div>
                                        </div>
                                    ) : importedCount > 0 ? (
                                        <>
                                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
                                                <CheckCircle className="w-6 h-6 text-green-400" />
                                                <div>
                                                    <p className="text-green-400 font-bold">Import Complete!</p>
                                                    <p className="text-green-400/60 text-sm">{importedCount} episodes imported successfully</p>
                                                </div>
                                            </div>

                                            {failedCount > 0 && (
                                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                                                    <AlertCircle className="w-6 h-6 text-red-400" />
                                                    <div>
                                                        <p className="text-red-400 font-bold">Failed Imports</p>
                                                        <p className="text-red-400/60 text-sm">{failedCount} episodes failed to import</p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : null}

                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Parsed Episodes ({parsedEpisodes.length})</h3>
                                        <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                            {parsedEpisodes.map((ep, i) => (
                                                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-primary font-bold text-sm">S{ep.season}E{ep.episode}</span>
                                                        <span className="text-white/60 text-xs truncate max-w-[300px]">{ep.name}</span>
                                                    </div>
                                                    <span className="text-green-400 text-xs">{ep.url.substring(0, 30)}...</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {importedCount === 0 && (
                                        <button
                                            type="button"
                                            onClick={handleImport}
                                            disabled={!user || parsedEpisodes.length === 0}
                                            className="w-full px-8 py-4 rounded-2xl bg-primary text-black font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <Upload className="w-5 h-5" />
                                            IMPORT {parsedEpisodes.length} EPISODES
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className={`w-full px-8 py-4 rounded-2xl font-bold transition-all ${
                                            importedCount > 0 
                                            ? 'bg-primary text-black hover:bg-primary/90' 
                                            : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                        }`}
                                    >
                                        {importedCount > 0 ? 'Done' : 'Cancel'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}