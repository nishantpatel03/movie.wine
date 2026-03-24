"use client";

import { getImageUrl, createSlug } from '@/lib/api';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SeasonListProps {
    tvId: number;
    seriesName: string;
    seasons: any[];
}

export function SeasonList({ tvId, seriesName, seasons }: SeasonListProps) {
    const validSeasons = seasons.filter(s => s.season_number > 0);
    const slug = createSlug(tvId, seriesName);

    return (
        <div className="space-y-4">
            <h2 className="text-[18px] font-bold tracking-tight text-white mb-6">Seasons & Episodes</h2>
            <div className="flex flex-col gap-3">
                {validSeasons.map((season) => (
                    <Link 
                        key={season.id} 
                        href={`/series/${slug}/season/${season.season_number}`}
                        className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors p-4 flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            {season.poster_path ? (
                                <Image
                                    src={getImageUrl(season.poster_path, 'w500')}
                                    alt={season.name}
                                    width={48}
                                    height={64}
                                    className="w-12 h-16 object-cover rounded-md shadow-md border border-white/5"
                                />
                            ) : (
                                <div className="w-12 h-16 bg-white/10 rounded-md flex flex-shrink-0 items-center justify-center text-xs text-slate-500">
                                    No Img
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors leading-tight">{season.name}</h3>
                                <div className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                                    <span>{season.episode_count} Episodes</span>
                                    {season.air_date && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                                            <span>{season.air_date.substring(0, 4)}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="text-white/20 group-hover:text-primary transition-colors pr-2">
                            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
