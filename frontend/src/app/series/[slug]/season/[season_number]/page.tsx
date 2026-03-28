import { HomeNavBar } from '@/components/home/HomeNavBar';
import { getTVSeasonDetails, getTVDetails, getImageUrl } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';
import { SeasonDetailsClient } from '@/components/series/SeasonDetailsClient';

export default async function SeasonDetailsPage({ params }: { params: Promise<{ slug: string, season_number: string }> }) {
    const resolvedParams = await params;
    const seasonNumber = parseInt(resolvedParams.season_number);
    const tvId = parseInt(resolvedParams.slug.split('-')[0]);

    if (isNaN(tvId) || isNaN(seasonNumber)) return null;

    let seasonDetails: any = null;
    let show: any = null;

    try {
        show = await getTVDetails(tvId);
        seasonDetails = await getTVSeasonDetails(tvId, seasonNumber);
    } catch (error) {
        console.error("Failed to load season details:", error);
    }

    if (!seasonDetails || !show) {
        return (
            <div className="min-h-screen bg-background-dark text-white flex flex-col items-center justify-center font-display">
                <HomeNavBar />
                <h1 className="text-2xl font-serif mt-20 text-slate-400">Season not found</h1>
                <Link href={`/series/${resolvedParams.slug}`} className="mt-6 text-primary hover:text-white transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Series
                </Link>
            </div>
        );
    }

    const backdropUrl = getImageUrl(show.backdrop_path, 'original');
    const seasonPosterUrl = getImageUrl(seasonDetails.poster_path, 'w500');

    return (
        <div className="min-h-screen w-full flex flex-col bg-background-dark text-slate-100 font-display pb-20 selection:bg-primary/30 selection:text-white">
            <HomeNavBar />

            {/* Backdrop Header */}
            <div className="relative w-full h-[45vh] min-h-[350px] overflow-hidden pt-[100px]">
                <div className="absolute inset-0 bg-black z-0">
                    <img src={backdropUrl} alt="" className="w-full h-full object-cover opacity-40 mix-blend-screen" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent" />
                </div>
                
                <div className="relative z-10 w-full max-w-5xl mx-auto px-6 h-full flex items-end pb-12">
                    <div className="flex flex-col md:flex-row md:items-end gap-8">
                        {seasonDetails.poster_path && (
                            <img 
                                src={seasonPosterUrl} 
                                alt={seasonDetails.name} 
                                className="w-32 md:w-40 rounded-xl shadow-2xl border border-white/10" 
                            />
                        )}
                        <div>
                            <Link href={`/series/${resolvedParams.slug}`} className="inline-flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm font-medium mb-4 group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to {show.name}
                            </Link>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white tracking-tight leading-tight">{seasonDetails.name}</h1>
                            {seasonDetails.air_date && (
                                <div className="flex items-center gap-3 mt-4 text-sm">
                                    <span className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                        Season {seasonDetails.season_number}
                                    </span>
                                    <span className="text-white/50">{seasonDetails.air_date.substring(0, 4)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-5xl mx-auto px-6 mt-8">
                <div className="mb-12 bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl">
                    <p className="text-slate-300 text-[15px] leading-relaxed">
                        {seasonDetails.overview || "No season overview available."}
                    </p>
                </div>

                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-white font-serif italic flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-primary"></span>
                        Episodes
                        <span className="text-sm font-sans font-medium text-white/30 not-italic ml-2">({seasonDetails.episodes?.length || 0})</span>
                    </h2>
                </div>

                <SeasonDetailsClient 
                    seasonDetails={seasonDetails} 
                    show={show} 
                    slug={resolvedParams.slug} 
                />
            </div>
        </div>
    );
}
