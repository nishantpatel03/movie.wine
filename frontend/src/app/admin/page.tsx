'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchFromBackend } from '@/lib/api';

export default function AdminOverviewPage() {
    const [stats, setStats] = useState([
        { label: "Total Streaming Links", value: "0", icon: "link", color: "text-blue-400" },
        { label: "Active Movies", value: "0", icon: "movie", color: "text-primary" },
        { label: "Active Series", value: "0", icon: "tv", color: "text-accent-purple" },
        { label: "Total Users", value: "0", icon: "person", color: "text-green-400" },
    ]);
    const [activeContent, setActiveContent] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const [statsData, contentData] = await Promise.all([
                    fetchFromBackend<any>('/links/stats/summary'),
                    fetchFromBackend<any[]>('/links/content/active')
                ]);
                
                setStats([
                    { label: "Total Streaming Links", value: statsData.total_links.toString(), icon: "link", color: "text-blue-400" },
                    { label: "Active Movies", value: statsData.movie_links.toString(), icon: "movie", color: "text-primary" },
                    { label: "Active Series", value: statsData.tv_links.toString(), icon: "tv", color: "text-accent-purple" },
                    { label: "Total Users", value: statsData.total_users.toString(), icon: "person", color: "text-green-400" },
                ]);
                setActiveContent(contentData);
            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="space-y-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl font-serif italic text-white mb-2">Admin Control Center</h1>
                <p className="text-slate-400">Manage streaming links and site-wide metadata.</p>
            </motion.div>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glassmorphism p-6 rounded-2xl border border-white/5"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className={`material-symbols-outlined text-3xl ${stat.color} p-2 rounded-xl bg-white/5`}>{stat.icon}</span>
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-slate-400 font-medium">{stat.label}</p>
                    </motion.div>
                ))}
            </section>

            {/* Active Content Gallery */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-serif italic text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                        Active Content
                    </h2>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{activeContent.length} Titles with links</p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse rounded-2xl" />)}
                    </div>
                ) : activeContent.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {activeContent.map((item) => (
                            <Link 
                                key={`${item.media_type}-${item.tmdb_id}`}
                                href={item.media_type === 'movie' ? `/admin/movies?id=${item.tmdb_id}` : `/admin/series?id=${item.tmdb_id}`}
                                className="group"
                            >
                                <motion.div 
                                    whileHover={{ y: -8 }}
                                    className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 bg-white/5 shadow-xl"
                                >
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w342${item.poster_path}`} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-0 left-0 w-full p-4">
                                        <p className="text-[10px] font-black uppercase text-primary mb-1">{item.media_type}</p>
                                        <h4 className="text-white font-bold text-xs line-clamp-2 leading-tight">{item.title}</h4>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-20 text-center border border-dashed border-white/10 rounded-[40px]">
                        <p className="text-slate-500 font-serif italic text-lg">No content has been linked yet. Start by adding links to movies or series.</p>
                    </div>
                )}
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link href="/admin/movies" className="group">
                    <div className="glassmorphism p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all h-full bg-gradient-to-br from-white/5 to-transparent">
                        <span className="material-symbols-outlined text-4xl text-primary mb-6">movie</span>
                        <h2 className="text-2xl font-serif italic text-white mb-4 group-hover:text-primary transition-colors">Manage Movies</h2>
                        <p className="text-slate-400 leading-relaxed">Search for movies and attach streaming URLs. Supports multiple providers and qualities.</p>
                        <div className="mt-8 flex items-center gap-2 text-primary font-bold text-sm">
                            GET STARTED <span className="material-symbols-outlined">arrow_forward</span>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/series" className="group">
                    <div className="glassmorphism p-8 rounded-3xl border border-white/5 hover:border-accent-purple/30 transition-all h-full bg-gradient-to-br from-white/5 to-transparent">
                        <span className="material-symbols-outlined text-4xl text-accent-purple mb-6">tv</span>
                        <h2 className="text-2xl font-serif italic text-white mb-4 group-hover:text-accent-purple transition-colors">Manage Series</h2>
                        <p className="text-slate-400 leading-relaxed">Assign streaming links to series, seasons, and individual episodes with deep-linking support.</p>
                        <div className="mt-8 flex items-center gap-2 text-accent-purple font-bold text-sm">
                            GET STARTED <span className="material-symbols-outlined">arrow_forward</span>
                        </div>
                    </div>
                </Link>
            </section>
        </div>
    );
}
