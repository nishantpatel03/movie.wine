import { HomeNavBar } from '@/components/home/HomeNavBar';
import { getTVDetails, getImageUrl } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SeriesDetailsClient } from '@/components/series/SeriesDetailsClient';

export default async function SeriesDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    let show: any = null;

    try {
        const resolvedParams = await params;
        // Parse ID from slug format "123-stranger-things" -> 123
        const idString = resolvedParams.slug.split('-')[0];
        const id = parseInt(idString);

        if (isNaN(id)) throw new Error("Invalid series ID");
        show = await getTVDetails(id);
    } catch (error) {
        console.error("Failed to load series details:", error);
    }

    if (!show) {
        return (
            <div className="min-h-screen bg-background-dark text-white flex flex-col items-center justify-center font-display">
                <HomeNavBar />
                <h1 className="text-3xl font-serif mt-20 text-slate-400">Series not found</h1>
                <Link href="/series" className="mt-6 text-primary hover:text-white transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Series
                </Link>
            </div>
        );
    }

    const backdropUrl = getImageUrl(show.backdrop_path, 'original');
    const posterUrl = getImageUrl(show.poster_path);

    const trailerVideo = show.videos?.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
    const videoKey = trailerVideo ? trailerVideo.key : null;

    return (
        <SeriesDetailsClient
            show={show}
            backdropUrl={backdropUrl}
            posterUrl={posterUrl}
            videoKey={videoKey}
        />
    );
}
