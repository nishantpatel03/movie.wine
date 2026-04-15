'use client';

import { useClerk } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Loader2, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useUserLists } from '@/hooks/useUserLists';

interface AddToListButtonProps {
    tmdbId: number;
    mediaType: 'movie' | 'tv';
    title: string;
    posterPath?: string | null;
    /** Optional: icon-only compact mode */
    compact?: boolean;
    isHero?: boolean;
}

export function AddToListButton({
    tmdbId,
    mediaType,
    title,
    posterPath,
    compact = false,
    isHero = false,
}: AddToListButtonProps) {
    const [open, setOpen] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { openSignIn } = useClerk();

    const {
        lists,
        listIdsContainingItem,
        isInAnyList,
        loading,
        isSignedIn,
        createList,
        addToList,
        removeFromList,
        removeList,
    } = useUserLists({ tmdbId });

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleButtonClick = () => {
        if (!isSignedIn) {
            openSignIn?.();
            return;
        }
        setOpen(prev => !prev);
    };

    const handleToggleItem = async (listId: number) => {
        setActionLoading(listId);
        if (listIdsContainingItem.includes(listId)) {
            await removeFromList(listId, tmdbId);
        } else {
            await addToList(listId, { tmdb_id: tmdbId, media_type: mediaType, title, poster_path: posterPath });
        }
        setActionLoading(null);
    };

    const handleCreateAndAdd = async () => {
        const name = newListName.trim();
        if (!name) return;
        setActionLoading(-1);
        const newList = await createList(name);
        if (newList) {
            await addToList(newList.id, { tmdb_id: tmdbId, media_type: mediaType, title, poster_path: posterPath });
        }
        setNewListName('');
        setShowInput(false);
        setActionLoading(null);
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {/* Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleButtonClick}
                className={`flex items-center gap-2 font-black uppercase tracking-widest transition-all rounded-2xl border
                    ${isInAnyList
                        ? 'bg-primary border-primary text-black hover:bg-primary/90 shadow-[0_8px_20px_-4px_rgba(244,192,37,0.4)]'
                        : isHero
                            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }
                    ${compact ? 'p-3' : isHero ? 'px-6 py-3.5 lg:px-8 lg:py-4' : 'px-5 py-3'}
                    ${isHero ? 'text-[11px]' : 'text-xs'}
                `}
                title={isInAnyList ? 'In your list' : 'Add to list'}
            >
                {isInAnyList ? (
                    <Check size={isHero ? 18 : 16} className="shrink-0" strokeWidth={3} />
                ) : (
                    <Plus size={isHero ? 18 : 16} className="shrink-0" />
                )}
                {!compact && <span>{isInAnyList ? 'In My List' : 'My List'}</span>}
                {!compact && <ChevronDown size={isHero ? 14 : 12} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />}
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 400, 
                            damping: 30 
                        }}
                        className="absolute z-[100] top-full mt-4 right-0 w-80 bg-[#12110b]/90 border border-white/10 rounded-[24px] shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden glassmorphism origin-top-right"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/5">
                            <span className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Save to list</span>
                            <button onClick={() => setOpen(false)} className="bg-white/5 hover:bg-white/20 p-1.5 rounded-full transition-all text-white/40 hover:text-white">
                                <X size={14} />
                            </button>
                        </div>

                        <div className="max-h-64 overflow-y-auto no-scrollbar py-2">
                            {loading ? (
                                <div className="flex items-center justify-center py-10 opacity-30">
                                    <Loader2 size={24} className="animate-spin text-primary" />
                                </div>
                            ) : lists.length === 0 ? (
                                <div className="text-center py-10 px-6 opacity-30">
                                    <p className="text-[10px] font-black uppercase tracking-widest">No custom lists found</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1 px-2">
                                    {lists.map(lst => {
                                        const isAdded = listIdsContainingItem.includes(lst.id);
                                        const isProcessing = actionLoading === lst.id;
                                        return (
                                            <div key={lst.id} className="group relative flex items-center px-4 py-3 rounded-[14px] hover:bg-white/5 transition-all">
                                                <button
                                                    disabled={isProcessing}
                                                    onClick={() => handleToggleItem(lst.id)}
                                                    className="flex items-center gap-4 flex-1 text-left"
                                                >
                                                    {/* Checkbox */}
                                                    <div className={`w-6 h-6 rounded-[8px] border-2 flex items-center justify-center shrink-0 transition-all duration-300
                                                        ${isAdded
                                                            ? 'bg-primary border-primary shadow-[0_0_15px_rgba(244,192,37,0.3)]'
                                                            : 'border-white/10 bg-white/5 group-hover:border-white/30'
                                                        }`}>
                                                        {isAdded && <Check size={14} className="text-black" strokeWidth={4} />}
                                                    </div>
    
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-bold truncate transition-colors ${isAdded ? 'text-primary' : 'text-white'}`}>{lst.name}</p>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{lst.item_count} items</p>
                                                    </div>
    
                                                    {isProcessing ? (
                                                        <Loader2 size={16} className="animate-spin text-primary shrink-0" />
                                                    ) : isAdded && (
                                                        <Check size={14} className="text-primary opacity-40 shrink-0" />
                                                    )}
                                                </button>
    
                                                {/* Delete list button */}
                                                <button
                                                    onClick={() => removeList(lst.id)}
                                                    className="ml-2 text-white/10 hover:text-red-500/80 transition-all opacity-0 group-hover:opacity-100 p-2"
                                                    title="Delete list"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                            }
                        </div>

                        {/* New list input */}
                        <div className="px-6 py-5 border-t border-white/5 bg-white/5">
                            {showInput ? (
                                <div className="flex flex-col gap-3">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newListName}
                                        onChange={e => setNewListName(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') handleCreateAndAdd();
                                            if (e.key === 'Escape') setShowInput(false);
                                        }}
                                        placeholder="Enter list name…"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-primary/50 transition-all"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            disabled={!newListName.trim() || actionLoading === -1}
                                            onClick={handleCreateAndAdd}
                                            className="flex-1 h-10 bg-primary text-black rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-40 hover:bg-primary/90 transition-all"
                                        >
                                            {actionLoading === -1 ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Create and Save'}
                                        </button>
                                        <button
                                            onClick={() => setShowInput(false)}
                                            className="w-10 h-10 flex items-center justify-center bg-white/5 text-white/40 rounded-xl hover:bg-white/10 hover:text-white transition-all outline-none"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowInput(true)}
                                    className="w-full h-12 flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-primary hover:border-primary/40 transition-all"
                                >
                                    <Plus size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">New List</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
