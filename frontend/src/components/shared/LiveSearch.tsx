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
                const filtered = response.results.filter((res: any) => res.media_type === 'movie' || res.media_type === 'tv').slice(0, 5);
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
                        className="absolute top-14 right-0 w-80 bg-background-dark/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2 overflow-hidden"
                    >
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 py-2">
                            Top Results
                        </div>
                        <div className="flex flex-col gap-1">
                            {results.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/${item.media_type === 'tv' ? 'series' : 'movies'}/${createSlug(item.id, (item.title || item.name))}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/10 group transition-colors"
                                >
                                    <img
                                        src={getImageUrl(item.poster_path)}
                                        alt={item.title || item.name}
                                        className="w-12 h-16 object-cover rounded-lg border border-white/5"
                                    />
                                    <div className="flex flex-col">
                                        <h4 className="text-white text-sm font-bold line-clamp-1 group-hover:text-primary transition-colors">
                                            {item.title || item.name}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <span>{item.media_type === 'tv' ? 'Series' : 'Movie'}</span>
                                            <span>•</span>
                                            <span>{item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4)}</span>
                                            <span>•</span>
                                            <span className="flex items-center text-primary"><Search className="w-2 h-2 mr-1" />{item.vote_average?.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
