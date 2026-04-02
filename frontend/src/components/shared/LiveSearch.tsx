'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { searchMulti, getImageUrl, createSlug } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function LiveSearch() {
    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebounce(query, 500);
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchResults() {
            if (debouncedQuery.trim().length === 0) {
                setResults([]);
                setIsOpen(false);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            try {
                const response = await searchMulti(debouncedQuery);
                // Filter out irrelevant results like people, keep only movies/tv
                const filtered = response.results.filter((res: any) => res.media_type === 'movie' || res.media_type === 'tv').slice(0, 15);
                setResults(filtered);
                setIsOpen(true);
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setIsSearching(false);
            }
        }

        fetchResults();
    }, [debouncedQuery]);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={wrapperRef} className="relative z-50">
            {/* Search Input */}
            <div className="hidden lg:flex items-center bg-white/10 border border-white/10 rounded-full px-4 py-2 focus-within:ring-1 focus-within:ring-primary/50 focus-within:bg-white/20 transition-all focus-within:w-72 w-64 group">
                <Search className="text-white/50 w-4 h-4 shrink-0 mr-3 group-focus-within:text-primary transition-colors" />
                <input
                    className="bg-transparent text-sm focus:outline-none placeholder:text-slate-400 text-white w-full"
                    placeholder="Search movies & series..."
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                />
                {isSearching && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
            </div>

            {/* Dropdown Results */}
            <AnimatePresence>
                {isOpen && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-14 right-0 w-96 bg-[#0a0904]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 overflow-hidden"
                    >
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 py-3 border-b border-white/5 flex items-center justify-between">
                            <span>Top Results</span>
                            <span className="text-primary/50 lowercase font-medium">{results.length} found</span>
                        </div>

                        {/* Scrollable Container */}
                        <div className="max-h-[450px] overflow-y-auto custom-scrollbar flex flex-col gap-1 mt-2 pr-1">
                            {results.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/${item.media_type === 'tv' ? 'series' : 'movies'}/${createSlug(item.id, (item.title || item.name))}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 group transition-colors border border-transparent hover:border-white/5"
                                >
                                    <div className="w-12 h-16 shrink-0 relative overflow-hidden rounded-lg bg-white/5 border border-white/5">
                                        {item.poster_path ? (
                                            <img
                                                src={getImageUrl(item.poster_path, 'w92')}
                                                alt={item.title || item.name}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/92x138?text=No+Image';
                                                    (e.target as HTMLImageElement).onerror = null;
                                                }}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                <Search className="w-4 h-4 text-white/20" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white text-sm font-bold line-clamp-1 group-hover:text-primary transition-colors">
                                            {item.title || item.name}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${item.media_type === 'tv' ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-400'}`}>
                                                {item.media_type === 'tv' ? 'Series' : 'Movie'}
                                            </span>
                                            <span className="text-white/20 text-[10px]">•</span>
                                            <span className="text-xs text-white/40 font-medium">
                                                {item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4) || 'TBA'}
                                            </span>
                                            <span className="text-white/20 text-[10px]">•</span>
                                            <div className="flex items-center text-xs font-bold text-yellow-500">
                                                <span className="material-symbols-outlined text-[14px] mr-1">star</span>
                                                {item.vote_average?.toFixed(1) || '0.0'}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* View All / Footer */}
                        <div className="mt-2 pt-2 border-t border-white/5 text-center">
                            <button 
                                className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-primary transition-colors py-2 w-full"
                                onClick={() => setIsOpen(false)}
                            >
                                Close Results
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
