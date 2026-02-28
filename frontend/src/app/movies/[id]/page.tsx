import { HomeNavBar } from '@/components/home/HomeNavBar';
import { getMovieDetails, getImageUrl } from '@/lib/api';
import { MovieTrailerModal } from '@/components/movies/MovieTrailerModal';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Star, TrendingUp } from 'lucide-react';

export default async function MovieDetailsPage({ params }: { params: { id: string } }) {
    let movie: any = null;

    try {
        movie = await getMovieDetails(parseInt(params.id));
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

    // Format money
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-background-dark text-slate-100 font-display pb-20">
            <HomeNavBar />

            {/* Huge Hero Backdrop Section */}
            <section className="relative w-full h-[70vh] lg:h-[85vh] overflow-hidden flex items-end pb-12 lg:pb-24 pt-32">
                {/* Background Image & Overlays */}
                <div className="absolute inset-0 z-0 bg-black">
                    <img
                        src={backdropUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover opacity-50 block"
                    />
                    {/* Gradient to smooth bottom into background-dark */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/30 to-transparent"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-end lg:items-center gap-8 lg:gap-16">
                    {/* Floating Poster */}
                    <div className="hidden lg:block shrink-0 w-72 lg:w-96 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 relative -mb-32">
                        <img src={posterUrl} alt={movie.title} className="w-full h-auto" />
                    </div>

                    {/* Movie Info */}
                    <div className="flex-1 space-y-6">
                        <Link href="/movies" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold tracking-widest uppercase mb-4">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Link>

                        <div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-white leading-tight drop-shadow-2xl">
                                {movie.title}
                            </h1>
                            {movie.tagline && (
                                <p className="text-xl md:text-2xl text-slate-300 font-medium mt-4 lg:mt-6 drop-shadow-xl opacity-90 italic">
                                    "{movie.tagline}"
                                </p>
                            )}
                        </div>

                        {/* Quick Stats Row */}
                        <div className="flex flex-wrap items-center gap-4 lg:gap-8 text-sm md:text-base text-slate-300">
                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                <Star className="w-4 h-4 text-primary fill-primary" />
                                <span className="font-bold text-white">{movie.vote_average.toFixed(1)}</span>
                                <span className="text-xs text-slate-400">({movie.vote_count.toLocaleString()})</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span>{movie.runtime} min</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span>{movie.release_date?.substring(0, 4)}</span>
                            </div>
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {movie.genres?.map((g: any) => (
                                <span key={g.id} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium tracking-wide text-slate-300">
                                    {g.name}
                                </span>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-4 pt-6">
                            <MovieTrailerModal videoKey={videoKey} isHero={false} />

                            <button className="flex items-center gap-2 px-8 py-3 lg:px-10 lg:py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold border border-white/10 transition-colors shadow-lg">
                                <span className="material-symbols-outlined">add</span>
                                MY LIST
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Details Below the Hero */}
            <section className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 mt-12 lg:mt-32 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">

                {/* Main Column */}
                <div className="lg:col-span-2 space-y-16">
                    {/* Overview */}
                    <div>
                        <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-primary block rounded-full"></span>
                            The Story
                        </h2>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            {movie.overview}
                        </p>
                    </div>

                    {/* Top Cast */}
                    {movie.credits?.cast && movie.credits.cast.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-serif text-white flex items-center gap-3">
                                    <span className="w-2 h-8 bg-accent-purple block rounded-full"></span>
                                    Top Cast
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {movie.credits.cast.slice(0, 6).map((actor: any) => (
                                    <div key={actor.id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden flex items-center gap-4 p-3 pr-4 group hover:bg-white/10 transition-colors">
                                        <img
                                            src={getImageUrl(actor.profile_path, 'w500')}
                                            alt={actor.name}
                                            className="w-16 h-16 object-cover rounded-full"
                                        />
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="text-white font-bold text-sm truncate">{actor.name}</span>
                                            <span className="text-slate-400 text-xs truncate">{actor.character}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8 bg-white/[0.02] border border-white/5 rounded-3xl p-8 h-fit">
                    <h3 className="text-xl font-serif text-white pb-6 border-b border-white/10">Information</h3>

                    <div className="space-y-6">
                        <div>
                            <p className="text-slate-500 text-sm mb-1">Status</p>
                            <p className="text-white font-medium">{movie.status}</p>
                        </div>

                        <div>
                            <p className="text-slate-500 text-sm mb-1">Original Language</p>
                            <p className="text-white font-medium uppercase tracking-widest">{movie.original_language}</p>
                        </div>

                        <div>
                            <p className="text-slate-500 text-sm mb-1">Budget</p>
                            <p className="text-white font-medium">{movie.budget > 0 ? formatCurrency(movie.budget) : 'Unknown'}</p>
                        </div>

                        <div>
                            <p className="text-slate-500 text-sm mb-1">Revenue</p>
                            <p className="text-white font-medium">{movie.revenue > 0 ? formatCurrency(movie.revenue) : 'Unknown'}</p>
                        </div>

                        {movie.production_companies && movie.production_companies.length > 0 && (
                            <div>
                                <p className="text-slate-500 text-sm mb-2">Production</p>
                                <div className="flex flex-col gap-2">
                                    {movie.production_companies.slice(0, 3).map((company: any) => (
                                        <span key={company.id} className="text-sm text-slate-300">{company.name}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </section>
        </div>
    );
}
