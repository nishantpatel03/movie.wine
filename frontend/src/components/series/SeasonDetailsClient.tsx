'use client';

import { useState } from 'react';
import { Play, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl, getStreamingLinks, StreamingLink } from '@/lib/api';
import { StreamingPlayerModal } from '@/components/shared/StreamingPlayerModal';
import { motion } from 'framer-motion';

interface SeasonDetailsClientProps {
    seasonDetails: any;
    show: any;
    slug: string;
}

export function SeasonDetailsClient({ seasonDetails, show, slug }: SeasonDetailsClientProps) {
    const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
    const [activeLinks, setActiveLinks] = useState<StreamingLink[]>([]);
    const [activeEpisodeTitle, setActiveEpisodeTitle] = useState('');
    const [isLoadingLinks, setIsLoadingLinks] = useState(false);

    const handlePlayEpisode = async (e: React.MouseEvent, episode: any) => {
        e.preventDefault();
        e.stopPropagation();
        
        setIsLoadingLinks(true);
        setActiveEpisodeTitle(`${show.name} - S${seasonDetails.season_number} E${episode.episode_number}: ${episode.name}`);
        
        try {
            const links = await getStreamingLinks(
                show.id, 
                'tv', 
                seasonDetails.season_number, 
                episode.episode_number
            );
            
            if (links.length > 0) {
                setActiveLinks(links);
                setIsPlayerModalOpen(true);
            } else {
                alert('No streaming links available for this episode yet.');
            }
        } catch (error) {
            console.error('Failed to fetch episode links:', error);
            alert('Error loading streaming links.');
        } finally {
            setIsLoadingLinks(false);
        }
    };

    return (
        <>
            <div className="space-y-4">
                {seasonDetails.episodes?.map((episode: any) => (
                    <div 
                        key={episode.id} 
                        className="flex flex-col md:flex-row gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group relative overflow-hidden"
                    >
                        {/* Background subtle glow on hover */}
                        <div className="absolute inset-0 bg-primary/2 hidden group-hover:block transition-all" />

                        <div className="w-full md:w-72 aspect-video flex-shrink-0 relative rounded-lg overflow-hidden bg-black/50 border border-white/5">
                            {episode.still_path ? (
                                <>
                                    <Image
                                        src={getImageUrl(episode.still_path, 'w500')}
                                        alt={episode.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, 288px"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                                    <Play className="w-8 h-8 opacity-20 mb-2" />
                                    <span className="text-xs">No Image</span>
                                </div>
                            )}

                            {/* Play Button Overlay */}
                            <button 
                                onClick={(e) => handlePlayEpisode(e, episode)}
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
                            >
                                <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-2xl"
                                >
                                    <Play className="w-6 h-6 text-black fill-current translate-x-0.5" />
                                </motion.div>
                            </button>
                            
                            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white shadow-lg">
                                {episode.runtime ? `${episode.runtime}m` : 'TBA'}
                            </div>

                            <div className="absolute top-2 left-2 bg-primary/90 text-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter shadow-lg">
                                EP {episode.episode_number}
                            </div>
                        </div>
                        
                        <div className="flex-1 min-w-0 py-1 flex flex-col justify-center relative z-10">
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <Link 
                                    href={`/series/${slug}/season/${seasonDetails.season_number}/episode/${episode.episode_number}`}
                                    className="font-serif text-xl font-bold text-white leading-tight hover:text-primary transition-colors line-clamp-1"
                                >
                                    {episode.name}
                                </Link>
                                
                                <button 
                                    onClick={(e) => handlePlayEpisode(e, episode)}
                                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-primary hover:text-black rounded-xl border border-white/10 transition-all text-xs font-bold text-white/70"
                                >
                                    <Play className="w-3 h-3 fill-current" />
                                    WATCH NOW
                                </button>
                            </div>
                            <p className="text-[14px] text-white/50 leading-relaxed max-w-2xl mb-4 line-clamp-2">
                                {episode.overview || "No episode overview available."}
                            </p>
                            <div className="mt-auto flex items-center gap-6 text-[13px] font-medium text-slate-500">
                                {episode.air_date && <span>{new Date(episode.air_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>}
                                {episode.vote_average > 0 && (
                                    <span className="flex items-center gap-1.5 text-primary/80">
                                        <span className="material-symbols-outlined text-[14px]">star</span> {episode.vote_average.toFixed(1)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <StreamingPlayerModal 
                isOpen={isPlayerModalOpen}
                onClose={() => setIsPlayerModalOpen(false)}
                links={activeLinks}
                title={activeEpisodeTitle}
                posterPath={show.poster_path}
            />

            {isLoadingLinks && (
                <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-white font-bold tracking-widest text-xs uppercase animate-pulse">Initializing Stream...</p>
                    </div>
                </div>
            )}
        </>
    );
}
