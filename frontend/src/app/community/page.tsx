'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Search } from 'lucide-react';
import { useState, useRef } from 'react';

// ─── Static Data ──────────────────────────────────────────────────────────────

const TRENDING_DISCUSSIONS = [
    {
        id: 1,
        title: "Is Oppenheimer the greatest biopic ever made?",
        category: "Debate",
        categoryColor: "#e11d48",
        movie: "Oppenheimer",
        year: "2023",
        replies: 847,
        likes: 2341,
        hot: true,
        excerpt: "Christopher Nolan's latest masterpiece has divided critics and cinephiles alike. The non-linear narrative is either genius or frustrating depending on who you ask...",
        poster: "https://image.tmdb.org/t/p/w185/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        author: { name: "CinemaVérité", avatar: "C", tier: "Director" },
        timeAgo: "2h ago",
    },
    {
        id: 2,
        title: "Perfect Scores Masterclass: How Ennio Morricone changed cinema forever",
        category: "Analysis",
        categoryColor: "#7c3aed",
        movie: "The Good, the Bad and the Ugly",
        year: "1966",
        replies: 312,
        likes: 1892,
        hot: false,
        excerpt: "A deep dive into the compositional genius of Morricone and how his leitmotifs created an entirely new cinematic language...",
        poster: "https://image.tmdb.org/t/p/w185/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg",
        author: { name: "FilmScoreFanatic", avatar: "F", tier: "Sommelier" },
        timeAgo: "5h ago",
    },
    {
        id: 3,
        title: "Top-tier Villains: Why Hans Landa remains unbeatable",
        category: "Poll",
        categoryColor: "#0891b2",
        movie: "Inglourious Basterds",
        year: "2009",
        replies: 1204,
        likes: 4102,
        hot: true,
        excerpt: "Christoph Waltz's portrayal of Colonel Landa redefined what a movie villain could be. Charming, multilingual, terrifyingly intelligent...",
        poster: "https://image.tmdb.org/t/p/w185/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg",
        author: { name: "QuentinFan", avatar: "Q", tier: "Cinephile" },
        timeAgo: "1d ago",
    },
    {
        id: 4,
        title: "The hidden symbolism in Parasite you probably missed",
        category: "Analysis",
        categoryColor: "#7c3aed",
        movie: "Parasite",
        year: "2019",
        replies: 678,
        likes: 3211,
        hot: false,
        excerpt: "Bong Joon-ho wove layers of social commentary into every frame. From the geography of the homes to the choice of food...",
        poster: "https://image.tmdb.org/t/p/w185/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        author: { name: "KoreanCinema_", avatar: "K", tier: "Director" },
        timeAgo: "3d ago",
    },
];

const TOP_REVIEWERS = [
    { name: "CinemaVérité", reviews: 847, followers: 12400, tier: "Director", specialty: "Art House", avatar: "C", rating: 4.9, accent: "#f4c025" },
    { name: "NightOwl_Reels", reviews: 612, followers: 8900, tier: "Sommelier", specialty: "Thriller", avatar: "N", rating: 4.8, accent: "#7c3aed" },
    { name: "FilmScoreFanatic", reviews: 534, followers: 7100, tier: "Sommelier", specialty: "Soundtracks", avatar: "F", rating: 4.7, accent: "#0891b2" },
    { name: "ClassicsCurator", reviews: 421, followers: 5600, tier: "Cinephile", specialty: "Golden Age", avatar: "CC", rating: 4.6, accent: "#059669" },
    { name: "VinylVerdict", reviews: 389, followers: 4200, tier: "Cinephile", specialty: "Indie Films", avatar: "V", rating: 4.5, accent: "#e11d48" },
];

const RECENT_ACTIVITY = [
    { user: "NightOwl_Reels", action: "reviewed", title: "Poor Things", rating: 5, timeAgo: "3m ago", avatar: "N" },
    { user: "ClassicsCurator", action: "added to watchlist", title: "The Godfather", rating: null, timeAgo: "8m ago", avatar: "CC" },
    { user: "QuentinFan", action: "started a discussion on", title: "Kill Bill Vol. 1", rating: null, timeAgo: "15m ago", avatar: "Q" },
    { user: "VinylVerdict", action: "reviewed", title: "Dune: Part Two", rating: 4, timeAgo: "22m ago", avatar: "V" },
    { user: "CinemaVérité", action: "reviewed", title: "Past Lives", rating: 5, timeAgo: "34m ago", avatar: "C" },
    { user: "FilmScoreFanatic", action: "added to watchlist", title: "Interstellar", rating: null, timeAgo: "1h ago", avatar: "F" },
];

const WATCH_PARTIES = [
    { title: "2001: A Space Odyssey", host: "CinemaVérité", date: "Sat, Mar 15", time: "8:00 PM IST", attendees: 47, maxAttendees: 100, genre: "Sci-Fi Classic", accent: "#7c3aed" },
    { title: "Spirited Away", host: "AnimeArchivist", date: "Sun, Mar 16", time: "6:00 PM IST", attendees: 89, maxAttendees: 150, genre: "Animation", accent: "#0891b2" },
    { title: "No Country for Old Men", host: "CoenBrothersClub", date: "Fri, Mar 21", time: "9:00 PM IST", attendees: 23, maxAttendees: 75, genre: "Neo-Noir", accent: "#e11d48" },
];

const STATS = [
    { label: "Active Cinephiles", value: "84K+", icon: "groups" },
    { label: "Discussions", value: "210K+", icon: "forum" },
    { label: "Reviews Written", value: "1.2M+", icon: "rate_review" },
    { label: "Watch Parties", value: "3.4K+", icon: "movie" },
];

const TIER_COLORS: Record<string, string> = {
    "Director": "#f4c025",
    "Sommelier": "#7c3aed",
    "Cinephile": "#0891b2",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
    return (
        <span className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <span
                    key={i}
                    className="material-symbols-outlined fill-1"
                    style={{ fontSize: 14, color: i <= rating ? "#f4c025" : "rgba(255,255,255,0.15)" }}
                >star</span>
            ))}
        </span>
    );
}

function TierBadge({ tier }: { tier: string }) {
    return (
        <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
                color: TIER_COLORS[tier] || "#94a3b8",
                background: `${TIER_COLORS[tier] || "#94a3b8"}22`,
                border: `1px solid ${TIER_COLORS[tier] || "#94a3b8"}44`,
            }}
        >
            {tier}
        </span>
    );
}

function Avatar({ initials, size = 40, color }: { initials: string; size?: number; color?: string }) {
    const hue = initials.charCodeAt(0) * 15 % 360;
    return (
        <div
            className="flex items-center justify-center rounded-full font-bold shrink-0"
            style={{
                width: size,
                height: size,
                fontSize: size * 0.38,
                background: color
                    ? `linear-gradient(135deg, ${color}cc, ${color}66)`
                    : `linear-gradient(135deg, hsl(${hue},70%,45%), hsl(${(hue + 60) % 360},70%,30%))`,
                boxShadow: `0 0 0 2px rgba(255,255,255,0.08)`,
            }}
        >
            {initials}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState<'trending' | 'latest' | 'top'>('trending');
    const [searchQuery, setSearchQuery] = useState('');
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    const filteredDiscussions = TRENDING_DISCUSSIONS.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.movie.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#0a0904] text-slate-100 font-display relative overflow-x-hidden">

            {/* ── Ambient BG glows ── */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-200px] right-[-200px] w-[700px] h-[700px] rounded-full"
                    style={{ background: "radial-gradient(circle,rgba(244,192,37,0.18) 0%,transparent 70%)" }}
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.18, 0.1] }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                    className="absolute bottom-[-100px] left-[-100px] w-[600px] h-[600px] rounded-full"
                    style={{ background: "radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)" }}
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 6 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
                    style={{ background: "radial-gradient(circle,rgba(8,145,178,0.1) 0%,transparent 70%)" }}
                />
            </div>

            {/* ── Navbar ── */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="fixed top-0 z-50 w-full backdrop-blur-xl border-b border-white/8 shadow-2xl"
                style={{ background: "rgba(10,9,4,0.88)" }}
            >
                <div className="w-full px-6 lg:px-12 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-8 lg:gap-14">
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="material-symbols-outlined text-[#f4c025] text-3xl group-hover:scale-110 transition-transform">movie_filter</span>
                            <h2 className="text-slate-100 text-xl font-bold tracking-tight font-serif italic">MovieWine</h2>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-7">
                            {[
                                { label: "Home", href: "/" },
                                { label: "Movies", href: "/movies" },
                                { label: "TV Shows", href: "/tv-shows" },
                                { label: "Community", href: "/community", active: true },
                                { label: "My List", href: "/dashboard/watchlist" },
                            ].map(item => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`text-sm font-medium transition-colors relative group ${item.active ? "text-[#f4c025]" : "text-slate-400 hover:text-white"}`}
                                >
                                    {item.label}
                                    {item.active && (
                                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#f4c025] rounded-full" />
                                    )}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="hidden lg:flex items-center bg-white/8 border border-white/10 rounded-full px-4 py-2 focus-within:ring-1 focus-within:ring-[#f4c025]/50 focus-within:bg-white/12 transition-all w-60 focus-within:w-72">
                            <Search className="text-white/40 w-4 h-4 shrink-0 mr-2.5" />
                            <input className="bg-transparent text-sm focus:outline-none placeholder:text-slate-500 text-white w-full" placeholder="Titles, actors, genres..." type="text" />
                        </div>
                        <button className="flex items-center justify-center p-2 text-slate-400 hover:text-white transition-colors relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-[#0a0904]" />
                        </button>
                        <SignedOut>
                            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#f4c025] text-[#0a0904] px-5 py-2 rounded-lg font-bold text-sm">SIGN IN</motion.button>
                            </SignInButton>
                            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white/8 border border-white/10 text-slate-200 px-5 py-2 rounded-lg font-bold text-sm hidden sm:block">SIGN UP</motion.button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <div className="h-9 w-9 flex items-center justify-center rounded-full border border-[#f4c025]/30 p-0.5 hover:border-[#f4c025] transition-colors cursor-pointer">
                                <UserButton appearance={{ elements: { avatarBox: "h-full w-full rounded-full object-cover" } }} />
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </motion.header>

            {/* ── HERO ── */}
            <section ref={heroRef} className="relative min-h-[480px] flex items-end overflow-hidden pt-20">
                {/* Cinematic background film strip */}
                <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0904]/30 via-transparent to-[#0a0904] z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0904] via-[#0a0904]/50 to-transparent z-10" />
                    {/* Film strip aesthetic */}
                    <div className="absolute inset-0 flex gap-1 opacity-20">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex-1 h-full relative">
                                <div className="absolute inset-0 border-x border-white/5" />
                                {Array.from({ length: 12 }).map((_, j) => (
                                    <div key={j} className="absolute left-0 right-0 h-0.5 bg-white/5" style={{ top: `${(j + 0.5) * (100 / 12)}%` }} />
                                ))}
                            </div>
                        ))}
                    </div>
                    {/* Gradient poster-like backgrounds */}
                    <div className="absolute inset-0 grid grid-cols-4 gap-0 opacity-30">
                        {["#1a0a2e", "#0d1b2a", "#1a0000", "#0a1a2e"].map((c, i) => (
                            <div key={i} className="h-full" style={{ background: c }} />
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    className="relative z-10 w-full px-6 lg:px-16 pb-16 pt-24"
                    style={{ opacity: heroOpacity }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.2 }}
                    >
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                            style={{ background: "rgba(244,192,37,0.12)", border: "1px solid rgba(244,192,37,0.25)", color: "#f4c025" }}
                        >
                            <span className="material-symbols-outlined fill-1" style={{ fontSize: 14 }}>local_fire_department</span>
                            Live Community Hub
                        </motion.span>
                        <h1 className="text-5xl lg:text-7xl font-serif italic text-white mb-4 leading-none">
                            Where Cinephiles
                            <br />
                            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#f4c025,#fde68a,#f4c025)" }}>
                                Come Alive
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl leading-relaxed mb-8">
                            Join 84,000+ passionate film lovers debating, reviewing, and discovering cinema together.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(244,192,37,0.35)" }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[#0a0904] text-sm"
                                style={{ background: "linear-gradient(135deg,#f4c025,#fbbf24)" }}
                            >
                                <span className="material-symbols-outlined fill-1" style={{ fontSize: 18 }}>add</span>
                                Start a Discussion
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.1)" }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white text-sm border border-white/15 bg-white/6 transition-all"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>explore</span>
                                Explore Topics
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ── STATS BAR ── */}
            <section className="relative z-10 border-y border-white/6" style={{ background: "rgba(10,9,4,0.95)" }}>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-white/8">
                        {STATS.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="flex items-center gap-3 lg:px-8 first:pl-0"
                            >
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(244,192,37,0.12)", border: "1px solid rgba(244,192,37,0.2)" }}>
                                    <span className="material-symbols-outlined text-[#f4c025]" style={{ fontSize: 20 }}>{stat.icon}</span>
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-white leading-none">{stat.value}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MAIN CONTENT ── */}
            <main className="relative z-10 max-w-7xl mx-auto w-full px-4 lg:px-12 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

                    {/* ── LEFT: Discussions ── */}
                    <div>
                        {/* Search + Tabs */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="flex-1 relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#f4c025] transition-colors" style={{ fontSize: 20 }}>search</span>
                                <input
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-5 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-[#f4c025]/40"
                                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                                    placeholder="Search discussions, movies, topics..."
                                />
                            </div>
                            <div className="flex gap-2 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                {(['trending', 'latest', 'top'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === tab ? "text-[#0a0904] shadow-lg" : "text-slate-400 hover:text-white"}`}
                                        style={activeTab === tab ? { background: "linear-gradient(135deg,#f4c025,#fbbf24)" } : {}}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Discussion Cards */}
                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {filteredDiscussions.map((d, i) => (
                                    <motion.article
                                        key={d.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.07 }}
                                        className="group relative rounded-2xl cursor-pointer overflow-hidden transition-all duration-500"
                                        style={{
                                            background: "rgba(255,255,255,0.03)",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                        }}
                                        whileHover={{
                                            backgroundColor: "rgba(255,255,255,0.06)",
                                            borderColor: "rgba(244,192,37,0.2)",
                                            y: -2,
                                        }}
                                    >
                                        {/* Gold shimmer on hover */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                            style={{ background: "linear-gradient(135deg,rgba(244,192,37,0.04) 0%,transparent 60%)" }} />

                                        <div className="p-5 flex gap-5">
                                            {/* Poster-like accent */}
                                            <div className="hidden sm:flex flex-col items-center gap-3 shrink-0">
                                                <div className="w-14 h-20 rounded-lg overflow-hidden relative" style={{ background: "rgba(255,255,255,0.05)" }}>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-slate-600" style={{ fontSize: 28 }}>movie</span>
                                                    </div>
                                                    {/* Colored tag on poster */}
                                                    <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: d.categoryColor }} />
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                                                    <span
                                                        className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                                                        style={{ color: d.categoryColor, background: `${d.categoryColor}22`, border: `1px solid ${d.categoryColor}44` }}
                                                    >
                                                        {d.category}
                                                    </span>
                                                    {d.hot && (
                                                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: "#fb923c", background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.3)" }}>
                                                            <span className="material-symbols-outlined fill-1" style={{ fontSize: 12 }}>local_fire_department</span>
                                                            Hot
                                                        </span>
                                                    )}
                                                    <span className="text-slate-600 text-xs ml-auto">{d.timeAgo}</span>
                                                </div>

                                                <h3 className="text-white font-bold text-base mb-1.5 leading-snug group-hover:text-[#f4c025] transition-colors line-clamp-2">
                                                    {d.title}
                                                </h3>
                                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-3">
                                                    {d.excerpt}
                                                </p>

                                                <div className="flex items-center justify-between flex-wrap gap-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <Avatar initials={d.author.avatar} size={28} />
                                                        <span className="text-slate-400 text-xs font-medium">{d.author.name}</span>
                                                        <TierBadge tier={d.author.tier} />
                                                    </div>

                                                    <div className="flex items-center gap-4 text-slate-500 text-xs">
                                                        <span className="flex items-center gap-1.5 hover:text-[#f4c025] cursor-pointer transition-colors">
                                                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>thumb_up</span>
                                                            {d.likes.toLocaleString()}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 hover:text-slate-300 cursor-pointer transition-colors">
                                                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chat_bubble</span>
                                                            {d.replies.toLocaleString()}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 hover:text-slate-300 cursor-pointer transition-colors">
                                                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>bookmark</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </AnimatePresence>

                            {filteredDiscussions.length === 0 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-slate-500">
                                    <span className="material-symbols-outlined block mb-3" style={{ fontSize: 48 }}>search_off</span>
                                    No discussions match your search.
                                </motion.div>
                            )}
                        </div>

                        {/* Load More */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full mt-6 py-3.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            Load More Discussions
                        </motion.button>

                        {/* ── Watch Parties ── */}
                        <section className="mt-14">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
                                        <span className="material-symbols-outlined text-[#7c3aed]" style={{ fontSize: 18 }}>live_tv</span>
                                    </div>
                                    <h2 className="text-white font-bold text-xl">Upcoming Watch Parties</h2>
                                </div>
                                <button className="text-[#f4c025] text-sm font-semibold hover:text-yellow-300 transition-colors flex items-center gap-1">
                                    View All
                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {WATCH_PARTIES.map((party, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ y: -4, scale: 1.02 }}
                                        className="relative rounded-2xl p-5 overflow-hidden cursor-pointer group"
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: `linear-gradient(90deg,${party.accent},${party.accent}88)` }} />
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at top left,${party.accent}18 0%,transparent 60%)` }} />

                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 inline-block" style={{ color: party.accent, background: `${party.accent}22`, border: `1px solid ${party.accent}44` }}>
                                            {party.genre}
                                        </span>
                                        <h3 className="text-white font-bold text-sm leading-snug mb-1">{party.title}</h3>
                                        <p className="text-slate-500 text-xs mb-4">Hosted by <span className="text-slate-300">{party.host}</span></p>

                                        <div className="flex items-center justify-between text-xs mb-4">
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_today</span>
                                                {party.date}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>
                                                {party.time}
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                                                <span>{party.attendees} attending</span>
                                                <span>{party.maxAttendees - party.attendees} spots left</span>
                                            </div>
                                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${(party.attendees / party.maxAttendees) * 100}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                                                    className="h-full rounded-full"
                                                    style={{ background: `linear-gradient(90deg,${party.accent},${party.accent}88)` }}
                                                />
                                            </div>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="w-full py-2 rounded-lg text-xs font-bold transition-all"
                                            style={{ background: `${party.accent}22`, color: party.accent, border: `1px solid ${party.accent}44` }}
                                        >
                                            Reserve Seat
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* ── RIGHT SIDEBAR ── */}
                    <div className="space-y-8">

                        {/* Live Activity Feed */}
                        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <h2 className="text-white font-bold text-sm">Live Activity</h2>
                                </div>
                                <span className="text-slate-600 text-xs">Real-time</span>
                            </div>

                            <div className="divide-y divide-white/4">
                                {RECENT_ACTIVITY.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/3 transition-colors group"
                                    >
                                        <Avatar initials={item.avatar} size={32} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-slate-300 leading-relaxed">
                                                <span className="text-white font-semibold">{item.user}</span>
                                                {" "}<span className="text-slate-500">{item.action}</span>{" "}
                                                <span className="text-[#f4c025] font-medium">{item.title}</span>
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {item.rating && <StarRating rating={item.rating} />}
                                                <span className="text-slate-600 text-[10px]">{item.timeAgo}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="px-5 py-3 border-t border-white/6">
                                <button className="text-[#f4c025] text-xs font-semibold hover:text-yellow-200 transition-colors flex items-center gap-1">
                                    View full activity feed
                                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                                </button>
                            </div>
                        </div>

                        {/* Top Reviewers */}
                        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
                                <div className="flex items-center gap-2.5">
                                    <span className="material-symbols-outlined fill-1 text-[#f4c025]" style={{ fontSize: 18 }}>workspace_premium</span>
                                    <h2 className="text-white font-bold text-sm">Top Cinephiles</h2>
                                </div>
                                <span className="text-slate-600 text-xs">This Month</span>
                            </div>

                            <div className="divide-y divide-white/4">
                                {TOP_REVIEWERS.map((reviewer, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.07 }}
                                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/4 transition-colors cursor-pointer group"
                                    >
                                        <span className="text-sm font-bold w-5 text-center shrink-0" style={{ color: i < 3 ? "#f4c025" : "#475569" }}>
                                            {i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${i + 1}`}
                                        </span>
                                        <Avatar initials={reviewer.avatar} size={36} color={reviewer.accent} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <span className="text-white text-sm font-semibold group-hover:text-[#f4c025] transition-colors truncate">{reviewer.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <TierBadge tier={reviewer.tier} />
                                                <span className="text-slate-600 text-[10px]">{reviewer.specialty}</span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-white text-sm font-bold">{reviewer.reviews}</div>
                                            <div className="text-slate-600 text-[10px]">reviews</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="px-5 py-3 border-t border-white/6">
                                <button className="text-[#f4c025] text-xs font-semibold hover:text-yellow-200 transition-colors flex items-center gap-1">
                                    View leaderboard
                                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                                </button>
                            </div>
                        </div>

                        {/* Start Discussion CTA */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="rounded-2xl p-6 relative overflow-hidden"
                            style={{ background: "linear-gradient(135deg,rgba(244,192,37,0.12) 0%,rgba(124,58,237,0.12) 100%)", border: "1px solid rgba(244,192,37,0.2)" }}
                        >
                            <div className="absolute top-0 right-0 opacity-20">
                                <span className="material-symbols-outlined fill-1 text-[#f4c025]" style={{ fontSize: 100 }}>forum</span>
                            </div>
                            <h3 className="text-white font-bold text-base mb-2 relative">Got something to say?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4 relative">Share your thoughts on any film. Every great discussion starts with one voice.</p>
                            <motion.button
                                whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(244,192,37,0.3)" }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full py-3 rounded-xl font-bold text-sm text-[#0a0904]"
                                style={{ background: "linear-gradient(135deg,#f4c025,#fbbf24)" }}
                            >
                                + Start a Discussion
                            </motion.button>
                        </motion.div>

                        {/* Popular Tags */}
                        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <h2 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#f4c025]" style={{ fontSize: 18 }}>tag</span>
                                Trending Topics
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {["#Oscars2024", "#NarrativePace", "#PracticalEffects", "#FilmNoir", "#WorldCinema", "#Cinematography", "#IndieFilms", "#SoundDesign", "#StanleyKubrick", "#NewWaveMovements"].map(tag => (
                                    <motion.button
                                        key={tag}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="text-xs px-3 py-1.5 rounded-full text-slate-400 hover:text-[#f4c025] transition-all"
                                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                                    >
                                        {tag}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* ── FOOTER ── */}
            <footer className="relative z-10 border-t border-white/6 mt-16 py-12 px-6 lg:px-12" style={{ background: "rgba(10,9,4,0.98)" }}>
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
                    <div className="col-span-2 space-y-5">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#f4c025] text-3xl">movie_filter</span>
                            <h2 className="text-white text-xl font-bold font-serif italic">MovieWine</h2>
                        </div>
                        <p className="text-slate-600 max-w-xs leading-relaxed text-sm">The premier destination for the discerning viewer. Experience cinema like never before.</p>
                        <div className="flex gap-3">
                            {["twitter", "instagram", "youtube"].map(s => (
                                <div key={s} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                    <span className="material-symbols-outlined text-slate-500" style={{ fontSize: 16 }}>link</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-5 text-sm">Explore</h4>
                        <ul className="space-y-3 text-slate-500 text-sm">
                            {[["Movies", "/movies"], ["TV Shows", "/tv-shows"], ["Community", "/community"]].map(([l, h]) => (
                                <li key={l}><Link href={h} className="hover:text-[#f4c025] transition-colors">{l}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-5 text-sm">Community</h4>
                        <ul className="space-y-3 text-slate-500 text-sm">
                            {["Discussions", "Reviews", "Watch Parties", "Leaderboard"].map(l => (
                                <li key={l}><button className="hover:text-[#f4c025] transition-colors">{l}</button></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-slate-600 text-xs">© 2025 MovieWine. All rights reserved.</p>
                    <div className="flex gap-6 text-slate-600 text-xs">
                        {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(t => (
                            <button key={t} className="hover:text-slate-400 transition-colors">{t}</button>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
