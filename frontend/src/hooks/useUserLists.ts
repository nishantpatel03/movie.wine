'use client';

import { useUser } from '@clerk/nextjs';
import { useCallback, useEffect, useState } from 'react';
import {
    addItemToList,
    checkItemInLists,
    createUserList,
    deleteUserList,
    getUserLists,
    removeItemFromList,
    UserListSummary,
} from '@/lib/api';

interface UseUserListsOptions {
    /** If provided, the hook will also fetch which lists contain this item */
    tmdbId?: number;
}

export function useUserLists({ tmdbId }: UseUserListsOptions = {}) {
    const { user, isSignedIn, isLoaded } = useUser();

    const [lists, setLists] = useState<UserListSummary[]>([]);
    const [listIdsContainingItem, setListIdsContainingItem] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clerkId = user?.id;

    // ── Fetch all lists ────────────────────────────────────────────────────────
    const fetchLists = useCallback(async () => {
        if (!clerkId) return;
        setLoading(true);
        try {
            const data = await getUserLists(clerkId);
            setLists(data);
        } catch (err) {
            setError('Failed to load lists');
        } finally {
            setLoading(false);
        }
    }, [clerkId]);

    // ── Fetch which lists contain a specific item ──────────────────────────────
    const fetchItemCheck = useCallback(async () => {
        if (!clerkId || !tmdbId) return;
        try {
            const data = await checkItemInLists(clerkId, tmdbId);
            setListIdsContainingItem(data.list_ids);
        } catch {
            // silently ignore — not critical
        }
    }, [clerkId, tmdbId]);

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchLists();
        }
    }, [isLoaded, isSignedIn, fetchLists]);

    useEffect(() => {
        if (isLoaded && isSignedIn && tmdbId) {
            fetchItemCheck();
        }
    }, [isLoaded, isSignedIn, tmdbId, fetchItemCheck]);

    // ── Actions ────────────────────────────────────────────────────────────────

    const createList = useCallback(async (name: string): Promise<UserListSummary | null> => {
        if (!clerkId) return null;
        try {
            const newList = await createUserList(clerkId, name);
            setLists(prev => [...prev, newList]);
            return newList;
        } catch {
            setError('Failed to create list');
            return null;
        }
    }, [clerkId]);

    const removeList = useCallback(async (listId: number) => {
        if (!clerkId) return;
        try {
            await deleteUserList(clerkId, listId);
            setLists(prev => prev.filter(l => l.id !== listId));
            setListIdsContainingItem(prev => prev.filter(id => id !== listId));
        } catch {
            setError('Failed to delete list');
        }
    }, [clerkId]);

    const addToList = useCallback(async (
        listId: number,
        item: { tmdb_id: number; media_type: 'movie' | 'tv'; title: string; poster_path?: string | null }
    ) => {
        if (!clerkId) return;
        try {
            await addItemToList(clerkId, listId, item);
            setLists(prev => prev.map(l =>
                l.id === listId ? { ...l, item_count: l.item_count + 1 } : l
            ));
            setListIdsContainingItem(prev =>
                prev.includes(listId) ? prev : [...prev, listId]
            );
        } catch {
            setError('Failed to add item');
        }
    }, [clerkId]);

    const removeFromList = useCallback(async (listId: number, tmdbIdToRemove: number) => {
        if (!clerkId) return;
        try {
            await removeItemFromList(clerkId, listId, tmdbIdToRemove);
            setLists(prev => prev.map(l =>
                l.id === listId ? { ...l, item_count: Math.max(0, l.item_count - 1) } : l
            ));
            setListIdsContainingItem(prev => prev.filter(id => id !== listId));
        } catch {
            setError('Failed to remove item');
        }
    }, [clerkId]);

    const isInAnyList = listIdsContainingItem.length > 0;

    return {
        lists,
        listIdsContainingItem,
        isInAnyList,
        loading,
        error,
        isSignedIn: isLoaded && isSignedIn,
        createList,
        removeList,
        addToList,
        removeFromList,
        refresh: fetchLists,
    };
}
