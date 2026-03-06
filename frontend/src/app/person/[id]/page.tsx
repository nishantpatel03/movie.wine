import { getPersonDetails, getImageUrl } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HomeNavBar } from '@/components/home/HomeNavBar';

export default async function PersonDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    let person;

    try {
        person = await getPersonDetails(Number(id));
    } catch (error) {
        return notFound();
    }

    if (!person) {
        return notFound();
    }

    const credits = person.combined_credits?.cast || [];

    // Sort credits by popularity or release date
    credits.sort((a: any, b: any) => {
        const dateA = new Date(b.release_date || b.first_air_date || 0).getTime();
        const dateB = new Date(a.release_date || a.first_air_date || 0).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return b.vote_count - a.vote_count;
    });

    const knownFor = credits.filter((c: any) => c.poster_path).slice(0, 20);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-900 selection:text-white">
            <HomeNavBar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    {/* Sidebar / Profile Info */}
                    <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                        <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 mb-8">
                            <Image
                                src={getImageUrl(person.profile_path, 'w500')}
                                alt={person.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 33vw"
                                priority
                            />
                        </div>
                        <h2 className="text-xl font-semibold mb-4 text-white/90">Personal Info</h2>
                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="block text-white/50 mb-1">Known For</span>
                                <span className="text-white/90">{person.known_for_department}</span>
                            </div>
                            <div>
                                <span className="block text-white/50 mb-1">Gender</span>
                                <span className="text-white/90">{person.gender === 1 ? 'Female' : person.gender === 2 ? 'Male' : 'Not specified'}</span>
                            </div>
                            {person.birthday && (
                                <div>
                                    <span className="block text-white/50 mb-1">Birthdate</span>
                                    <span className="text-white/90">{person.birthday}</span>
                                </div>
                            )}
                            {person.place_of_birth && (
                                <div>
                                    <span className="block text-white/50 mb-1">Place of Birth</span>
                                    <span className="text-white/90">{person.place_of_birth}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-2/3 lg:w-3/4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-8 font-serif">{person.name}</h1>

                        {person.biography && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-semibold mb-4 text-white/90">Biography</h2>
                                <div className="text-white/70 leading-relaxed space-y-4">
                                    {/* Splitting biography into paragraphs for better readability */}
                                    {person.biography.split('\n\n').map((para: string, idx: number) => (
                                        <p key={idx}>{para}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h2 className="text-2xl font-semibold mb-6 text-white/90">Known For</h2>
                            {knownFor.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {knownFor.map((item: any) => {
                                        const type = item.media_type === 'tv' ? 'tv-shows' : 'movies';
                                        const title = item.title || item.name;
                                        return (
                                            <Link href={`/${type}/${item.id}`} key={`${item.media_type}-${item.id}`} className="group relative">
                                                <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105 group-hover:ring-white/30">
                                                    <Image
                                                        src={getImageUrl(item.poster_path, 'w500')}
                                                        alt={title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                                                    />
                                                </div>
                                                <div className="mt-2 text-sm text-center font-medium text-white/80 group-hover:text-white line-clamp-1 transition-colors">
                                                    {title}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-white/50">No credited works found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
