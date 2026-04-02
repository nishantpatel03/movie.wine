'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
    getUserNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    Notification 
} from '@/lib/api';
import { HomeNavBar } from '@/components/home/HomeNavBar';
import { Bell, Check, Clock, ExternalLink, Inbox, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { format, isToday, isYesterday } from 'date-fns';

export default function NotificationsPage() {
    const { user, isLoaded } = useUser();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchNotifications = async (p: number) => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await getUserNotifications(user.id, p);
            if (p === 1) {
                setNotifications(data.notifications);
            } else {
                setNotifications(prev => [...prev, ...data.notifications]);
            }
            setHasMore(data.notifications.length === 20); // Backend limit is 20
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            fetchNotifications(1);
        }
    }, [isLoaded, user]);

    const handleMarkAllRead = async () => {
        if (!user) return;
        try {
            await markAllNotificationsAsRead(user.id);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleMarkRead = async (id: number) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const groupedNotifications = notifications.reduce((groups: any, notif) => {
        const date = new Date(notif.created_at);
        let group = 'Earlier';
        if (isToday(date)) group = 'Today';
        else if (isYesterday(date)) group = 'Yesterday';
        
        if (!groups[group]) groups[group] = [];
        groups[group].push(notif);
        return groups;
    }, {});

    if (!isLoaded) return null;

    return (
        <div className="min-h-screen bg-background-dark text-white font-display pb-24">
            <HomeNavBar />
            
            <main className="max-w-3xl mx-auto px-6 pt-32">
                <header className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                            <Bell className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight uppercase">Activity Center</h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Your notifications & updates</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleMarkAllRead}
                        className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
                    >
                        Mark all as read
                    </button>
                </header>

                <AnimatePresence mode="wait">
                    {notifications.length === 0 && !isLoading ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 border border-white/10 rounded-[32px] p-20 flex flex-col items-center text-center backdrop-blur-xl"
                        >
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8">
                                <Inbox className="w-10 h-10 text-white/10" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No activity yet</h3>
                            <p className="text-white/40 text-sm max-w-sm leading-relaxed uppercase tracking-widest text-[10px]">
                                When people interact with you or we have updates, they'll show up here.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-12">
                            {['Today', 'Yesterday', 'Earlier'].map((group) => (
                                groupedNotifications[group]?.length > 0 && (
                                    <section key={group} className="space-y-4">
                                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/50 flex items-center gap-4">
                                            {group}
                                            <div className="h-[1px] flex-1 bg-white/5" />
                                        </h2>
                                        
                                        <div className="space-y-1">
                                            {groupedNotifications[group].map((notif: Notification, idx: number) => (
                                                <motion.div 
                                                    key={notif.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className={`group relative p-6 transition-all hover:bg-white/5 rounded-[24px] border border-transparent hover:border-white/10 ${!notif.is_read ? 'bg-primary/[0.03]' : ''}`}
                                                >
                                                    <div className="flex items-start gap-5">
                                                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!notif.is_read ? 'bg-primary' : 'bg-white/10'}`} />
                                                        
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <p className={`font-bold transition-colors ${!notif.is_read ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                                                                    {notif.title}
                                                                </p>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                                                                    {format(new Date(notif.created_at), 'h:mm aa')}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">{notif.message}</p>
                                                            
                                                            <div className="flex items-center gap-6 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {notif.link && (
                                                                    <Link 
                                                                        href={notif.link}
                                                                        onClick={() => handleMarkRead(notif.id)}
                                                                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary"
                                                                    >
                                                                        <ExternalLink className="w-3 h-3" />
                                                                        Details
                                                                    </Link>
                                                                )}
                                                                {!notif.is_read && (
                                                                    <button 
                                                                        onClick={() => handleMarkRead(notif.id)}
                                                                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white"
                                                                    >
                                                                        <Check className="w-3.5 h-3.5" />
                                                                        Mark read
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        {notif.link && (
                                                            <Link href={notif.link} className="shrink-0 group-hover:translate-x-1 transition-transform">
                                                                <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-primary transition-colors" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </section>
                                )
                            ))}
                            
                            {hasMore && (
                                <div className="pt-8 flex justify-center">
                                    <button 
                                        onClick={() => {
                                            const next = page + 1;
                                            setPage(next);
                                            fetchNotifications(next);
                                        }}
                                        disabled={isLoading}
                                        className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all disabled:opacity-50"
                                    >
                                        {isLoading ? 'Loading...' : 'Load More Activity'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
