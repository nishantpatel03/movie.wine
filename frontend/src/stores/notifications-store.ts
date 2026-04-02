import { create } from 'zustand';
import { Notification, getUnreadNotificationCount, markAllNotificationsAsRead } from '@/lib/api';

interface NotificationState {
    unreadCount: number;
    setUnreadCount: (count: number) => void;
    fetchUnreadCount: (userId: string) => Promise<void>;
    markAllRead: (userId: string) => Promise<void>;
    incrementUnread: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    unreadCount: 0,
    setUnreadCount: (count) => set({ unreadCount: count }),
    fetchUnreadCount: async (userId) => {
        try {
            const { unread_count } = await getUnreadNotificationCount(userId);
            set({ unreadCount: unread_count });
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    },
    markAllRead: async (userId) => {
        // Optimistic update
        set({ unreadCount: 0 });
        try {
            await markAllNotificationsAsRead(userId);
        } catch (error) {
            console.error('Failed to mark all read:', error);
            // Re-fetch on error to sync with server
            const { unread_count } = await getUnreadNotificationCount(userId);
            set({ unreadCount: unread_count });
        }
    },
    incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
}));
