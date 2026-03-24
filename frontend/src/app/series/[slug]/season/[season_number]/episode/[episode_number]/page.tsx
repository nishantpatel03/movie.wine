import { HomeNavBar } from '@/components/home/HomeNavBar';
import { getEpisodeDetails, getTVDetails, getTVSeasonDetails, getImageUrl } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Play, Calendar, Clock, Star, Users } from 'lucide-react';

export default async function EpisodeDetailsPage({ params }: { params: Promise<{ slug: string, season_number: string, episode_number: string }> }) {
    const resolvedParams = await params;
    const seasonNumber = parseInt(resolvedParams.season_number);
    const episodeNumber = parseInt(resolvedParams.episode_number);
    const tvId = parseInt(resolvedParams.slug.split('-')[0]);

    if (isNaN(tvId) || isNaN(seasonNumber) || isNaN(episodeNumber)) return null;

    let episodeDetails: any = null;
    let seasonDetails: any = null;
    let show: any = null;

    try {
        show = await getTVDetails(tvId);
        seasonDetails = await getTVSeasonDetails(tvId, seasonNumber);
        episodeDetails = await getEpisodeDetails(tvId, seasonNumber, episodeNumber);
    } catch (error) {
        console.error("Failed to load episode details:", error);
    }

    if (!episodeDetails || !show) {
        return (
            <div className="min-h-screen bg-background-dark text-white flex flex-col items-center justify-center font-display">
                <HomeNavBar />
                <h1 className="text-2xl font-serif mt-20 text-slate-400">Episode not found</h1>
                <Link href={`/series/${resolvedParams.slug}/season/${seasonNumber}`} className="mt-6 text-primary hover:text-white transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Season
                </Link>
            </div>
        );
    }

    const backdropUrl = getImageUrl(episodeDetails.still_path || show.backdrop_path, 'original');
    
    // Determine next/prev episodes for navigation if possible
    const totalEpisodes = seasonDetails?.episodes?.length || 0;
    const hasNext = episodeNumber < totalEpisodes;
    const hasPrev = episodeNumber > 1;

    return (
        <div className="min-h-screen w-full flex flex-col bg-background-dark text-slate-100 font-display pb-20 selection:bg-primary/30 selection:text-white">
            <HomeNavBar />

            {/* Immersive Backdrop Header */}
            <div className="relative w-full h-[55vh] min-h-[450px] overflow-hidden pt-[100px]">
                <div className="absolute inset-0 bg-black z-0">
                    <img src={backdropUrl} alt="" className="w-full h-full object-cover opacity-40 mix-blend-screen" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background-dark to-transparent" />
                </div>
                
                <div className="relative z-10 w-full max-w-5xl mx-auto px-6 h-full flex flex-col justify-end pb-12">
                     <Link href={`/series/${resolvedParams.slug}/season/${seasonNumber}`} className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium mb-6 group w-fit">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                        Back to Season {seasonNumber}
                     </Link>

                     <h3 className="text-primary/90 font-bold tracking-wider uppercase text-sm mb-2 flex items-center gap-3">
                        {show.name} <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span> S{seasonNumber} E{episodeNumber}
                     </h3>
                     
                     <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-white tracking-tight leading-tight mb-6">
                         {episodeDetails.name}
                     </h1>
                     
                     <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-white/70 font-medium">
                        {episodeDetails.air_date && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                {new Date(episodeDetails.air_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        )}
                        {episodeDetails.runtime && (
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                {episodeDetails.runtime} min
                            </div>
                        )}
                        {episodeDetails.vote_average > 0 && (
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
                                {episodeDetails.vote_average.toFixed(1)} <span className="text-white/40 text-xs">({episodeDetails.vote_count} votes)</span>
                            </div>
                        )}
                     </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-5xl mx-auto px-6 mt-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Overview & Cast */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold tracking-tight text-white font-serif italic mb-4 flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-primary"></span>
                                Synopsis
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl">
                                {episodeDetails.overview || "No overview available for this episode."}
                            </p>
                        </section>

                        {/* Guest Stars */}
                        {episodeDetails.guest_stars && episodeDetails.guest_stars.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold tracking-tight text-white font-serif italic mb-6 flex items-center gap-3">
                                    <span className="w-8 h-[1px] bg-primary"></span>
                                    Guest Stars
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {episodeDetails.guest_stars.slice(0, 8).map((actor: any) => (
                                        <div key={actor.id} className="flex flex-col gap-3 group">
                                            <div className="w-full aspect-[2/3] relative rounded-xl overflow-hidden bg-white/5 border border-white/10">
                                                {actor.profile_path ? (
                                                    <Image
                                                        src={getImageUrl(actor.profile_path, 'w185')}
                                                        alt={actor.name}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        sizes="(max-width: 768px) 50vw, 185px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                                                        <Users className="w-8 h-8 opacity-20" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white leading-tight">{actor.name}</h4>
                                                <p className="text-xs text-primary/80 mt-1 line-clamp-1">{actor.character}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Metadata & Crew */}
                    <div className="space-y-8">
                        {/* Play Action */}
                        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                            <button className="w-16 h-16 rounded-full bg-primary text-black flex items-center justify-center hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 mb-4">
                                <Play className="w-6 h-6 ml-1 fill-black" />
                            </button>
                            <h4 className="font-bold text-white mb-1">Watch Episode</h4>
                            <p className="text-xs text-white/50">Requires premium subscription</p>
                        </div>
                        
                        {/* Crew Info */}
                        {episodeDetails.crew && episodeDetails.crew.length > 0 && (
                            <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl space-y-6">
                                <h3 className="text-lg font-bold text-white font-serif italic border-b border-white/10 pb-3">Crew Highlights</h3>
                                
                                {(() => {
                                    const directors = episodeDetails.crew.filter((c: any) => c.job === 'Director');
                                    const writers = episodeDetails.crew.filter((c: any) => c.job === 'Writer' || c.department === 'Writing');
                                    
                                    return (
                                        <div className="space-y-4">
                                            {directors.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Director</h4>
                                                    <p className="text-sm text-white/90 font-medium">
                                                        {directors.map((d: any) => d.name).join(', ')}
                                                    </p>
                                                </div>
                                            )}
                                            {writers.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Writer</h4>
                                                    <p className="text-sm text-white/90 font-medium">
                                                        {Array.from(new Set(writers.map((w: any) => w.name))).slice(0, 3).join(', ')}
                                                        {writers.length > 3 && ' ...'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Episode Navigation */}
                <div className="mt-20 pt-8 border-t border-white/10 flex items-center justify-between">
                    {hasPrev ? (
                        <Link 
                            href={`/series/${resolvedParams.slug}/season/${seasonNumber}/episode/${episodeNumber - 1}`}
                            className="flex flex-col items-start gap-1 group"
                        >
                            <span className="text-xs text-white/40 uppercase tracking-wider font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Previous Episode
                            </span>
                            <span className="text-lg font-bold text-white group-hover:text-white/80">Episode {episodeNumber - 1}</span>
                        </Link>
                    ) : (
                        <div></div> // Empty spacer
                    )}

                    {hasNext && (
                        <Link 
                            href={`/series/${resolvedParams.slug}/season/${seasonNumber}/episode/${episodeNumber + 1}`}
                            className="flex flex-col items-end gap-1 group"
                        >
                            <span className="text-xs text-white/40 uppercase tracking-wider font-bold flex items-center gap-2 group-hover:text-primary transition-colors">
                                Next Episode <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <span className="text-lg font-bold text-white group-hover:text-white/80">Episode {episodeNumber + 1}</span>
                        </Link>
                    )}
                </div>

            </div>
        </div>
    );
}
