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
    ]);

    useEffect(() => {
        async function fetchStats() {
            try {
                const data = await fetchFromBackend<any>('/links/stats/summary');
                setStats([
                    { label: "Total Streaming Links", value: data.total_links.toString(), icon: "link", color: "text-blue-400" },
                    { label: "Active Movies", value: data.movie_links.toString(), icon: "movie", color: "text-primary" },
                    { label: "Active Series", value: data.tv_links.toString(), icon: "tv", color: "text-accent-purple" },
                ]);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            }
        }
        fetchStats();
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

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
