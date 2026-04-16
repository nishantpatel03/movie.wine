'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { Search, ArrowUpRight, Plus, Edit2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getDiscussions, getWatchParties, getColumnists, Discussion, WatchParty, User, createSlug } from '@/lib/api';
import { SubmitPieceModal } from '@/components/community/SubmitPieceModal';

// ─── Helper: Time Ago ──────────────────────────────────────────────────────────

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + "Y AGO";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + "M AGO";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + "D AGO";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + "H AGO";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + "M AGO";
    return Math.floor(seconds) + "S AGO";
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CommunityPage() {
    const { user, isSignedIn } = useUser();
    const [searchQuery, setSearchQuery] = useState('');
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [watchParties, setWatchParties] = useState<WatchParty[]>([]);
    const [columnists, setColumnists] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();
    const headerBorderOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

    const loadData = async () => {
        try {
            const [dData, wData, cData] = await Promise.all([
                getDiscussions(),
                getWatchParties(),
                getColumnists()
            ]);
            setDiscussions(dData);
            setWatchParties(wData);
            setColumnists(cData);
        } catch (error) {
            console.error("Failed to load community data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredDiscussions = discussions.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.movie_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div ref={containerRef} className="min-h-screen w-full bg-gradient-to-br from-[#0a0a0f] via-[#0f0f15] to-[#0a0a12] text-[#f1f5f9] font-display relative selection:bg-primary selection:text-black overflow-x-hidden">

            {/* ── Animated Background Mesh ── */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Primary gradient orb */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-primary/10 via-transparent to-transparent rounded-full blur-[100px] animate-pulse"></div>
                {/* Secondary accent orb */}
                <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-gradient-radial from-accent-purple/8 via-transparent to-transparent rounded-full blur-[80px]"></div>
                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-primary/5 via-transparent to-transparent rounded-full blur-[60px]"></div>
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30"></div>
            </div>

            {/* ── Film Grain Overlay ── */}
            <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.02] mix-blend-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" stitchTiles="stitch"/></filter>
                    <rect width="100%" height="100%" filter="url(#n)"/>
                </svg>
            </div>

            {/* ── Navbar ── */}
            <motion.header
                className="fixed top-0 z-40 w-full bg-gradient-to-b from-[#0a0a0f]/90 to-[#0a0a0f]/70 backdrop-blur-2xl border-b border-white/5 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            >
                <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-3 group">
                            <span className="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform">movie_filter</span>
                            <h2 className="text-[#f1f5f9] text-xl font-bold tracking-tight font-serif italic">MovieWine</h2>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-8">
                            {[
                                { label: "HOME", href: "/" },
                                { label: "MOVIES", href: "/movies" },
                                { label: "SERIES", href: "/series" },
                                { label: "COMMUNITY", href: "/community", active: true },
                            ].map(item => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`text-xs font-bold tracking-[0.2em] transition-colors relative group ${item.active ? "text-primary" : "text-slate-500 hover:text-[#f1f5f9]"}`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-6">
                        <SignedOut>
                            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                <button className="text-xs font-bold tracking-widest text-slate-300 hover:text-primary transition-colors">LOGIN</button>
                            </SignInButton>
                            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                                <button className="text-xs font-bold tracking-widest bg-white text-black px-6 py-2.5 rounded-full hover:bg-primary hover:shadow-[0_0_15px_rgba(244,192,37,0.4)] transition-all">SUBSCRIBE</button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <div className="h-10 w-10 flex items-center justify-center rounded-full border border-primary/30 p-0.5 hover:border-primary transition-colors cursor-pointer overflow-hidden shadow-[0_0_10px_rgba(244,192,37,0.1)] hover:shadow-[0_0_20px_rgba(244,192,37,0.3)]">
                                <UserButton appearance={{ elements: { avatarBox: "h-full w-full rounded-full object-cover" } }} />
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </motion.header>

            {/* ── MAIN LAYOUT ── */}
            <main className="w-full max-w-[1600px] mx-auto pt-40 pb-32 px-6 lg:px-12 relative z-10">

                {/* ── Typography Header ── */}
                <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12 relative z-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
                        >
                            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 mb-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-accent-purple animate-pulse shadow-[0_0_15px_rgba(244,192,37,0.8)]"></span>
                                <span className="text-xs font-bold tracking-[0.25em] text-white/90 uppercase">Community Hub</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-serif leading-[0.85] tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/60 drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                                The <br/>
                                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-purple to-primary">Discourse.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-400/90 font-light max-w-2xl leading-relaxed">
                                Curated essays, heated debates, and cinematic analysis from the MovieWine editorial board and community.
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="flex flex-col items-start md:items-end gap-6 shrink-0"
                    >
                        <div className="text-left md:text-right bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                            <div className="text-sm font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-purple mb-2">ISSUE № 42</div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest font-mono">April 2026</div>
                        </div>
                        <button
                            onClick={() => setIsSubmitModalOpen(true)}
                            className="flex items-center gap-3 bg-gradient-to-r from-white to-white/90 text-black rounded-full px-8 py-4 font-bold text-sm tracking-widest uppercase hover:from-primary hover:to-accent-purple hover:text-black shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_40px_rgba(244,192,37,0.4)] transition-all duration-500 group"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                            Submit Piece
                        </button>
                    </motion.div>
                </header>

                <SubmitPieceModal 
                    isOpen={isSubmitModalOpen}
                    onClose={() => setIsSubmitModalOpen(false)}
                    onSuccess={loadData}
                />

                {/* ── Search Bar ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mb-16 relative z-10 max-w-4xl"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent-purple/20 to-primary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 group-focus-within:opacity-100 transition-all duration-500"></div>
                        <div className="relative flex items-center bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 pl-6 group-focus-within:border-primary/50 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                            <Search className="w-6 h-6 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search the archives..."
                                className="bg-transparent border-none text-xl md:text-3xl font-serif text-white placeholder-slate-500/70 w-full px-6 py-4 focus:outline-none focus:ring-0"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="p-3 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all mr-2">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-20 lg:gap-x-16 relative z-10">
                    
                    {/* ── Left Column: Featured & Discussions (Span 8) ── */}
                    <div className="lg:col-span-8 space-y-16">
                        
                        <AnimatePresence>
                            {isLoading ? (
                                <div className="flex justify-center py-20">
                                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : filteredDiscussions.map((d, i) => (
                                d.is_featured ? (
                                    /* Featured Editorial Block */
                                    <Link key={d.id} href={`/community/discussions/${createSlug(d.id, d.title)}`} className="block group">
                                        <motion.article
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                                            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl p-6 md:p-8 hover:from-white/[0.12] hover:to-white/[0.04] hover:border-white/20 transition-all duration-500 shadow-[0_8px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                                        >
                                            {/* Glow effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                            <div className="relative z-10">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent-purple shadow-[0_0_12px_rgba(244,192,37,0.8)]"></span>
                                                        <span className="text-[11px] font-bold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-purple uppercase">{d.category}</span>
                                                    </div>
                                                    <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10 backdrop-blur-sm">{timeAgo(d.created_at)}</span>
                                                </div>

                                                <div className="relative overflow-hidden aspect-[21/9] mb-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.3)]">
                                                    <motion.img
                                                        src={d.poster_url || '/placeholder-poster.png'}
                                                        alt={d.title}
                                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                                </div>

                                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] mb-5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent-purple transition-all duration-500">{d.title}</h2>
                                                <p className="text-lg md:text-xl text-slate-400/90 font-light leading-relaxed mb-8">{d.excerpt}</p>

                                                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full border border-white/20 overflow-hidden flex items-center justify-center text-sm font-serif italic bg-gradient-to-br from-white/10 to-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                                                            {d.author.avatar_url ? (
                                                                <img src={d.author.avatar_url} alt={d.author.username} className="w-full h-full object-cover" />
                                                            ) : (
                                                                d.author.username.charAt(0)
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="block text-sm font-bold tracking-widest text-white uppercase mb-1">{d.author.username}</span>
                                                            <span className="block text-[10px] text-slate-500 uppercase tracking-widest">{d.author.title || 'Contributor'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-5 text-slate-400 font-mono text-sm bg-white/5 px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-sm">
                                                        <span className="flex items-center gap-2 group/action">
                                                            <span className="material-symbols-outlined text-[18px] group-hover/action:scale-110 transition-transform text-primary/80">favorite</span> {d.likes_count}
                                                        </span>
                                                        <div className="w-[1px] h-4 bg-white/20"></div>
                                                        <span className="flex items-center gap-2 group/action">
                                                            <span className="material-symbols-outlined text-[18px] group-hover/action:scale-110 transition-transform text-accent-purple/80">chat_bubble_outline</span> {d.replies_count}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.article>
                                    </Link>
                                ) : (
                                    /* Standard List Item */
                                    <Link key={d.id} href={`/community/discussions/${createSlug(d.id, d.title)}`} className="block group">
                                        <motion.article
                                            initial={{ opacity: 0, y: 25 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
                                            className="relative overflow-hidden rounded-[24px] border border-white/5 bg-gradient-to-br from-white/[0.06] to-transparent backdrop-blur-xl p-6 hover:from-white/[0.1] hover:to-white/[0.02] hover:border-white/15 transition-all duration-500 shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                                        >
                                            {/* Left accent line */}
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 group-hover:h-16 bg-gradient-to-b from-primary to-accent-purple rounded-r-full transition-all duration-500"></div>

                                            {/* Glow effect on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[24px]"></div>

                                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start pl-2">
                                                <div className="md:col-span-3 flex flex-col gap-3">
                                                    <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                        {d.category}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-500 bg-white/5 inline-block w-max px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">{timeAgo(d.created_at)}</span>
                                                </div>

                                                <div className="md:col-span-9">
                                                    <h3 className="text-2xl md:text-3xl font-serif mb-3 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80 text-slate-300 transition-all duration-500">
                                                        {d.title}
                                                    </h3>
                                                    <p className="text-slate-400/80 font-light leading-relaxed mb-6 line-clamp-2">
                                                        {d.excerpt}
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-white/20 to-white/5 border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                                                                {d.author.avatar_url && <img src={d.author.avatar_url} alt={d.author.username} className="w-full h-full object-cover" />}
                                                            </div>
                                                            <span className="text-[11px] font-bold tracking-widest text-slate-300 uppercase group-hover:text-white transition-colors">{d.author.username}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            {isSignedIn && user?.id === d.author_id && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        e.preventDefault();
                                                                        window.location.href = `/community/discussions/${createSlug(d.id, d.title)}/edit`;
                                                                    }}
                                                                    className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors text-xs font-medium px-2 py-1 rounded-lg hover:bg-white/5"
                                                                >
                                                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                                                </button>
                                                            )}
                                                            <div className="flex items-center gap-3 text-slate-400 font-mono text-xs bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                                                                <span className="flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-[16px] text-primary/70">favorite</span> {d.likes_count}
                                                                </span>
                                                                <div className="w-[1px] h-3 bg-white/20"></div>
                                                                <span className="flex items-center gap-1.5">
                                                                    <span className="material-symbols-outlined text-[16px] text-accent-purple/70">chat_bubble_outline</span> {d.replies_count}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.article>
                                    </Link>
                                )
                            ))}
                        </AnimatePresence>

                        {!isLoading && filteredDiscussions.length === 0 && (
                            <div className="text-center py-32 rounded-[32px] bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center mx-auto mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                                    <Search className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-3xl font-serif text-white mb-3">No entries found</h3>
                                <p className="text-slate-400 font-light max-w-md mx-auto">Try adjusting your search query to find more articles in our archives.</p>
                            </div>
                        )}

                        {!isLoading && filteredDiscussions.length > 0 && (
                            <div className="pt-12 flex justify-center">
                                <button className="flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 hover:from-primary/20 hover:to-accent-purple/20 border border-white/20 hover:border-primary/30 rounded-full px-10 py-5 text-xs font-bold tracking-widest uppercase text-white hover:text-primary transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(244,192,37,0.2)] group">
                                    Load Previous Entries <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        )}

                    </div>

                    {/* ── Right Column: Sidebars (Span 4) ── */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* ── Trending Tags ── */}
                        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-purple/5 opacity-50"></div>
                            <h3 className="relative z-10 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-white uppercase mb-6 border-b border-white/10 pb-4">
                                <span className="material-symbols-outlined text-primary text-xl">tag</span>
                                The Index
                            </h3>
                            <div className="relative z-10 flex flex-col gap-1">
                                {["Directors", "Cinematography", "Screenplay", "Original Scores", "Auteurs", "Cannes 2026"].map((tag, i) => (
                                    <Link key={tag} href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 group transition-all duration-300">
                                        <span className="text-base font-serif text-slate-300 group-hover:text-white transition-colors">{tag}</span>
                                        <span className="text-xs font-mono text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300">0{i+1}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* ── Top Columnists ── */}
                        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-transparent to-primary/5 opacity-50"></div>
                            <h3 className="relative z-10 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-white uppercase mb-6 border-b border-white/10 pb-4">
                                <span className="material-symbols-outlined text-accent-purple text-xl">star</span>
                                Featured Voices
                            </h3>
                            <div className="relative z-10 space-y-3">
                                {columnists.map((critic, i) => (
                                    <div key={i} className="flex gap-3 group cursor-pointer p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300">
                                        <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center font-serif text-lg italic text-slate-300 group-hover:border-accent-purple group-hover:shadow-[0_4px_20px_rgba(244,192,37,0.2)] transition-all shrink-0">
                                            {critic.avatar_url ? (
                                                <img src={critic.avatar_url} alt={critic.username} className="w-full h-full object-cover" />
                                            ) : (
                                                critic.username.charAt(0)
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center min-w-0">
                                            <div className="text-sm font-bold text-white uppercase tracking-wider mb-0.5 group-hover:text-accent-purple transition-colors truncate">{critic.username}</div>
                                            <div className="text-xs font-serif italic text-slate-400 mb-1 truncate">{critic.title}</div>
                                            <div className="text-[9px] tracking-[0.15em] text-slate-500 uppercase bg-white/5 w-max px-2 py-0.5 rounded-full border border-white/10">{critic.specialty}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* ── Virtual Screenings ── */}
                        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-primary/10 via-black to-accent-purple/10 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                            {/* Animated gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black to-accent-purple/20 opacity-60"></div>
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                            <div className="relative z-10 p-6">
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                                    <h3 className="text-xs font-bold tracking-[0.2em] text-white uppercase flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]"></span>
                                        Live Screenings
                                    </h3>
                                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-colors">
                                        <span className="material-symbols-outlined text-white text-sm">theaters</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {watchParties.map((party, i) => (
                                        <div key={i} className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all duration-300">
                                            <div className="flex justify-between items-start gap-4">
                                                <h4 className="text-base font-serif text-white leading-tight group-hover:text-primary transition-colors">{party.movie_title}</h4>
                                                <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-1 rounded uppercase min-w-max border border-primary/20">
                                                    {new Date(party.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 overflow-hidden">
                                                        {party.host.avatar_url && <img src={party.host.avatar_url} alt="host" className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">{party.host.username}</div>
                                                </div>
                                                <button className="text-[10px] font-bold tracking-widest uppercase text-white hover:text-black hover:bg-primary bg-white/5 border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all hover:shadow-[0_4px_15px_rgba(244,192,37,0.3)]">
                                                    RSVP <ArrowUpRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {watchParties.length === 0 && (
                                        <div className="text-center py-6 text-slate-400 text-sm italic font-serif">
                                            No upcoming screenings scheduled.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                    </div>

                </div>
            </main>

            {/* ── FOOTER ── */}
            <footer className="relative border-t border-white/10 bg-gradient-to-b from-[#0a0a0f]/90 to-[#050505] py-20 mt-20 relative z-10 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_2px] opacity-30"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full"></div>

                <div className="max-w-[1600px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
                    <div className="md:col-span-5">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">movie_filter</span>
                            <h2 className="text-white text-2xl font-bold tracking-tight font-serif italic group-hover:text-primary transition-colors">MovieWine</h2>
                        </Link>
                        <p className="text-sm text-slate-400 font-light max-w-md leading-relaxed mb-6">
                            A curated journal of cinema. Critical theory, passionate debates, and unpretentious love for the moving image.
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-500 font-mono tracking-wider">EST. 2024</span>
                            <div className="h-4 w-[1px] bg-white/20"></div>
                            <span className="text-xs text-slate-500 font-mono tracking-wider">THE DISCOURSE</span>
                        </div>
                    </div>
                    <div className="md:col-span-7 flex flex-wrap gap-16 md:justify-end">
                        <div className="space-y-6">
                            <h4 className="text-[11px] font-bold tracking-[0.25em] text-white uppercase border-b border-white/10 pb-3 mb-4">Explore</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><Link href="/" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></span>Home</Link></li>
                                <li><Link href="/movies" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></span>Movies</Link></li>
                                <li><Link href="/series" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></span>Series</Link></li>
                                <li><Link href="/community" className="text-primary flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary"></span>Community</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[11px] font-bold tracking-[0.25em] text-white uppercase border-b border-white/10 pb-3 mb-4">Connect</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-accent-purple/50 opacity-0 group-hover:opacity-100 transition-opacity"></span>Twitter</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-accent-purple/50 opacity-0 group-hover:opacity-100 transition-opacity"></span>Instagram</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-accent-purple/50 opacity-0 group-hover:opacity-100 transition-opacity"></span>Discord</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[11px] font-bold tracking-[0.25em] text-white uppercase border-b border-white/10 pb-3 mb-4">Legal</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity"></span>Privacy</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity"></span>Terms</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity"></span>Guidelines</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-white/5 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
                        <span>2026 MovieWine. All rights reserved.</span>
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            Systems Operational
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
