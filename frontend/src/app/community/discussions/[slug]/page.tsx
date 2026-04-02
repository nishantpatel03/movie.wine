'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { 
    ArrowLeft, 
    Share2, 
    MessageSquare, 
    Heart, 
    Calendar, 
    User as UserIcon, 
    Clock,
    ChevronRight,
    Copy,
    Check
} from 'lucide-react';
import { getDiscussion, Discussion, createSlug } from '@/lib/api';
import { SignedIn, UserButton } from '@clerk/nextjs';

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

export default function DiscussionDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [discussion, setDiscussion] = useState<Discussion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSharing, setIsSharing] = useState(false);
    const [copied, setCopied] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const headerBorderOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

    useEffect(() => {
        if (!slug) return;

        const idMatch = (slug as string).match(/^(\d+)/);
        if (!idMatch) {
            console.error("Invalid slug format");
            setIsLoading(false);
            return;
        }

        const id = idMatch[1];
        
        const loadDiscussion = async () => {
            try {
                const data = await getDiscussion(id);
                setDiscussion(data);
                
                // Verify slug matches (SEO check)
                const expectedSlug = createSlug(data.id, data.title);
                if (slug !== expectedSlug) {
                    // router.replace(`/community/discussions/${expectedSlug}`);
                }
            } catch (error) {
                console.error("Failed to load discussion:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDiscussion();
    }, [slug, router]);

    const handleShare = async () => {
        if (!discussion) return;
        
        const shareData = {
            title: discussion.title,
            text: discussion.excerpt,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Share failed:", err);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Clipboard failed:", err);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!discussion) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6">
                <h1 className="text-4xl font-serif text-white mb-6 text-center">Article Not Found</h1>
                <Link 
                    href="/community" 
                    className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Community
                </Link>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen w-full bg-[#050505] text-[#f1f5f9] font-display relative selection:bg-primary selection:text-black pb-32">
            
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
                        <SignedIn>
                            <div className="h-10 w-10 flex items-center justify-center rounded-full border border-primary/30 p-0.5 hover:border-primary transition-colors cursor-pointer overflow-hidden shadow-[0_0_10px_rgba(244,192,37,0.1)] hover:shadow-[0_0_20px_rgba(244,192,37,0.3)]">
                                <UserButton appearance={{ elements: { avatarBox: "h-full w-full rounded-full object-cover" } }} />
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </motion.header>

            <main className="w-full max-w-[1000px] mx-auto pt-40 px-6 lg:px-12 relative z-10">
                
                {/* ── Breadcrumbs ── */}
                <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-12">
                    <Link href="/community" className="hover:text-primary transition-colors">COMMUNITY</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-white/40">{discussion.category}</span>
                </div>

                {/* ── Header Section ── */}
                <header className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(244,192,37,0.8)]"></span>
                            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase drop-shadow-[0_0_5px_rgba(244,192,37,0.5)]">
                                {discussion.category}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                {timeAgo(discussion.created_at)}
                            </span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-serif leading-[1.1] tracking-tight text-white mb-12">
                            {discussion.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-between gap-8 pt-10 border-t border-white/10">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-full border border-white/10 overflow-hidden flex items-center justify-center text-xl font-serif italic bg-white/5">
                                    {discussion.author.avatar_url ? (
                                        <img src={discussion.author.avatar_url} alt={discussion.author.username} className="w-full h-full object-cover" />
                                    ) : (
                                        discussion.author.username.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <span className="block text-sm font-bold tracking-widest text-white uppercase mb-1">{discussion.author.username}</span>
                                    <span className="block text-xs text-slate-500 uppercase tracking-widest italic">{discussion.author.title || 'Contributor'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={handleShare}
                                    className="flex items-center gap-3 bg-white/5 hover:bg-white text-slate-300 hover:text-black border border-white/10 rounded-full px-6 py-3 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 group"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 text-green-500" />
                                            LINK COPIED
                                        </>
                                    ) : (
                                        <>
                                            <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            SHARE ARTICLE
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </header>

                {/* ── Featured Image ── */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-20 shadow-2xl border border-white/5 group"
                >
                    <img 
                        src={discussion.poster_url || '/placeholder-poster.png'} 
                        alt={discussion.title}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    
                    {discussion.movie_title && (
                        <div className="absolute bottom-8 left-8">
                            <div className="text-[10px] font-bold tracking-[0.2em] text-primary mb-2 uppercase">DISCUSSING</div>
                            <div className="text-2xl font-serif text-white">{discussion.movie_title} {discussion.release_year && `(${discussion.release_year})`}</div>
                        </div>
                    )}
                </motion.div>

                {/* ── Article Content ── */}
                <article className="prose prose-invert prose-lg max-w-none mb-32">
                    <p className="text-2xl font-light text-slate-300 leading-relaxed mb-12 italic border-l-2 border-primary pl-8 py-2">
                        {discussion.excerpt}
                    </p>
                    
                    <div className="text-slate-400 leading-[1.8] font-light space-y-8 text-xl">
                        {discussion.content ? (
                            discussion.content.split('\n').map((para, i) => (
                                para.trim() && <p key={i}>{para}</p>
                            ))
                        ) : (
                            <p>No content available for this discussion.</p>
                        )}
                    </div>
                </article>

                {/* ── Article Footer ── */}
                <footer className="pt-16 border-t border-white/10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
                        <div className="flex items-center gap-12">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">REPLIES</span>
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                    <span className="text-2xl font-serif text-white">{discussion.replies_count}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">APPRECIATION</span>
                                <div className="flex items-center gap-3">
                                    <Heart className="w-5 h-5 text-primary" />
                                    <span className="text-2xl font-serif text-white">{discussion.likes_count}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-3 bg-primary text-black rounded-full px-10 py-4 font-bold text-sm tracking-widest uppercase hover:bg-white shadow-[0_0_20px_rgba(244,192,37,0.3)] transition-all duration-300">
                                JOIN THE CONVERSATION
                            </button>
                        </div>
                    </div>
                </footer>

                {/* ── Related Articles (Static for now) ── */}
                <section className="mt-40">
                    <h3 className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-12 border-b border-white/10 pb-6">
                        Further Reading
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2].map((i) => (
                            <div key={i} className="group cursor-pointer p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                                <div className="text-[10px] font-bold tracking-[0.2em] text-primary mb-4 uppercase">CINEMATOGRAPHY</div>
                                <h4 className="text-2xl font-serif text-white group-hover:text-primary transition-colors mb-4">The visual language of neon-noir</h4>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">MARCH 2026</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            {/* ── Background Gradients ── */}
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4 z-0"></div>
            <div className="fixed top-[400px] left-0 w-[600px] h-[600px] bg-accent-purple/5 blur-[150px] rounded-full pointer-events-none -translate-x-1/4 z-0"></div>

        </div>
    );
}
