import { HomeNavBar } from '@/components/home/HomeNavBar';
import { getMovieDetails, getImageUrl } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MovieDetailsClient } from '@/components/movies/MovieDetailsClient';

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    let movie: any = null;

    try {
        const resolvedParams = await params;
        movie = await getMovieDetails(parseInt(resolvedParams.id));
    } catch (error) {
        console.error("Failed to load movie details:", error);
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-background-dark text-white flex flex-col items-center justify-center font-display">
                <HomeNavBar />
                <h1 className="text-3xl font-serif mt-20 text-slate-400">Movie not found</h1>
                <Link href="/movies" className="mt-6 text-primary hover:text-white transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Movies
                </Link>
            </div>
        );
    }

    const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
    const posterUrl = getImageUrl(movie.poster_path);

    // Find the first YouTube trailer
    const trailerVideo = movie.videos?.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
    const videoKey = trailerVideo ? trailerVideo.key : null;

    return (
        <MovieDetailsClient
            movie={movie}
            backdropUrl={backdropUrl}
            posterUrl={posterUrl}
            videoKey={videoKey}
        />
    );
}
