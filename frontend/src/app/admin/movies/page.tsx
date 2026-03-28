'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, ExternalLink, Film } from 'lucide-react';
import { searchMulti, getImageUrl, getStreamingLinks, deleteStreamingLink, StreamingLink } from '@/lib/api';
import { useUser } from '@clerk/nextjs';
import { AddLinkModal } from '@/components/admin/AddLinkModal';

export default function AdminMoviesPage() {
    const { user } = useUser();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<any>(null);
    const [existingLinks, setExistingLinks] = useState<StreamingLink[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            setIsSearching(true);
            const data = await searchMulti(query);
            setResults(data.results.filter((item: any) => item.media_type === 'movie'));
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const selectMovie = async (movie: any) => {
        setSelectedMovie(movie);
        try {
            const links = await getStreamingLinks(movie.id, 'movie');
            setExistingLinks(links);
        } catch (error) {
            console.error('Error fetching links:', error);
        }
    };

    const handleDelete = async (linkId: number) => {
        if (!user || !confirm('Are you sure you want to delete this link?')) return;
        try {
            await deleteStreamingLink(user.id, linkId);
            setExistingLinks(existingLinks.filter(l => l.id !== linkId));
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif italic text-white">Movie Links</h1>
                    <p className="text-slate-400 mt-1">Attach streaming URLs to movies.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Search Column */}
                <div className="lg:col-span-1 space-y-6">
                    <form onSubmit={handleSearch} className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search for a movie..." 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {isSearching ? (
                            [1,2,3].map(i => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl" />)
                        ) : results.length > 0 ? (
                            results.map((movie) => (
                                <button
                                    key={movie.id}
                                    onClick={() => selectMovie(movie)}
                                    className={`w-full flex gap-4 p-3 rounded-2xl border transition-all text-left ${
                                        selectedMovie?.id === movie.id 
                                        ? 'bg-primary/10 border-primary/30' 
                                        : 'bg-white/5 border-white/5 hover:border-white/10'
                                    }`}
                                >
                                    <img src={getImageUrl(movie.poster_path, 'w185')} alt="" className="w-16 h-20 object-cover rounded-lg shadow-lg" />
                                    <div className="flex-1 min-w-0 py-1">
                                        <h4 className="text-white font-bold truncate">{movie.title}</h4>
                                        <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-tighter">{movie.release_date?.substring(0, 4)}</p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                                <Film className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                                <p className="text-slate-500 text-sm italic">Search to begin</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Management Column */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {selectedMovie ? (
                            <motion.div
                                key={selectedMovie.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="glassmorphism p-8 rounded-[32px] border border-white/5 flex gap-8 items-start bg-gradient-to-br from-white/5 to-transparent">
                                    <img src={getImageUrl(selectedMovie.poster_path)} alt="" className="w-32 h-48 object-cover rounded-xl shadow-2xl border border-white/10" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-3xl font-serif italic text-white">{selectedMovie.title}</h2>
                                                <p className="text-primary font-bold text-sm tracking-widest mt-1">{selectedMovie.release_date?.substring(0, 4)}</p>
                                            </div>
                                            <button 
                                                onClick={() => setIsAddModalOpen(true)}
                                                className="bg-primary text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                            >
                                                <Plus className="w-5 h-5" />
                                                ADD LINK
                                            </button>
                                        </div>
                                        <p className="text-slate-400 text-sm mt-4 line-clamp-3 leading-relaxed">{selectedMovie.overview}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500 pl-4">Existing Links ({existingLinks.length})</h3>
                                    {existingLinks.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {existingLinks.map((link) => (
                                                <div key={link.id} className="glassmorphism p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                                            <ExternalLink className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <h4 className="text-white font-bold">{link.provider_name}</h4>
                                                                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-md font-bold uppercase">{link.quality}</span>
                                                            </div>
                                                            <p className="text-slate-500 text-xs mt-1 font-medium truncate max-w-md">{link.url}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleDelete(link.id)}
                                                            className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-12 text-center border border-dashed border-white/10 rounded-3xl">
                                            <p className="text-slate-500 italic">No streaming links added for this movie yet.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-[400px] flex items-center justify-center border border-dashed border-white/10 rounded-[40px] text-slate-500 font-serif italic text-xl">
                                Select a movie from the search results to manage links.
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AddLinkModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                tmdbId={selectedMovie?.id}
                mediaType="movie"
                title={selectedMovie?.title}
                onSuccess={(newLink) => setExistingLinks([...existingLinks, newLink])}
            />
        </div>
    );
}
