'use client';

import { HomeNavBar } from '@/components/home/HomeNavBar';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MyListPage() {
    return (
        <main className="min-h-screen bg-background-dark">
            <HomeNavBar />
            
            <section className="px-6 lg:px-12 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto"
                >
                    <div className="flex items-center gap-4 mb-12">
                        <span className="material-symbols-outlined text-primary text-4xl">bookmarks</span>
                        <h1 className="text-white text-4xl font-black uppercase tracking-tighter">
                            My <span className="text-primary italic">List</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                            <div className="relative mb-6">
                                <span className="material-symbols-outlined text-white/10 text-8xl">movie_off</span>
                                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full"></div>
                            </div>
                            <p className="text-white/40 text-lg font-medium tracking-tight mb-8">Your list is feeling a bit lonely. Start adding your favorites!</p>
                            <Link href="/movies">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-primary text-background-dark rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-[0_0_30px_rgba(244,192,37,0.3)] transition-all"
                                >
                                    Explore Movies
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
