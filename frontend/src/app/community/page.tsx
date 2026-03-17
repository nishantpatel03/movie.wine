'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Search, ArrowUpRight, Plus, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getDiscussions, getWatchParties, getColumnists, Discussion, WatchParty, User } from '@/lib/api';

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

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const headerBorderOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

    useEffect(() => {
        async function loadData() {
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
        }
        loadData();
    }, []);

    const filteredDiscussions = discussions.filter(d =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.movie_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div ref={containerRef} className="min-h-screen w-full bg-[#050505] text-[#f1f5f9] font-display relative selection:bg-[#f4c025] selection:text-black">
            
            {/* ── Film Grain Overlay ── */}
            <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.04] mix-blend-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter>
                    <rect width="100%" height="100%" filter="url(#n)"/>
                </svg>
            </div>

            {/* ── Navbar ── */}
            <motion.header
                className="fixed top-0 z-40 w-full bg-[#050505]/90 backdrop-blur-md transition-all duration-300"
                style={{ borderBottom: useTransform(headerBorderOpacity, v => `1px solid rgba(255, 255, 255, ${v * 0.1})`) }}
            >
                <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-3 group">
                            <span className="material-symbols-outlined text-[#f4c025] text-2xl">movie_filter</span>
                            <h2 className="text-[#f1f5f9] text-xl font-bold tracking-tight font-serif italic">MovieWine</h2>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-8">
                            {[
                                { label: "HOME", href: "/" },
                                { label: "FILMS", href: "/movies" },
                                { label: "SERIES", href: "/tv-shows" },
                                { label: "COMMUNITY", href: "/community", active: true },
                            ].map(item => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`text-xs font-bold tracking-[0.2em] transition-colors relative group ${item.active ? "text-[#f4c025]" : "text-[#888] hover:text-[#f1f5f9]"}`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-6">
                        <SignedOut>
                            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                <button className="text-xs font-bold tracking-widest text-[#f1f5f9] hover:text-[#f4c025] transition-colors">LOGIN</button>
                            </SignInButton>
                            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                                <button className="text-xs font-bold tracking-widest bg-[#f1f5f9] text-[#050505] px-6 py-2.5 hover:bg-[#f4c025] transition-colors">SUBSCRIBE</button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <div className="h-9 w-9 flex items-center justify-center border border-[#f4c025]/30 p-0.5 hover:border-[#f4c025] transition-colors cursor-pointer">
                                <UserButton appearance={{ elements: { avatarBox: "h-full w-full rounded-none object-cover" } }} />
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </motion.header>

            {/* ── MAIN LAYOUT ── */}
            <main className="w-full max-w-[1600px] mx-auto pt-32 pb-24 px-6 lg:px-12">
                
                {/* ── Typography Header ── */}
                <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#333] pb-10">
                    <div className="max-w-3xl">
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-[#f1f5f9] leading-[0.9] tracking-tight mb-6">
                            The <br/>
                            <span className="italic text-[#888]">Discourse.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#a0a0a0] font-light max-w-xl leading-relaxed">
                            Curated essays, heated debates, and cinematic analysis from the MovieWine editorial board and community.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-4 shrink-0">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.2em] text-[#f4c025] mb-2">ISSUE № 42</div>
                            <div className="text-sm text-[#888] uppercase tracking-widest">March 2026</div>
                        </div>
                        <button className="flex items-center gap-3 bg-[#f4c025] text-[#050505] px-6 py-3 font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors group">
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                            Submit Piece
                        </button>
                    </div>
                </header>

                {/* ── Search Bar ── */}
                <div className="mb-16 border-b border-[#333] pb-6 flex items-center">
                    <Search className="w-6 h-6 text-[#555] mr-4" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search the archives..." 
                        className="bg-transparent border-none text-2xl md:text-3xl font-serif text-[#f1f5f9] placeholder-[#444] w-full focus:outline-none focus:ring-0"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-12">
                    
                    {/* ── Left Column: Featured & Discussions (Span 8) ── */}
                    <div className="lg:col-span-8 space-y-16">
                        
                        <AnimatePresence>
                            {filteredDiscussions.map((d, i) => (
                                d.featured ? (
                                    /* Featured Editorial Block */
                                    <motion.article 
                                        key={d.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: i * 0.1 }}
                                        className="group cursor-pointer block border-b border-[#333] pb-16"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#f4c025] uppercase">{d.category}</span>
                                            <span className="text-xs font-mono text-[#666] uppercase tracking-widest">{timeAgo(d.created_at)}</span>
                                        </div>
                                        <div className="overflow-hidden aspect-[21/9] mb-8 bg-[#111]">
                                            <motion.img 
                                                src={d.poster_url || '/placeholder-poster.png'} 
                                                alt={d.title}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                                            />
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6 group-hover:text-[#f4c025] transition-colors">{d.title}</h2>
                                        <p className="text-lg text-[#aaa] font-light leading-relaxed mb-6">{d.excerpt}</p>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 border border-[#333] flex items-center justify-center text-sm font-serif italic text-[#888]">
                                                    {d.author.avatar_url || d.author.username.charAt(0)}
                                                </div>
                                                <span className="text-sm tracking-widest text-[#e0e0e0] uppercase">{d.author.username}</span>
                                            </div>
                                            <div className="flex items-center gap-6 text-[#666] font-mono text-sm">
                                                <span className="flex items-center gap-2 hover:text-[#f4c025] transition-colors"><span className="material-symbols-outlined text-[18px]">favorite</span> {d.likes_count}</span>
                                                <span className="flex items-center gap-2 hover:text-white transition-colors"><span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span> {d.replies_count}</span>
                                            </div>
                                        </div>
                                    </motion.article>
                                ) : (
                                    /* Standard List Item */
                                    <motion.article 
                                        key={d.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="group cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-t border-[#222] pt-8"
                                    >
                                        <div className="md:col-span-3 flex flex-col gap-2">
                                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#888] uppercase group-hover:text-[#f4c025] transition-colors">{d.category}</span>
                                            <span className="text-[10px] font-mono text-[#555]">{timeAgo(d.created_at)}</span>
                                        </div>
                                        <div className="md:col-span-9">
                                            <h3 className="text-2xl md:text-3xl font-serif mb-4 leading-snug group-hover:text-[#f1f5f9] text-[#d0d0d0] transition-colors">
                                                {d.title}
                                            </h3>
                                            <p className="text-[#888] font-light leading-relaxed mb-6 line-clamp-2 md:line-clamp-none">
                                                {d.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs tracking-widest text-[#aaa] uppercase font-bold">{d.author.username}</span>
                                                <div className="flex items-center gap-4 text-[#555] font-mono text-xs">
                                                    <span className="hover:text-[#f4c025] transition-colors">+ {d.likes_count}</span>
                                                    <span>/</span>
                                                    <span className="hover:text-white transition-colors">R {d.replies_count}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                )
                            ))}
                        </AnimatePresence>

                        {filteredDiscussions.length === 0 && (
                            <div className="text-center py-20 border-t border-[#333]">
                                <p className="text-[#666] font-serif italic text-2xl">No entries found for your query.</p>
                            </div>
                        )}

                        <div className="pt-10 flex justify-center border-t border-[#333]">
                            <button className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#888] hover:text-[#f4c025] transition-colors">
                                Load Previous Entries <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>

                    </div>

                    {/* ── Right Column: Sidebars (Span 4) ── */}
                    <div className="lg:col-span-4 space-y-16">
                        
                        {/* ── Trending Tags ── */}
                        <section>
                            <h3 className="text-xs font-bold tracking-[0.2em] text-[#888] uppercase mb-6 border-b border-[#333] pb-4">Index</h3>
                            <ul className="flex flex-col gap-0 border-b border-[#333]">
                                {["Directors", "Cinematography", "Screenplay", "Original Scores", "Auteurs", "Cannes 2026"].map((tag, i) => (
                                    <li key={tag} className="border-t border-[#222]">
                                        <Link href="#" className="flex items-center justify-between py-4 group">
                                            <span className="text-lg font-serif text-[#aaa] group-hover:text-[#f4c025] transition-colors">{tag}</span>
                                            <span className="text-xs font-mono text-[#555] group-hover:text-[#f4c025]">0{i+1}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* ── Top Columnists ── */}
                        <section>
                            <h3 className="text-xs font-bold tracking-[0.2em] text-[#888] uppercase mb-6 border-b border-[#333] pb-4">Featured Voices</h3>
                            <div className="space-y-8">
                                {columnists.map((critic, i) => (
                                    <div key={i} className="flex gap-4 group cursor-pointer">
                                        <div className="w-12 h-12 border border-[#333] flex items-center justify-center font-serif text-xl italic text-[#e0e0e0] group-hover:border-[#f4c025] group-hover:text-[#f4c025] transition-colors shrink-0">
                                            {critic.avatar_url || critic.username.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-base font-bold text-[#f1f5f9] uppercase tracking-wide mb-1">{critic.username}</div>
                                            <div className="text-xs font-serif italic text-[#888] mb-1">{critic.title}</div>
                                            <div className="text-[10px] tracking-widest text-[#555] uppercase">{critic.specialty}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* ── Screenings / Watch Parties ── */}
                        <section className="bg-[#111] border border-[#333] p-8 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-xs font-bold tracking-[0.2em] text-[#f4c025] uppercase mb-8">Virtual Screenings</h3>
                                <div className="space-y-6">
                                    {watchParties.map((party, i) => (
                                        <div key={i} className="border-b border-[#222] pb-6 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-lg font-serif text-[#f1f5f9] leading-tight pr-4">{party.movie_title}</h4>
                                                <span className="text-[10px] font-mono text-[#666] uppercase whitespace-nowrap mt-1">
                                                    {new Date(party.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="text-xs text-[#888] uppercase tracking-wider mb-3">Host: {party.host.username}</div>
                                            <button className="text-[10px] font-bold tracking-widest uppercase text-[#555] hover:text-[#f1f5f9] flex items-center gap-2 transition-colors">
                                                RSVP <ArrowUpRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                    </div>

                </div>
            </main>

            {/* ── FOOTER ── */}
            <footer className="border-t border-[#222] py-20 mt-20">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-4">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-[#f4c025] text-2xl">movie_filter</span>
                            <h2 className="text-[#f1f5f9] text-xl font-bold tracking-tight font-serif italic">MovieWine</h2>
                        </Link>
                        <p className="text-sm text-[#666] font-light max-w-sm">A curated journal of cinema. Critical theory, passionate debates, and unpretentious love for the moving image.</p>
                    </div>
                    <div className="md:col-span-8 flex flex-wrap gap-16 md:justify-end">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#888] uppercase">Explore</h4>
                            <ul className="space-y-2 text-sm text-[#aaa]">
                                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link href="/movies" className="hover:text-white transition-colors">Films</Link></li>
                                <li><Link href="/tv-shows" className="hover:text-white transition-colors">Series</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#888] uppercase">Legal</h4>
                            <ul className="space-y-2 text-sm text-[#aaa]">
                                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Colophon</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
