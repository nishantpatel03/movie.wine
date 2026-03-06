import { HomeNavBar } from '@/components/home/HomeNavBar';
import { getMovieDetails, getImageUrl } from '@/lib/api';
import { MovieTrailerModal } from '@/components/movies/MovieTrailerModal';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Star, TrendingUp } from 'lucide-react';

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

    // Format money
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-background-dark text-slate-100 font-display pb-20">
            <HomeNavBar />

            {/* OTT Style Hero Backdrop Section */}
            <section className="relative w-full h-[85vh] lg:h-screen overflow-hidden flex items-center pt-24 pb-12">
                {/* Background Image & Strong Overlays */}
                <div className="absolute inset-0 z-0 bg-black">
                    <img
                        src={backdropUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover opacity-60 block"
                    />
                    {/* Gradients for text readability exactly like Netflix/Max */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent"></div>
                    <div className="absolute inset-0 w-full lg:w-3/4 bg-gradient-to-r from-background-dark via-background-dark/80 to-transparent"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-6 lg:gap-8 lg:w-2/3">
                    {/* Back button */}
                    <Link href="/movies" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase mb-2 w-fit group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
                    </Link>

                    <div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-none drop-shadow-2xl font-bold tracking-tight">
                            {movie.title}
                        </h1>
                        {movie.tagline && (
                            <p className="text-xl md:text-2xl text-primary font-medium mt-4 drop-shadow-lg italic">
                                {movie.tagline}
                            </p>
                        )}
                    </div>

                    {/* Quick Stats Row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-slate-200 font-semibold drop-shadow-md">
                        <div className="flex items-center gap-1.5 text-primary">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="text-white text-lg">{movie.vote_average?.toFixed(1) || '0.0'}</span>
                            <span className="text-sm font-normal text-slate-400">({movie.vote_count?.toLocaleString() || 0} reviews)</span>
                        </div>

                        <span className="w-1.5 h-1.5 rounded-full bg-white/30 hidden sm:block"></span>

                        <div className="flex items-center gap-1">
                            <span>{movie.release_date?.substring(0, 4)}</span>
                        </div>

                        {movie.runtime > 0 && (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-white/30 hidden sm:block"></span>
                                <div className="flex items-center gap-1">
                                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                                </div>
                            </>
                        )}

                        <span className="w-1.5 h-1.5 rounded-full bg-white/30 hidden sm:block"></span>

                        <div className="flex items-center gap-1 text-slate-300 border border-white/20 px-2 py-0.5 rounded text-xs bg-white/5">
                            {movie.status}
                        </div>
                    </div>

                    {/* Short Overview snippet */}
                    <p className="text-lg text-slate-300 leading-relaxed max-w-2xl drop-shadow-md line-clamp-3 md:line-clamp-4">
                        {movie.overview}
                    </p>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {movie.genres?.map((g: any) => (
                            <span key={g.id} className="text-sm font-medium text-slate-300 drop-shadow-sm flex items-center pr-2 after:content-['•'] after:ml-2 after:text-white/20 last:after:hidden">
                                {g.name}
                            </span>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 pt-6">
                        <MovieTrailerModal videoKey={videoKey} isHero={true} />

                        <button className="flex items-center gap-2 px-8 py-3 lg:px-10 lg:py-4 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-xl font-bold transition-all shadow-lg">
                            <span className="material-symbols-outlined">add</span>
                            MY LIST
                        </button>
                    </div>
                </div>
            </section>

            {/* Content Details Below the Hero */}
            <section className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 mt-12 lg:-mt-10 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">

                {/* Main Column */}
                <div className="lg:col-span-2 space-y-16">
                    {/* Overview */}
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-6">
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
                                <h2 className="text-2xl font-bold tracking-tight text-white">
                                    Top Cast
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {movie.credits.cast.slice(0, 6).map((actor: any) => (
                                    <Link href={`/person/${actor.id}`} key={actor.id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden flex items-center gap-4 p-3 pr-4 group hover:bg-white/10 transition-colors">
                                        <img
                                            src={getImageUrl(actor.profile_path, 'w500')}
                                            alt={actor.name}
                                            className="w-16 h-16 object-cover rounded-full"
                                        />
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="text-white font-bold text-sm truncate group-hover:text-primary transition-colors">{actor.name}</span>
                                            <span className="text-slate-400 text-xs truncate">{actor.character}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8 h-fit">
                    <h3 className="text-xl font-bold tracking-tight text-white pb-6 border-b border-white/10">Information</h3>

                    <div className="space-y-6">
                        <div>
                            <p className="text-slate-400 text-sm mb-1">Status</p>
                            <p className="text-white font-medium text-lg">{movie.status}</p>
                        </div>

                        <div>
                            <p className="text-slate-400 text-sm mb-1">Original Language</p>
                            <p className="text-white font-medium text-lg uppercase tracking-widest">{movie.original_language}</p>
                        </div>

                        <div>
                            <p className="text-slate-400 text-sm mb-1">Budget</p>
                            <p className="text-white font-medium text-lg">{movie.budget > 0 ? formatCurrency(movie.budget) : 'Unknown'}</p>
                        </div>

                        <div>
                            <p className="text-slate-400 text-sm mb-1">Revenue</p>
                            <p className="text-white font-medium text-lg">{movie.revenue > 0 ? formatCurrency(movie.revenue) : 'Unknown'}</p>
                        </div>

                        {movie.production_companies && movie.production_companies.length > 0 && (
                            <div>
                                <p className="text-slate-400 text-sm mb-2">Production</p>
                                <div className="flex flex-col gap-2">
                                    {movie.production_companies.slice(0, 3).map((company: any) => (
                                        <span key={company.id} className="text-sm font-medium text-slate-300">{company.name}</span>
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
