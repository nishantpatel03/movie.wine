'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, ExternalLink, Inbox, Clock } from 'lucide-react';
import { 
    getUserNotifications, 
    markNotificationAsRead, 
    Notification 
} from '@/lib/api';
import { useNotificationStore } from '@/stores/notifications-store';
import Link from 'next/link';

export function NotificationDropdown() {
    const { user, isLoaded } = useUser();
    const { markAllRead } = useNotificationStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchLast10 = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await getUserNotifications(user.id, 1);
            setNotifications(data.notifications.slice(0, 10)); // Last 10 as per spec
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchLast10();
        }
    }, [isOpen]);

    const handleMarkAsRead = async (id: number) => {
        try {
            await markNotificationAsRead(id);
            // Remove the notification from the local list once it's read
            setNotifications(prev => prev.filter(n => n.id !== id));
            // The store's unreadCount will be updated by the next fetch or manually
            // if we wanted, but the dropdown list itself now removes it.
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    if (!isLoaded || !user) return null;

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-white/40 hover:text-white transition-colors group p-2 rounded-full hover:bg-white/5 active:scale-95"
            >
                <Bell className="w-6 h-6" />
                {/* Bell pulse logic is in separate bell component, but for this integrated version: */}
                <NotificationIcon user={user} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-[280px] bg-[#12110b]/80 border border-white/10 rounded-[20px] shadow-2xl z-50 overflow-hidden backdrop-blur-xl flex flex-col glassmorphism"
                        >
                            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/5">
                                <h3 className="font-black text-[10px] uppercase tracking-widest text-white/60">Activity</h3>
                                <button 
                                    onClick={async () => {
                                        await markAllRead(user.id);
                                        setNotifications([]); // Clear the list as they are all read/removed
                                    }}
                                    className="text-[9px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest"
                                >
                                    Mark all read
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar max-h-[400px]">
                                {isLoading ? (
                                    <div className="p-10 flex flex-col items-center justify-center opacity-20">
                                        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Loading...</p>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="p-8 flex flex-col items-center justify-center text-center opacity-20">
                                        <Bell className="w-10 h-10 mb-4" />
                                        <p className="text-xs font-bold">No notifications</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div 
                                            key={notif.id}
                                            className={`p-4 transition-all hover:bg-white/5 border-b border-white/5 last:border-0 ${!notif.is_read ? 'bg-primary/5' : ''}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${!notif.is_read ? 'bg-primary' : 'bg-white/10'}`} />
                                                <div className="flex-1 pr-4">
                                                    <p className={`text-[12px] font-bold mb-0.5 ${!notif.is_read ? 'text-white' : 'text-white/60'}`}>{notif.title}</p>
                                                    <p className="text-[11px] text-white/40 leading-tight mb-2 line-clamp-2">{notif.message}</p>
                                                    
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20 whitespace-nowrap">
                                                            {formatDate(notif.created_at)}
                                                        </span>
                                                        
                                                        {notif.link && (
                                                            <Link 
                                                                href={notif.link}
                                                                onClick={() => {
                                                                    handleMarkAsRead(notif.id);
                                                                    setIsOpen(false);
                                                                }}
                                                                className="text-[8px] font-black uppercase tracking-widest text-primary hover:underline"
                                                            >
                                                                View
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <Link 
                                href="/notifications" 
                                className="p-3 bg-white/5 text-center text-[10px] font-black text-white/40 hover:text-white transition-all uppercase tracking-[0.2em] border-t border-white/10"
                                onClick={() => setIsOpen(false)}
                            >
                                See everything
                            </Link>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function NotificationIcon({ user }: { user: any }) {
    const { unreadCount } = useNotificationStore();
    return (
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
    );
}
