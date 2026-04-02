'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
    getDiscussion, 
    Discussion, 
    getImageUrl, 
    createSlug 
} from '@/lib/api';
import { 
    ArrowLeft, 
    Share2, 
    MessageSquare, 
    Heart, 
    Clock, 
    Calendar,
    ChevronRight,
    Check,
    Copy,
    ExternalLink
} from 'lucide-react';

// --- Helper: Time Ago ---
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
    const [isCopied, setIsCopied] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    // Extract ID from slug (e.g. "42-the-title" -> 42)
    const discussionId = typeof slug === 'string' ? parseInt(slug.split('-')[0]) : null;

    useEffect(() => {
        if (!discussionId) {
            router.push('/community');
            return;
        }

        const loadData = async () => {
            try {
                const data = await getDiscussion(discussionId);
                setDiscussion(data);
            } catch (error) {
                console.error("Failed to load discussion:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [discussionId, router]);

    const handleShare = async () => {
        const url = window.location.href;
        const title = discussion?.title || 'Check out this article on MovieWine';

        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
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
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white px-6">
                <h1 className="text-4xl font-serif mb-6">Article not found.</h1>
                <Link href="/community" className="flex items-center gap-2 text-primary hover:underline">
                    <ArrowLeft className="w-5 h-5" /> Back to Community
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-slate-100 font-display selection:bg-primary selection:text-black">
            {/* Background Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-primary/3 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/4" />
            </div>

            {/* Navigation Header */}
            <header className="fixed top-0 z-50 w-full px-6 lg:px-12 py-6 flex items-center justify-between backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-8">
                    <Link href="/community" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:scale-110 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] hidden md:block">The Archives</span>
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-3 bg-white text-black rounded-full px-6 py-3 font-bold text-[10px] uppercase tracking-widest hover:bg-primary transition-all active:scale-95 group"
                    >
                        {isCopied ? (
                            <>
                                <Check className="w-3.5 h-3.5 animate-in zoom-in duration-300" />
                                Link Copied
                            </>
                        ) : (
                            <>
                                <Share2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                                Share Article
                            </>
                        )}
                    </button>
                    <Link href="/" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-primary transition-colors">
                        <span className="material-symbols-outlined text-primary text-xl">movie_filter</span>
                    </Link>
                </div>
            </header>

            <main className="relative z-10 pt-32 pb-40 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    
                    {/* Main Content (Span 8) */}
                    <div className="lg:col-span-8 flex flex-col items-center">
                        
                        {/* Meta Data */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full mb-12"
                        >
                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                    {discussion.category}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> {timeAgo(discussion.created_at)}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> {new Date(discussion.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight italic text-white leading-[0.95] mb-12 drop-shadow-2xl">
                                {discussion.title}
                            </h1>

                            <div className="flex items-center gap-4 py-8 border-y border-white/5">
                                <div className="w-16 h-16 rounded-full border-2 border-white/10 overflow-hidden flex items-center justify-center text-2xl font-serif italic bg-white/5">
                                    {discussion.author.avatar_url ? (
                                        <img src={discussion.author.avatar_url} alt={discussion.author.username} className="w-full h-full object-cover" />
                                    ) : (
                                        discussion.author.username.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <span className="block text-sm font-black tracking-[0.2em] text-white uppercase mb-1">
                                        Written by <span className="text-primary">{discussion.author.username}</span>
                                    </span>
                                    <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                        {discussion.author.title || 'Contributor'} • Editorial Board
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Cover Image */}
                        {discussion.poster_url && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-full aspect-video rounded-[32px] overflow-hidden border border-white/10 mb-20 shadow-2xl relative"
                            >
                                <img 
                                    src={discussion.poster_url} 
                                    alt="Cover Art" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                            </motion.div>
                        )}

                        {/* Content */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="w-full prose prose-invert prose-2xl max-w-none"
                        >
                            <p className="text-2xl md:text-3xl text-slate-400 font-light italic mb-12 leading-relaxed border-l-2 border-primary pl-8">
                                {discussion.excerpt}
                            </p>
                            
                            <div className="text-xl md:text-2xl text-slate-300 leading-relaxed space-y-10 font-light drop-shadow-sm">
                                {discussion.content ? (
                                    discussion.content.split('\n').map((para, i) => (
                                        para.trim() ? <p key={i}>{para}</p> : <br key={i} />
                                    ))
                                ) : (
                                    <p>The archives are quiet. Content to be restored shortly.</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Article Footer / Stats */}
                        <div className="w-full mt-24 pt-12 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-8">
                                <button className="flex items-center gap-3 group cursor-pointer active:scale-95 transition-all">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/50 transition-all">
                                        <Heart className={`w-5 h-5 group-hover:fill-primary text-slate-500 group-hover:text-primary transition-all`} />
                                    </div>
                                    <span className="text-xl font-mono text-slate-500 group-hover:text-white transition-colors">{discussion.likes_count}</span>
                                </button>
                                <button className="flex items-center gap-3 group cursor-pointer active:scale-95 transition-all">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                                        <MessageSquare className="w-5 h-5 text-slate-500 group-hover:text-white transition-all" />
                                    </div>
                                    <span className="text-xl font-mono text-slate-500 group-hover:text-white transition-colors">{discussion.replies_count}</span>
                                </button>
                            </div>

                            <button 
                                onClick={handleShare}
                                className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest group"
                            >
                                <Share2 className="w-4 h-4" /> Share Article
                            </button>
                        </div>
                    </div>

                    {/* Sidebar (Span 4) */}
                    <aside className="lg:col-span-4 hidden lg:block space-y-12 h-max sticky top-32">
                        <section className="bg-white/5 rounded-3xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                Related Subject
                            </h3>
                            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 group">
                                <img 
                                    src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400" 
                                    alt="Movie" 
                                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                                    <h4 className="text-2xl font-serif italic text-white mb-2">{discussion.movie_title}</h4>
                                    <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
                                        View Stream <ExternalLink className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="p-8 border border-white/10 rounded-3xl bg-primary/5">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-4">The Discourse</h3>
                            <p className="text-sm text-slate-400 font-light leading-relaxed">
                                Join the editorial board of MovieWine. Contribute your perspective to the cinemaphile community.
                            </p>
                            <button className="w-full mt-8 py-4 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary transition-all">
                                Write an Issue
                            </button>
                        </section>
                    </aside>
                </div>
            </main>

            {/* Newsletter Overlay */}
            <section className="relative z-10 border-t border-white/5 bg-black py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl md:text-7xl font-serif italic text-white mb-8 leading-tight">
                        Cinema is a <br/>matter of what's <br/>in the frame.
                    </h2>
                    <p className="text-slate-500 font-mono text-sm uppercase tracking-widest mb-12">— Martin Scorsese</p>
                    <Link href="/community" className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-white hover:text-primary transition-all group">
                        Return to the index <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
