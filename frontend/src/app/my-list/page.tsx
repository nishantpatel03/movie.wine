'use client';

import { useUser } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import { BookMarked, Film, Loader2, Plus, Trash2, Tv, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { HomeNavBar } from '@/components/home/HomeNavBar';
import {
    createUserList,
    deleteUserList,
    getListWithItems,
    getUserLists,
    removeItemFromList,
    UserListFull,
    UserListSummary,
    getImageUrl,
} from '@/lib/api';

// ─── Media Card ────────────────────────────────────────────────────────────────
function MediaCard({
    item,
    onRemove,
}: {
    item: UserListFull['items'][0];
    onRemove: () => void;
}) {
    const poster = item.poster_path
        ? getImageUrl(item.poster_path, 'w185')
        : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative bg-white/[0.04] border border-white/8 rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:bg-white/[0.07]"
        >
            {/* Poster */}
            <div className="aspect-[2/3] bg-white/5 overflow-hidden">
                {poster ? (
                    <img
                        src={poster}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        {item.media_type === 'movie' ? (
                            <Film size={40} className="text-white/20" />
                        ) : (
                            <Tv size={40} className="text-white/20" />
                        )}
                    </div>
                )}
                {/* Remove overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                        onClick={onRemove}
                        className="p-3 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                        title="Remove from list"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Meta */}
            <div className="p-3">
                <p className="text-white text-sm font-semibold truncate leading-snug">{item.title}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-white/40 text-xs uppercase tracking-wider">
                    {item.media_type === 'movie' ? (
                        <><Film size={10} /> Movie</>
                    ) : (
                        <><Tv size={10} /> Series</>
                    )}
                </span>
            </div>
        </motion.div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function MyListPage() {
    const { user, isLoaded, isSignedIn } = useUser();

    const [lists, setLists] = useState<UserListSummary[]>([]);
    const [activeListId, setActiveListId] = useState<number | null>(null);
    const [activeList, setActiveList] = useState<UserListFull | null>(null);
    const [loading, setLoading] = useState(true);
    const [listLoading, setListLoading] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [showCreateInput, setShowCreateInput] = useState(false);
    const [creating, setCreating] = useState(false);

    const clerkId = user?.id;

    // ── Load all lists ──────────────────────────────────────────────────────────
    const fetchLists = useCallback(async () => {
        if (!clerkId) return;
        setLoading(true);
        try {
            const data = await getUserLists(clerkId);
            setLists(data);
            if (data.length > 0 && !activeListId) {
                setActiveListId(data[0].id);
            }
        } finally {
            setLoading(false);
        }
    }, [clerkId, activeListId]);

    useEffect(() => {
        if (isLoaded && isSignedIn) fetchLists();
        else if (isLoaded) setLoading(false);
    }, [isLoaded, isSignedIn, fetchLists]);

    // ── Load active list items ──────────────────────────────────────────────────
    useEffect(() => {
        if (!activeListId) { setActiveList(null); return; }
        setListLoading(true);
        getListWithItems(activeListId)
            .then(setActiveList)
            .finally(() => setListLoading(false));
    }, [activeListId]);

    // ── Create list ─────────────────────────────────────────────────────────────
    const handleCreate = async () => {
        const name = newListName.trim();
        if (!name || !clerkId) return;
        setCreating(true);
        try {
            const newList = await createUserList(clerkId, name);
            setLists(prev => [...prev, newList]);
            setActiveListId(newList.id);
            setNewListName('');
            setShowCreateInput(false);
        } finally {
            setCreating(false);
        }
    };

    // ── Delete list ─────────────────────────────────────────────────────────────
    const handleDeleteList = async (listId: number) => {
        await deleteUserList(listId);
        setLists(prev => prev.filter(l => l.id !== listId));
        if (activeListId === listId) {
            const remaining = lists.filter(l => l.id !== listId);
            setActiveListId(remaining.length > 0 ? remaining[0].id : null);
        }
    };

    // ── Remove item ─────────────────────────────────────────────────────────────
    const handleRemoveItem = async (tmdbId: number) => {
        if (!activeListId) return;
        await removeItemFromList(activeListId, tmdbId);
        setActiveList(prev =>
            prev ? { ...prev, items: prev.items.filter(i => i.tmdb_id !== tmdbId) } : prev
        );
        setLists(prev => prev.map(l =>
            l.id === activeListId ? { ...l, item_count: Math.max(0, l.item_count - 1) } : l
        ));
    };

    // ── Not signed in ───────────────────────────────────────────────────────────
    if (isLoaded && !isSignedIn) {
        return (
            <main className="min-h-screen bg-background-dark flex flex-col">
                <HomeNavBar />
                <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
                    <BookMarked size={64} className="text-white/10" />
                    <h1 className="text-white text-3xl font-black tracking-tight">Sign in to see your lists</h1>
                    <p className="text-white/40 text-base max-w-sm">Create collections of movies and series you want to watch.</p>
                    <Link href="/sign-in">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-xl"
                        >
                            Sign In
                        </motion.button>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background-dark flex flex-col">
            <HomeNavBar />

            <div className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-28 flex flex-col lg:flex-row gap-10">

                {/* ── Sidebar: List Tabs ── */}
                <aside className="w-full lg:w-72 shrink-0">
                    <div className="flex items-center gap-3 mb-6">
                        <BookMarked size={22} className="text-primary" />
                        <h1 className="text-white text-2xl font-black tracking-tight">
                            My <span className="text-primary italic">Lists</span>
                        </h1>
                    </div>

                    {loading ? (
                        <div className="flex items-center gap-2 text-white/40 py-6">
                            <Loader2 size={18} className="animate-spin" />
                            <span className="text-sm">Loading…</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {lists.map(lst => (
                                <div
                                    key={lst.id}
                                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all
                                        ${activeListId === lst.id
                                            ? 'bg-primary/15 border border-primary/30 text-primary'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                                        }`}
                                    onClick={() => setActiveListId(lst.id)}
                                >
                                    <BookMarked size={15} className="shrink-0" />
                                    <span className="flex-1 text-sm font-semibold truncate">{lst.name}</span>
                                    <span className="text-xs opacity-60 shrink-0">{lst.item_count}</span>
                                    <button
                                        onClick={e => { e.stopPropagation(); handleDeleteList(lst.id); }}
                                        className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all shrink-0"
                                        title="Delete list"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            ))}

                            {/* Create new list */}
                            {showCreateInput ? (
                                <div className="flex gap-2 mt-2">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newListName}
                                        onChange={e => setNewListName(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') handleCreate();
                                            if (e.key === 'Escape') setShowCreateInput(false);
                                        }}
                                        placeholder="List name…"
                                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-primary/60"
                                    />
                                    <button
                                        disabled={!newListName.trim() || creating}
                                        onClick={handleCreate}
                                        className="px-3 py-2 bg-primary text-black rounded-lg text-xs font-bold disabled:opacity-40"
                                    >
                                        {creating ? <Loader2 size={14} className="animate-spin" /> : 'Add'}
                                    </button>
                                    <button
                                        onClick={() => setShowCreateInput(false)}
                                        className="px-2 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowCreateInput(true)}
                                    className="mt-2 flex items-center gap-2 px-4 py-3 text-white/40 hover:text-white text-sm transition-colors rounded-xl hover:bg-white/5 border border-dashed border-white/10 hover:border-white/20"
                                >
                                    <Plus size={16} />
                                    New List
                                </button>
                            )}
                        </div>
                    )}
                </aside>

                {/* ── Main: Items Grid ── */}
                <div className="flex-1 min-w-0">
                    {!activeListId ? (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02] gap-4 text-center p-10">
                            <Film size={56} className="text-white/10" />
                            <p className="text-white/30 text-base font-medium">
                                {lists.length === 0
                                    ? 'Create your first list to start saving movies & series!'
                                    : 'Select a list to view its items'}
                            </p>
                            {lists.length === 0 && (
                                <button
                                    onClick={() => setShowCreateInput(true)}
                                    className="px-6 py-3 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors"
                                >
                                    Create List
                                </button>
                            )}
                        </div>
                    ) : listLoading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <Loader2 size={32} className="animate-spin text-primary" />
                        </div>
                    ) : (
                        <>
                            {/* List Header */}
                            <div className="flex items-center gap-3 mb-8">
                                <h2 className="text-white text-2xl font-black tracking-tight">
                                    {activeList?.name}
                                </h2>
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/40 text-xs font-bold">
                                    {activeList?.items.length || 0} items
                                </span>
                            </div>

                            {/* Items grid */}
                            {!activeList?.items.length ? (
                                <div className="min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02] gap-4 text-center p-10">
                                    <Film size={48} className="text-white/10" />
                                    <p className="text-white/30 text-sm">
                                        This list is empty. Browse movies & series and hit <strong className="text-white/50">+ My List</strong> to add them here.
                                    </p>
                                    <Link href="/movies">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-6 py-3 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-xl"
                                        >
                                            Browse Movies
                                        </motion.button>
                                    </Link>
                                </div>
                            ) : (
                                <motion.div
                                    layout
                                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4"
                                >
                                    <AnimatePresence>
                                        {activeList.items.map(item => (
                                            <MediaCard
                                                key={item.id}
                                                item={item}
                                                onRemove={() => handleRemoveItem(item.tmdb_id)}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
