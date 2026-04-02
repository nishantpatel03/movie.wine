'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Star, PlayCircle, Plus } from 'lucide-react';
import { HomeNavBar } from '@/components/home/HomeNavBar';
import { MovieTrailerModal } from '@/components/movies/MovieTrailerModal';
import { SeasonList } from './SeasonList';
import { AddToListButton } from '@/components/shared/AddToListButton';
import { WatchlistButton } from '@/components/shared/WatchlistButton';
import { WatchedButton } from '@/components/shared/WatchedButton';
import { CommentSection } from '@/components/shared/CommentSection';
import { StreamingPlayerModal } from '@/components/shared/StreamingPlayerModal';
import { getImageUrl, getStreamingLinks, StreamingLink } from '@/lib/api';
import { useState, useEffect } from 'react';

// Shared Animation Variants
const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as any } }
};

interface SeriesDetailsClientProps {
    show: any;
    backdropUrl: string;
    posterUrl: string;
    videoKey: string | null;
}

export function SeriesDetailsClient({ show, backdropUrl, posterUrl, videoKey }: SeriesDetailsClientProps) {
    const [activeTab, setActiveTab] = useState('episodes');
    const [streamingLinks, setStreamingLinks] = useState<StreamingLink[]>([]);
    const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);

    useEffect(() => {
        if (show?.id) {
            getStreamingLinks(show.id, 'tv').then(setStreamingLinks).catch(console.error);
        }
    }, [show?.id]);

    if (!show) return null;

    const endYear = show.in_production ? 'Present' : show.last_air_date?.substring(0, 4);
    const dateRange = `${show.first_air_date?.substring(0, 4) || ''} – ${endYear || ''}`;

    return (
        <div className="min-h-screen w-full flex flex-col bg-background-dark text-slate-100 font-display pb-20 overflow-x-hidden selection:bg-primary/30 selection:text-white">
            <HomeNavBar />

            {/* HERO SECTION */}
            <div className="relative w-full overflow-hidden flex items-center pt-[100px] lg:pt-[120px] pb-16 lg:pb-32">
                {/* Right side polygon with backdrop */}
                <div 
                    className="absolute right-0 top-0 bottom-0 w-[80%] lg:w-[55%] z-0"
                    style={{ clipPath: "polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
                >
                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0904] via-[#0a0904]/40 to-transparent z-10" />
                    <img src={backdropUrl} alt={show.name} className="w-full h-full object-cover opacity-60 lg:opacity-80" />
                </div>

                {/* Left gradient fade */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0904] via-[#0a0904]/90 lg:via-[#0a0904]/80 to-transparent z-10 w-full lg:w-[70%]" />
                
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0904] to-transparent z-10" />

                {/* Back button - Absolute for OTT look */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-12 left-6 lg:left-12 z-30"
                >
                    <Link href="/series" className="group flex items-center gap-3 text-white/60 hover:text-white transition-all bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-white/20 shadow-xl">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                        <span className="text-xs font-bold tracking-widest uppercase">Back to Browse</span>
                    </Link>
                </motion.div>

                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-6 lg:w-[65%]"
                >

                    {/* Status Badge */}
                    <motion.div variants={fadeInUp} className="mb-2">
                        <span className="px-3 py-1 bg-primary/10 border border-primary/25 rounded-full text-[11px] font-bold text-primary tracking-wider uppercase">
                            {show.status === 'Returning Series' ? 'Returning Series' : show.status}
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-[76px] font-serif text-white leading-[1.05] tracking-tight font-bold mix-blend-lighten max-w-4xl">
                        {show.name}
                    </motion.h1>

                    {/* Tagline */}
                    {show.tagline && (
                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-primary font-medium font-serif italic opacity-90 block mt-2">
                            "{show.tagline}"
                        </motion.p>
                    )}

                    {/* Meta row */}
                    <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3.5 mt-2 mb-2 text-[13px] md:text-sm text-white/50">
                        <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-[16px] font-bold text-yellow-500">{show.vote_average?.toFixed(1) || '0.0'}</span>
                            <span className="text-[13px] text-white/35">({show.vote_count?.toLocaleString() || 0} reviews)</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        <span className="font-medium text-white/70">{dateRange}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        <span className="font-medium text-white/70">{show.number_of_seasons} {show.number_of_seasons === 1 ? 'Season' : 'Seasons'}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        <span className="font-medium text-white/70">{show.number_of_episodes} Episodes</span>
                    </motion.div>

                    {/* Description */}
                    <motion.p variants={fadeInUp} className="text-[15px] leading-relaxed text-white/60 max-w-xl">
                        {show.overview}
                    </motion.p>

                    {/* Genres */}
                    <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 mt-2 mb-4">
                        {show.genres?.map((g: any) => (
                            <span key={g.id} className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium tracking-wide text-white/60">
                                {g.name}
                            </span>
                        ))}
                    </motion.div>

                    {/* Action Buttons - Premium Unified Design */}
                    <div className="flex items-center gap-3 pt-10 overflow-x-auto no-scrollbar pb-4 md:pb-0">
                        {streamingLinks.length > 0 && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsPlayerModalOpen(true)}
                                className="h-[52px] flex items-center gap-2.5 px-8 rounded-full font-black transition-all bg-primary text-black hover:bg-primary/90 shadow-[0_8px_20px_-4px_rgba(244,192,37,0.4)] shrink-0 text-xs tracking-[0.15em] uppercase"
                            >
                                <PlayCircle className="w-5 h-5 fill-current" />
                                WATCH NOW
                            </motion.button>
                        )}

                        <MovieTrailerModal videoKey={videoKey} isHero={true} />

                        <div className="flex items-center gap-3">
                            <WatchedButton
                                tmdbId={show.id}
                                mediaType="tv"
                                title={show.name}
                                posterPath={show.poster_path}
                                runtime={(show.episode_run_time?.[0] || 0) * (show.number_of_episodes || 0)}
                                isHero={true}
                            />
                            
                            <AddToListButton
                                tmdbId={show.id}
                                mediaType="tv"
                                title={show.name}
                                posterPath={show.poster_path}
                                isHero={true}
                            />

                            <WatchlistButton
                                tmdbId={show.id}
                                mediaType="tv"
                                title={show.name}
                                posterPath={show.poster_path}
                                isHero={true}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* MAIN CONTENT */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16 pt-8 pb-20">
                {/* LEFT COLUMN */}
                <div className="space-y-12">
                    {/* Tabs */}
                    <div className="flex flex-wrap items-center gap-3 mb-10 pb-2">
                        {['episodes', 'reviews', 'cast', 'story'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all border flex-shrink-0 ${
                                    activeTab === tab 
                                    ? 'bg-primary text-black border-primary shadow-[0_4px_14px_0_rgba(255,179,71,0.39)]' 
                                    : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* EPISODES TAB */}
                    {activeTab === 'episodes' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {show.seasons && show.seasons.length > 0 ? (
                                <SeasonList tvId={show.id} seriesName={show.name} seasons={show.seasons} />
                            ) : (
                                <p className="text-white/40">No episodes available.</p>
                            )}
                        </motion.div>
                    )}

                    {/* REVIEWS TAB */}
                    {activeTab === 'reviews' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CommentSection 
                                tmdbId={show.id} 
                                mediaType="tv" 
                                title={show.name} 
                                posterPath={show.poster_path} 
                            />
                        </motion.div>
                    )}

                    {/* CAST TAB */}
                    {activeTab === 'cast' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
                        >
                            {show.credits?.cast && show.credits.cast.length > 0 ? (
                                show.credits.cast.slice(0, 15).map((actor: any) => (
                                    <Link href={`/person/${actor.id}`} key={actor.id}>
                                        <div className="flex items-center gap-3.5 p-3.5 bg-white/5 border border-white/[0.06] rounded-2xl transition-all hover:bg-primary/5 hover:border-primary/30 group">
                                            {actor.profile_path ? (
                                                <img 
                                                    src={getImageUrl(actor.profile_path, 'w185')} 
                                                    alt={actor.name}
                                                    className="w-11 h-11 object-cover rounded-full border border-white/10"
                                                />
                                            ) : (
                                                <div className="w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/40 font-bold text-sm">
                                                    {actor.name.charAt(0)}
                                                </div>
                                            )}
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[14px] font-medium text-white truncate group-hover:text-primary transition-colors">{actor.name}</span>
                                                <span className="text-[12px] text-white/35 truncate">{actor.character}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-white/40 col-span-full">No cast information available.</p>
                            )}
                        </motion.div>
                    )}

                    {/* STORY TAB */}
                    {activeTab === 'story' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-10 bg-white/[0.03] border border-white/[0.08] rounded-[32px] shadow-2xl"
                        >
                            <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary/80 mb-8">The Synopsis</h2>
                            {show.tagline && (
                                <p className="font-serif italic text-2xl text-white/90 leading-relaxed mb-8 border-l-2 border-primary/30 pl-6">
                                    "{show.tagline}"
                                </p>
                            )}
                            <p className="text-[17px] text-white/60 leading-[1.8] font-normal">
                                {show.overview || "No overview available for this show."}
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* RIGHT COLUMN — Series Info */}
                <div className="lg:pt-[76px]">
                    <div className="bg-white/[0.025] border border-white/[0.07] rounded-[18px] p-7 sticky top-[100px]">
                        <h3 className="text-[11px] font-bold tracking-[1.5px] uppercase text-white/30 mb-6 pb-5 border-b border-white/10">
                            Series Information
                        </h3>

                        <div className="flex flex-col gap-6">
                            <div>
                                <p className="text-[10px] font-bold tracking-[1.2px] uppercase text-white/30 mb-1.5">Status</p>
                                <p className="text-[15px] font-medium text-primary">
                                    {show.status}
                                </p>
                            </div>
                            
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-[10px] font-bold tracking-[1.2px] uppercase text-white/30 mb-1.5">Seasons</p>
                                    <p className="text-[28px] font-light text-[#E8ECF0] tracking-[-0.5px]">
                                        {show.number_of_seasons}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold tracking-[1.2px] uppercase text-white/30 mb-1.5">Episodes</p>
                                    <p className="text-[28px] font-light text-[#E8ECF0] tracking-[-0.5px]">
                                        {show.number_of_episodes}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold tracking-[1.2px] uppercase text-white/30 mb-2">Networks</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {show.networks?.length > 0 ? (
                                        show.networks.map((n: any) => (
                                            <span key={n.id} className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-md text-[11px] font-medium text-white/45">
                                                {n.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-[13px] text-white/30">Unknown</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold tracking-[1.2px] uppercase text-white/30 mb-3">User Score</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center relative shadow-lg"
                                         style={{
                                            background: `conic-gradient(var(--tw-colors-primary, #6C63FF) ${(show.vote_average || 0) * 36}deg, rgba(255,255,255,0.08) ${(show.vote_average || 0) * 36}deg)`
                                         }}>
                                        <div className="w-11 h-11 rounded-full bg-[#111820] flex items-center justify-center z-10 border border-[#111820]">
                                            <span className="text-[14px] font-bold text-white">
                                                {Math.round((show.vote_average || 0) * 10)}%
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-[13px] text-white/40">Audience Score</p>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            <StreamingPlayerModal 
                isOpen={isPlayerModalOpen}
                onClose={() => setIsPlayerModalOpen(false)}
                links={streamingLinks}
                title={show.name}
                posterPath={show.poster_path}
            />
        </div>
    );
}
