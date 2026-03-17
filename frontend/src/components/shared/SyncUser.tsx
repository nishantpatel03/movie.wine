'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { syncUser } from '@/lib/api';

export default function SyncUser() {
    const { user, isLoaded, isSignedIn } = useUser();

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            const sync = async () => {
                try {
                    await syncUser({
                        clerk_id: user.id,
                        username: user.username || user.firstName || 'Anonymous',
                        avatar_url: user.imageUrl,
                    });
                } catch (error) {
                    console.error("Failed to sync user with backend:", error);
                }
            };
            sync();
        }
    }, [isLoaded, isSignedIn, user]);

    return null;
}
