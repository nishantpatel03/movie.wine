'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Star, PlayCircle, Plus } from 'lucide-react';
import { HomeNavBar } from '@/components/home/HomeNavBar';
import { MovieTrailerModal } from '@/components/movies/MovieTrailerModal';
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

const fadeInRight: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as any } }
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as any } }
};

interface MovieDetailsClientProps {
    movie: any;
    backdropUrl: string;
    posterUrl: string;
    videoKey: string | null;
}

export function MovieDetailsClient({ movie, backdropUrl, posterUrl, videoKey }: MovieDetailsClientProps) {
    const [streamingLinks, setStreamingLinks] = useState<StreamingLink[]>([]);
    const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);

    useEffect(() => {
        if (movie?.id) {
            getStreamingLinks(movie.id, 'movie').then(setStreamingLinks).catch(console.error);
        }
    }, [movie?.id]);

    if (!movie) return null;

    // Format money
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#0a0904] text-slate-100 font-display pb-20 overflow-x-hidden selection:bg-primary/30 selection:text-white">
            <HomeNavBar />

            {/* OTT Style Hero Backdrop Section */}
            <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] overflow-hidden flex items-center pt-32 pb-24">
                {/* Background Image & Strong Overlays */}
                <motion.div 
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 z-0 bg-black"
                >
                    <img
                        src={backdropUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover opacity-60 block"
                    />
                    {/* Gradients for text readability exactly like Netflix/Max */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0904] via-[#0a0904]/40 to-transparent"></div>
                    <div className="absolute inset-0 w-full lg:w-3/4 bg-gradient-to-r from-[#0a0904] via-[#0a0904]/90 to-transparent"></div>
                </motion.div>

                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-6 lg:gap-8 lg:w-2/3"
                >
                    {/* Back button */}
                    <motion.div variants={fadeInUp}>
                        <Link href="/movies" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase mb-2 w-fit group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
                        </Link>
                    </motion.div>

                    <div className="space-y-4">
                        <motion.h1 variants={fadeInRight} className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-none drop-shadow-2xl font-bold tracking-tighter">
                            {movie.title}
                        </motion.h1>
                        {movie.tagline && (
                            <motion.p variants={fadeInRight} className="text-xl md:text-2xl text-primary font-medium mt-4 drop-shadow-lg italic">
                                {movie.tagline}
                            </motion.p>
                        )}
                    </div>

                    {/* Quick Stats Row */}
                    <motion.div variants={fadeInRight} className="flex flex-wrap items-center gap-4 text-sm md:text-base text-slate-200 font-semibold drop-shadow-md">
                        <div className="flex items-center gap-1.5 text-primary">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="text-white text-lg">{movie.vote_average?.toFixed(1) || '0.0'}</span>
                            <span className="text-sm font-normal text-slate-400">({movie.vote_count?.toLocaleString() || 0} reviews)</span>
                        </div>

                        <span className="w-1 h-1 rounded-full bg-white/30 hidden sm:block"></span>

                        <div className="flex items-center gap-1 font-bold text-white">
                            <span>{movie.release_date?.substring(0, 4)}</span>
                        </div>

                        {movie.runtime > 0 && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-white/30 hidden sm:block"></span>
                                <div className="flex items-center gap-1">
                                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                                </div>
                            </>
                        )}

                        <span className="w-1 h-1 rounded-full bg-white/30 hidden sm:block"></span>

                        <div className="flex items-center gap-1 text-slate-300 border border-white/20 px-2 py-0.5 rounded text-xs bg-white/5 backdrop-blur-sm uppercase tracking-wider">
                            {movie.status}
                        </div>
                    </motion.div>

                    {/* Short Overview snippet */}
                    <motion.p variants={fadeInRight} className="text-lg text-slate-300 leading-relaxed max-w-2xl drop-shadow-md line-clamp-3 md:line-clamp-4 font-normal">
                        {movie.overview}
                    </motion.p>

                    {/* Genres */}
                    <motion.div variants={fadeInRight} className="flex flex-wrap gap-2 pt-2">
                        {movie.genres?.map((g: any) => (
                            <span key={g.id} className="text-sm font-medium text-slate-300 drop-shadow-sm flex items-center pr-2 after:content-['•'] after:ml-2 after:text-white/20 last:after:hidden">
                                {g.name}
                            </span>
                        ))}
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6 pt-10">
                        {streamingLinks.length > 0 && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsPlayerModalOpen(true)}
                                className="flex items-center gap-2 px-8 py-3 lg:px-10 lg:py-4 rounded-xl font-bold transition-all bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(255,179,71,0.3)]"
                            >
                                <PlayCircle className="w-5 h-5 fill-current" />
                                WATCH NOW
                            </motion.button>
                        )}

                        <MovieTrailerModal videoKey={videoKey} isHero={true} />

                        <WatchedButton
                            tmdbId={movie.id}
                            mediaType="movie"
                            title={movie.title}
                            posterPath={movie.poster_path}
                            runtime={movie.runtime}
                            isHero={true}
                        />

                        <AddToListButton
                            tmdbId={movie.id}
                            mediaType="movie"
                            title={movie.title}
                            posterPath={movie.poster_path}
                        />

                        <WatchlistButton
                            tmdbId={movie.id}
                            mediaType="movie"
                            title={movie.title}
                            posterPath={movie.poster_path}
                            isHero={true}
                        />
                    </motion.div>
                </motion.div>
            </section>

            {/* Content Details Below the Hero */}
            <section className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
                
                {/* Main Column */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="lg:col-span-2 space-y-16"
                >
                    {/* Overview */}
                    <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-xl border border-white/5 p-10 rounded-[40px] shadow-2xl">
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-8 uppercase tracking-[0.2em] text-[12px] text-primary/80">
                            The Story
                        </h2>
                        <p className="text-lg text-slate-300 leading-relaxed font-normal">
                            {movie.overview}
                        </p>
                    </motion.div>

                    {/* Top Cast */}
                    {movie.credits?.cast && movie.credits.cast.length > 0 && (
                        <motion.div variants={fadeInUp}>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold tracking-tight text-white">
                                    Top Cast
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {movie.credits.cast.slice(0, 6).map((actor: any) => (
                                    <Link href={`/person/${actor.id}`} key={actor.id}>
                                        <motion.div 
                                            whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)" }}
                                            className="bg-white/5 backdrop-blur-lg border border-white/5 rounded-2xl overflow-hidden flex items-center gap-4 p-3 pr-4 group transition-colors shadow-lg"
                                        >
                                            <img
                                                src={getImageUrl(actor.profile_path, 'w500')}
                                                alt={actor.name}
                                                className="w-14 h-14 object-cover rounded-full border border-white/10"
                                            />
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <span className="text-white font-bold text-sm truncate group-hover:text-primary transition-colors">{actor.name}</span>
                                                <span className="text-slate-400 text-xs truncate">{actor.character}</span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Comments Section */}
                    <motion.div variants={fadeInUp} className="pt-8">
                        <CommentSection 
                            tmdbId={movie.id}
                            mediaType="movie"
                            title={movie.title}
                            posterPath={movie.poster_path}
                        />
                    </motion.div>
                </motion.div>

                {/* Sidebar Info */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="space-y-8 h-fit bg-white/5 backdrop-blur-xl border border-white/5 p-8 rounded-3xl"
                >
                    <h3 className="text-xl font-bold tracking-tight text-white pb-6 border-b border-white/10 uppercase tracking-widest text-sm text-primary">Information</h3>

                    <div className="space-y-6">
                        <div>
                            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Status</p>
                            <p className="text-white font-medium text-lg">{movie.status}</p>
                        </div>

                        <div>
                            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Original Language</p>
                            <p className="text-white font-medium text-lg uppercase">{movie.original_language}</p>
                        </div>

                        <div>
                            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Budget</p>
                            <p className="text-white font-medium text-lg">{movie.budget > 0 ? formatCurrency(movie.budget) : 'Unknown'}</p>
                        </div>

                        <div>
                            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Revenue</p>
                            <p className="text-white font-medium text-lg">{movie.revenue > 0 ? formatCurrency(movie.revenue) : 'Unknown'}</p>
                        </div>

                        {movie.production_companies && movie.production_companies.length > 0 && (
                            <div>
                                <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Production</p>
                                <div className="flex flex-col gap-2 mt-2">
                                    {movie.production_companies.slice(0, 3).map((company: any) => (
                                        <span key={company.id} className="text-sm font-medium text-slate-200">{company.name}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

            </section>

            <StreamingPlayerModal 
                isOpen={isPlayerModalOpen}
                onClose={() => setIsPlayerModalOpen(false)}
                links={streamingLinks}
                title={movie.title}
            />
        </div>
    );
}
