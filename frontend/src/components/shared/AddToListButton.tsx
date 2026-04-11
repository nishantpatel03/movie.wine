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
                        ? 'bg-primary/20 border-primary text-primary hover:bg-primary/30 shadow-[0_0_20px_rgba(244,192,37,0.1)]'
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
                    <Check size={isHero ? 20 : 16} className="shrink-0" />
                ) : (
                    <Plus size={isHero ? 20 : 16} className="shrink-0" />
                )}
                {!compact && <span>{isInAnyList ? 'MY LIST' : 'MY LIST'}</span>}
                {!compact && <ChevronDown size={isHero ? 16 : 14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />}
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 top-full mt-2 right-0 w-72 bg-[#1a1910] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                            <span className="text-white font-bold text-sm">Save to list</span>
                            <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Lists */}
                        <div className="max-h-56 overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 size={20} className="animate-spin text-primary" />
                                </div>
                            ) : lists.length === 0 ? (
                                <p className="text-white/40 text-xs text-center py-6 px-4">
                                    No lists yet. Create one below!
                                </p>
                            ) : (
                                lists.map(lst => {
                                    const isAdded = listIdsContainingItem.includes(lst.id);
                                    const isProcessing = actionLoading === lst.id;
                                    return (
                                        <div key={lst.id} className="flex items-center px-4 py-3 hover:bg-white/5 transition-colors group">
                                            <button
                                                disabled={isProcessing}
                                                onClick={() => handleToggleItem(lst.id)}
                                                className="flex items-center gap-3 flex-1 text-left"
                                            >
                                                {/* Checkbox */}
                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all
                                                    ${isAdded
                                                        ? 'bg-primary border-primary'
                                                        : 'border-white/30 bg-transparent'
                                                    }`}>
                                                    {isAdded && <Check size={12} className="text-black" strokeWidth={3} />}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-sm font-medium truncate">{lst.name}</p>
                                                    <p className="text-white/40 text-xs">{lst.item_count} items</p>
                                                </div>

                                                {isProcessing && (
                                                    <Loader2 size={14} className="animate-spin text-primary shrink-0" />
                                                )}
                                            </button>

                                            {/* Delete list button */}
                                            <button
                                                onClick={() => removeList(lst.id)}
                                                className="ml-2 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete list"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* New list input */}
                        <div className="px-4 py-3 border-t border-white/10">
                            {showInput ? (
                                <div className="flex gap-2">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newListName}
                                        onChange={e => setNewListName(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') handleCreateAndAdd();
                                            if (e.key === 'Escape') setShowInput(false);
                                        }}
                                        placeholder="List name…"
                                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-primary/60 transition-colors"
                                    />
                                    <button
                                        disabled={!newListName.trim() || actionLoading === -1}
                                        onClick={handleCreateAndAdd}
                                        className="px-3 py-2 bg-primary text-black rounded-lg font-bold text-xs disabled:opacity-40 hover:bg-primary/90 transition-colors"
                                    >
                                        {actionLoading === -1 ? <Loader2 size={14} className="animate-spin" /> : 'Add'}
                                    </button>
                                    <button
                                        onClick={() => setShowInput(false)}
                                        className="px-3 py-2 bg-white/10 text-white rounded-lg text-xs hover:bg-white/20 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowInput(true)}
                                    className="w-full flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors py-1"
                                >
                                    <Plus size={16} />
                                    <span>Create new list</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
