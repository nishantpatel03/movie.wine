'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Search, ArrowUpRight, Plus } from 'lucide-react';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [watchParties, setWatchParties] = useState<WatchParty[]>([]);
    const [columnists, setColumnists] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
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
        <div ref={containerRef} className="min-h-screen w-full bg-[#050505] text-[#f1f5f9] font-display relative selection:bg-primary selection:text-black">
            
            {/* ── Film Grain Overlay ── */}
            <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter>
                    <rect width="100%" height="100%" filter="url(#n)"/>
                </svg>
            </div>

            {/* ── Navbar ── */}
            <motion.header
                className="fixed top-0 z-40 w-full bg-[#050505]/80 backdrop-blur-xl transition-all duration-300"
                style={{ borderBottom: useTransform(headerBorderOpacity, v => `1px solid rgba(255, 255, 255, ${v * 0.05})`) }}
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
            <main className="w-full max-w-[1600px] mx-auto pt-40 pb-32 px-6 lg:px-12 relative">
                
                {/* ── Background Gradients ── */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute top-[400px] left-0 w-[600px] h-[600px] bg-accent-purple/5 blur-[150px] rounded-full pointer-events-none -translate-x-1/4"></div>

                {/* ── Typography Header ── */}
                <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-12 relative z-10">
                    <div className="max-w-3xl">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(244,192,37,0.8)]"></span>
                                <span className="text-xs font-bold tracking-[0.2em] text-slate-300 uppercase">Community Hub</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif leading-[0.9] tracking-tight mb-8 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                The <br/>
                                <span className="italic text-white/80">Discourse.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-400 font-light max-w-xl leading-relaxed">
                                Curated essays, heated debates, and cinematic analysis from the MovieWine editorial board and community.
                            </p>
                        </motion.div>
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col items-start md:items-end gap-6 shrink-0"
                    >
                        <div className="text-left md:text-right bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-2xl">
                            <div className="text-sm font-bold tracking-[0.2em] text-primary drop-shadow-[0_0_8px_rgba(244,192,37,0.4)] mb-2">ISSUE № 42</div>
                            <div className="text-xs text-slate-400 uppercase tracking-widest font-mono">March 2026</div>
                        </div>
                        <button 
                            onClick={() => setIsSubmitModalOpen(true)}
                            className="flex items-center gap-3 bg-white text-black rounded-full px-8 py-4 font-bold text-sm tracking-widest uppercase hover:bg-primary shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(244,192,37,0.4)] transition-all duration-300 group"
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
                    className="mb-20 relative z-10 max-w-4xl"
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-white/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 pl-6 group-focus-within:border-primary/50 transition-colors shadow-2xl">
                            <Search className="w-6 h-6 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search the archives..." 
                                className="bg-transparent border-none text-xl md:text-3xl font-serif text-white placeholder-slate-500 w-full px-6 py-4 focus:outline-none focus:ring-0"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="p-3 text-slate-500 hover:text-white mr-2">
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
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: i * 0.1 }}
                                            className="border border-white/5 bg-white/[0.02] backdrop-blur-sm rounded-3xl p-6 md:p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 shadow-2xl"
                                        >
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(244,192,37,0.8)]"></span>
                                                    <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase drop-shadow-[0_0_5px_rgba(244,192,37,0.5)]">{d.category}</span>
                                                </div>
                                                <span className="text-xs font-mono text-slate-500 bg-black/40 px-3 py-1 rounded-full uppercase tracking-widest border border-white/5">{timeAgo(d.created_at)}</span>
                                            </div>
                                            
                                            <div className="relative overflow-hidden aspect-[21/9] mb-10 rounded-2xl bg-[#111] border border-white/5 shadow-inner">
                                                <motion.img 
                                                    src={d.poster_url || '/placeholder-poster.png'} 
                                                    alt={d.title}
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                                            </div>
                                            
                                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight mb-6 group-hover:text-primary transition-colors">{d.title}</h2>
                                            <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed mb-10">{d.excerpt}</p>
                                            
                                            <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden flex items-center justify-center text-sm font-serif italic bg-white/5">
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
                                                
                                                <div className="flex items-center gap-6 text-slate-400 font-mono text-sm bg-black/40 px-5 py-2.5 rounded-full border border-white/5">
                                                    <span className="flex items-center gap-2 group/action">
                                                        <span className="material-symbols-outlined text-[18px] group-hover/action:scale-110 transition-transform">favorite</span> {d.likes_count}
                                                    </span>
                                                    <div className="w-[1px] h-4 bg-white/10"></div>
                                                    <span className="flex items-center gap-2 group/action">
                                                        <span className="material-symbols-outlined text-[18px] group-hover/action:scale-110 transition-transform">chat_bubble_outline</span> {d.replies_count}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.article>
                                    </Link>
                                ) : (
                                    /* Standard List Item */
                                    <Link key={d.id} href={`/community/discussions/${createSlug(d.id, d.title)}`} className="block group">
                                        <motion.article 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: i * 0.05 }}
                                            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start p-6 rounded-3xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all duration-300 relative"
                                        >
                                            <div className="absolute left-0 top-10 bottom-10 w-[2px] bg-primary/0 group-hover:bg-primary/50 transition-colors rounded-r-full"></div>
                                            
                                            <div className="md:col-span-3 flex flex-col gap-3">
                                                <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase group-hover:text-primary transition-colors flex items-center gap-2">
                                                    <span className="w-1 h-1 rounded-full bg-current"></span>
                                                    {d.category}
                                                </span>
                                                <span className="text-[10px] font-mono text-slate-600 bg-white/5 inline-block w-max px-2 py-1 rounded-md">{timeAgo(d.created_at)}</span>
                                            </div>
                                            
                                            <div className="md:col-span-9">
                                                <h3 className="text-2xl md:text-3xl font-serif mb-4 leading-snug group-hover:text-white text-slate-300 transition-colors">
                                                    {d.title}
                                                </h3>
                                                <p className="text-slate-500 font-light leading-relaxed mb-8 line-clamp-2">
                                                    {d.excerpt}
                                                </p>
                                                
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 border border-white/5">
                                                            {d.author.avatar_url && <img src={d.author.avatar_url} alt={d.author.username} className="w-full h-full object-cover" />}
                                                        </div>
                                                        <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">{d.author.username}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-slate-500 font-mono text-xs">
                                                        <span className="px-2 py-1 rounded">+ {d.likes_count}</span>
                                                        <span>/</span>
                                                        <span className="px-2 py-1 rounded">R {d.replies_count}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.article>
                                    </Link>
                                )
                            ))}
                        </AnimatePresence>

                        {!isLoading && filteredDiscussions.length === 0 && (
                            <div className="text-center py-32 border border-white/5 rounded-3xl bg-white/[0.01]">
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-6 h-6 text-slate-500" />
                                </div>
                                <h3 className="text-2xl font-serif text-white mb-2">No entries found</h3>
                                <p className="text-slate-500 font-light">Try adjusting your search query to find more articles.</p>
                            </div>
                        )}

                        {!isLoading && filteredDiscussions.length > 0 && (
                            <div className="pt-10 flex justify-center">
                                <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-8 py-4 text-xs font-bold tracking-widest uppercase text-white hover:text-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                    Load Previous Entries <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                    </div>

                    {/* ── Right Column: Sidebars (Span 4) ── */}
                    <div className="lg:col-span-4 space-y-12">
                        
                        {/* ── Trending Tags ── */}
                        <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
                            <h3 className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-white uppercase mb-8 border-b border-white/10 pb-6">
                                <span className="material-symbols-outlined text-primary text-xl">tag</span>
                                The Index
                            </h3>
                            <div className="flex flex-col gap-2">
                                {["Directors", "Cinematography", "Screenplay", "Original Scores", "Auteurs", "Cannes 2026"].map((tag, i) => (
                                    <Link key={tag} href="#" className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 group transition-all duration-300">
                                        <span className="text-lg font-serif text-slate-400 group-hover:text-white transition-colors">{tag}</span>
                                        <span className="text-xs font-mono text-slate-600 bg-black/40 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300">0{i+1}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* ── Top Columnists ── */}
                        <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
                            <h3 className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-white uppercase mb-8 border-b border-white/10 pb-6">
                                <span className="material-symbols-outlined text-accent-purple text-xl">star</span>
                                Featured Voices
                            </h3>
                            <div className="space-y-6">
                                {columnists.map((critic, i) => (
                                    <div key={i} className="flex gap-4 group cursor-pointer p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300">
                                        <div className="w-14 h-14 rounded-full border-2 border-white/10 overflow-hidden bg-black flex items-center justify-center font-serif text-xl italic text-slate-400 group-hover:border-accent-purple shadow-lg transition-colors shrink-0">
                                            {critic.avatar_url ? (
                                                <img src={critic.avatar_url} alt={critic.username} className="w-full h-full object-cover" />
                                            ) : (
                                                critic.username.charAt(0)
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <div className="text-sm font-bold text-white uppercase tracking-wider mb-1 group-hover:text-accent-purple transition-colors">{critic.username}</div>
                                            <div className="text-xs font-serif italic text-slate-400 mb-1.5">{critic.title}</div>
                                            <div className="text-[9px] tracking-[0.15em] text-slate-600 uppercase bg-black/30 w-max px-2 py-0.5 rounded-full border border-white/5">{critic.specialty}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* ── Virtual Screenings ── */}
                        <section className="relative overflow-hidden rounded-3xl border border-white/10 group bg-black shadow-2xl">
                            {/* Animated gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black to-accent-purple/20 opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                            
                            <div className="relative z-10 p-8">
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                                    <h3 className="text-xs font-bold tracking-[0.2em] text-primary uppercase flex items-center gap-2 drop-shadow-[0_0_5px_rgba(244,192,37,0.5)]">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse hidden md:block"></span>
                                        Live Screenings
                                    </h3>
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                                        <span className="material-symbols-outlined text-white text-sm">theaters</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-6">
                                    {watchParties.map((party, i) => (
                                        <div key={i} className="flex flex-col gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all duration-300">
                                            <div className="flex justify-between items-start gap-4">
                                                <h4 className="text-lg font-serif text-white leading-tight group-hover:text-primary transition-colors">{party.movie_title}</h4>
                                                <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-1 rounded uppercase min-w-max">
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
                                                <button className="text-[10px] font-bold tracking-widest uppercase text-white hover:text-black hover:bg-primary bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(255,255,255,0.05)] hover:shadow-[0_0_15px_rgba(244,192,37,0.4)]">
                                                    RSVP <ArrowUpRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {watchParties.length === 0 && (
                                        <div className="text-center py-6 text-slate-500 text-sm italic font-serif">
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
            <footer className="border-t border-white/5 bg-background-dark py-20 mt-10 relative z-10">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-4">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-primary text-3xl">movie_filter</span>
                            <h2 className="text-white text-2xl font-bold tracking-tight font-serif italic">MovieWine</h2>
                        </Link>
                        <p className="text-sm text-slate-500 font-light max-w-sm leading-relaxed">A curated journal of cinema. Critical theory, passionate debates, and unpretentious love for the moving image.</p>
                    </div>
                    <div className="md:col-span-8 flex flex-wrap gap-16 md:justify-end">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">Explore</h4>
                            <ul className="space-y-3 test-sm text-slate-400">
                                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                                <li><Link href="/movies" className="hover:text-primary transition-colors">Movies</Link></li>
                                <li><Link href="/series" className="hover:text-primary transition-colors">Series</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">Legal</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Terms</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Colophon</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
