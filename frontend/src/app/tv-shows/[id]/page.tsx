import { HomeNavBar } from '@/components/home/HomeNavBar';
import { getTVDetails, getImageUrl } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TVShowDetailsClient } from '@/components/tv/TVShowDetailsClient';

export default async function TVShowDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    let show: any = null;

    try {
        const resolvedParams = await params;
        show = await getTVDetails(parseInt(resolvedParams.id));
    } catch (error) {
        console.error("Failed to load TV show details:", error);
    }

    if (!show) {
        return (
            <div className="min-h-screen bg-background-dark text-white flex flex-col items-center justify-center font-display">
                <HomeNavBar />
                <h1 className="text-3xl font-serif mt-20 text-slate-400">TV Show not found</h1>
                <Link href="/tv-shows" className="mt-6 text-primary hover:text-white transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to TV Shows
                </Link>
            </div>
        );
    }

    const backdropUrl = getImageUrl(show.backdrop_path, 'original');
    const posterUrl = getImageUrl(show.poster_path);

    // Find the first YouTube trailer
    const trailerVideo = show.videos?.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
    const videoKey = trailerVideo ? trailerVideo.key : null;

    return (
        <TVShowDetailsClient 
            show={show} 
            backdropUrl={backdropUrl} 
            posterUrl={posterUrl} 
            videoKey={videoKey} 
        />
    );
}
