'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useNotificationStore } from '@/stores/notifications-store';

export function useNotifications() {
    const { user, isLoaded } = useUser();
    const { fetchUnreadCount } = useNotificationStore();
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isLoaded || !user) return;

        // Initial fetch
        fetchUnreadCount(user.id);

        const startPolling = () => {
            if (pollIntervalRef.current) return;
            pollIntervalRef.current = setInterval(() => {
                if (document.visibilityState === 'visible') {
                    fetchUnreadCount(user.id);
                }
            }, 30000); // 30 seconds polling
        };

        const stopPolling = () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
        };

        // Window visibility handler
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchUnreadCount(user.id);
                startPolling();
            } else {
                stopPolling();
            }
        };

        // Initial start
        startPolling();
        
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            stopPolling();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isLoaded, user, fetchUnreadCount]);
}
