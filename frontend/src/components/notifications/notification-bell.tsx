'use client';

import { useNotificationStore } from '@/stores/notifications-store';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationBell({ onClick }: { onClick: () => void }) {
    const { unreadCount } = useNotificationStore();

    return (
        <button 
            onClick={onClick}
            className="relative text-white/40 hover:text-white transition-colors group p-2 rounded-full hover:bg-white/5 active:scale-95"
        >
            <Bell className="w-6 h-6" />
            <AnimatePresence>
                {unreadCount > 0 && (
                    <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute top-1.5 right-1.5 flex h-3 w-3"
                    >
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary border-2 border-background-dark"></span>
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    );
}
