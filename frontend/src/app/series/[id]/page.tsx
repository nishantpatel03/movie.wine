'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Plus, ThumbsUp, Sparkles, ChevronDown } from 'lucide-react';

// Mock data
const SERIES = {
    title: 'Shōgun',
    year: 2024,
    seasons: 1,
    overview: "In Japan in the year 1600, at the dawn of a century-defining civil war, Lord Yoshii Toranaga is fighting for his life as his enemies on the Council of Regents unite against him. When a mysterious European ship is found marooned in a nearby fishing village...",
    backdrop: 'https://image.tmdb.org/t/p/original/7O4iVfOMQmdCSqgCEq9mXN8Nndg.jpg',
    genres: ['Drama', 'War & Politics'],
    cast: ['Hiroyuki Sanada', 'Cosmo Jarvis', 'Anna Sawai'],
    episodes: [
        { number: 1, title: 'Anjin', runtime: '58m' },
        { number: 2, title: 'Servants of Two Masters', runtime: '61m' },
        { number: 3, title: 'Tomorrow is Tomorrow', runtime: '55m' },
        { number: 4, title: 'The Eightfold Fence', runtime: '59m' },
    ]
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
};

const fadeInRight = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7 } }
};

export default function SeriesPage() {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">

            {/* Navigation */}
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 px-10 py-4 glass-card sticky top-0 z-50"
            >
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 text-primary">
                        <span className="material-symbols-outlined text-3xl">movie_filter</span>
                        <h2 className="text-slate-100 text-xl font-bold leading-tight tracking-tight">MovieWine</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-slate-300 hover:text-primary transition-colors text-sm font-medium">Home</Link>
                        <Link href="#" className="text-slate-300 hover:text-primary transition-colors text-sm font-medium">Movies</Link>
                        <Link href="#" className="text-primary text-sm font-bold border-b-2 border-primary pb-1">Series</Link>
                        <Link href="#" className="text-slate-300 hover:text-primary transition-colors text-sm font-medium">My List</Link>
                    </nav>
                </div>
            </motion.header>

            <main className="relative flex-1">
                {/* Full-bleed Backdrop */}
                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0"
                >
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${SERIES.backdrop})` }}
                    ></div>
                    <div className="absolute inset-0 purple-overlay opacity-80"></div>
                </motion.div>

                {/* Content Container */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">

                    {/* Left Column: Video Player */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-8 w-full lg:w-1/2 items-center"
                    >
                        <motion.div variants={fadeInUp} className="w-full aspect-video rounded-xl overflow-hidden glass-card relative flex items-center justify-center cursor-pointer group shadow-2xl border-primary/20">
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity"
                                style={{ backgroundImage: `url(${SERIES.backdrop})` }}
                            ></div>
                            <motion.div whileHover={{ scale: 1.1 }} className="absolute z-10 bg-primary text-background-dark rounded-full p-4">
                                <Play fill="currentColor" size={32} />
                            </motion.div>
                            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold">
                                Now Playing: S1:E2 - Servants of Two Masters
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Details */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex-1 flex flex-col gap-8"
                    >
                        <div className="space-y-4">
                            <motion.div variants={fadeInRight} className="flex items-center gap-3 text-primary text-sm font-bold tracking-widest uppercase">
                                <span className="material-symbols-outlined text-sm">stars</span>
                                SERIES SPOTLIGHT
                            </motion.div>
                            <motion.h1 variants={fadeInRight} className="text-primary text-5xl md:text-6xl font-bold leading-none tracking-tighter">
                                {SERIES.title}
                            </motion.h1>
                            <motion.div variants={fadeInRight} className="flex items-center gap-4 text-slate-300 text-lg">
                                <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded text-xs font-bold tracking-widest uppercase">95% Match</span>
                                <span>{SERIES.year}</span>
                                <span className="size-1 bg-primary rounded-full"></span>
                                <span>{SERIES.seasons} Season</span>
                                <span className="size-1 bg-primary rounded-full"></span>
                                <span className="border border-slate-500 px-1 rounded text-sm">TV-MA</span>
                            </motion.div>
                        </div>

                        <motion.div variants={fadeInRight} className="flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(244,192,37,0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-8 py-4 bg-primary text-background-dark rounded-xl font-bold text-lg shadow-lg shadow-primary/20"
                            >
                                <Play fill="currentColor" size={20} /> Resume S1:E2
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(244,192,37,0.2)" }}
                                whileTap={{ scale: 0.95 }}
                                className="flex size-14 items-center justify-center bg-primary/10 text-primary border border-primary/30 rounded-xl transition-colors"
                            >
                                <Plus size={24} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(244,192,37,0.2)" }}
                                whileTap={{ scale: 0.95 }}
                                className="flex size-14 items-center justify-center bg-primary/10 text-primary border border-primary/30 rounded-xl transition-colors"
                            >
                                <ThumbsUp size={24} />
                            </motion.button>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="glass-card p-6 rounded-xl space-y-4">
                            <div className="flex items-center gap-2 text-primary">
                                <Sparkles size={16} />
                                <span className="text-sm font-bold uppercase tracking-wider">AI Insight</span>
                            </div>
                            <p className="text-slate-300 text-sm"><strong>Why recommended:</strong> Strong match based on your interest in immersive historical political dramas.</p>
                            <p className="text-slate-300 mt-4 leading-relaxed">{SERIES.overview}</p>
                        </motion.div>

                        {/* Episode List */}
                        <motion.div variants={fadeInUp} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold font-serif text-white">Episodes</h2>
                                <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
                                    Season 1 <ChevronDown size={16} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-3">
                                {SERIES.episodes.map(ep => (
                                    <motion.div
                                        key={ep.number}
                                        whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                                        className={`flex items-center gap-4 glass-card p-4 rounded-xl cursor-pointer ${ep.number === 2 ? 'border-primary/50' : 'border-transparent'}`}
                                    >
                                        <div className="text-2xl font-black text-slate-500 w-8">{ep.number}</div>
                                        <div className="size-16 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden relative">
                                            <Play size={20} className="text-primary z-10 opacity-70" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between w-full">
                                                <h4 className={`font-bold ${ep.number === 2 ? 'text-primary' : 'text-slate-200'}`}>{ep.title}</h4>
                                                <span className="text-slate-500 text-sm">{ep.runtime}</span>
                                            </div>
                                            {ep.number === 2 && (
                                                <div className="h-1 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: '40%' }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                        className="h-full bg-primary"
                                                    ></motion.div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
