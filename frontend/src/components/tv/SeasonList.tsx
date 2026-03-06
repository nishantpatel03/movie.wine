"use client";

import { useState } from 'react';
import { getTVSeasonDetails, getImageUrl } from '@/lib/api';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

interface SeasonListProps {
    tvId: number;
    seasons: any[];
}

export function SeasonList({ tvId, seasons }: SeasonListProps) {
    const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
    const [seasonData, setSeasonData] = useState<Record<number, any>>({});
    const [loading, setLoading] = useState<Record<number, boolean>>({});

    const toggleSeason = async (seasonNumber: number) => {
        if (expandedSeason === seasonNumber) {
            setExpandedSeason(null);
            return;
        }

        setExpandedSeason(seasonNumber);

        if (!seasonData[seasonNumber]) {
            setLoading(prev => ({ ...prev, [seasonNumber]: true }));
            try {
                const data = await getTVSeasonDetails(tvId, seasonNumber);
                setSeasonData(prev => ({ ...prev, [seasonNumber]: data }));
            } catch (error) {
                console.error("Failed to fetch season details", error);
            } finally {
                setLoading(prev => ({ ...prev, [seasonNumber]: false }));
            }
        }
    };

    // Filter out Season 0 (usually specials) if desired, or keep it.
    const validSeasons = seasons.filter(s => s.season_number > 0);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-6">Seasons & Episodes</h2>
            {validSeasons.map((season) => (
                <div key={season.id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                    <button
                        onClick={() => toggleSeason(season.season_number)}
                        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
                    >
                        <div className="flex items-center gap-4">
                            {season.poster_path ? (
                                <Image
                                    src={getImageUrl(season.poster_path, 'w500')}
                                    alt={season.name}
                                    width={48}
                                    height={64}
                                    className="w-12 h-16 object-cover rounded-md"
                                />
                            ) : (
                                <div className="w-12 h-16 bg-white/10 rounded-md flex flex-shrink-0 items-center justify-center text-xs text-slate-500">
                                    No Img
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-bold text-white leading-tight">{season.name}</h3>
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
                        <div className="text-slate-400 pr-2">
                            {expandedSeason === season.season_number ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                    </button>

                    {expandedSeason === season.season_number && (
                        <div className="p-4 border-t border-white/5 bg-black/20">
                            {loading[season.season_number] ? (
                                <div className="text-slate-400 text-sm py-4 text-center animate-pulse">Loading episodes...</div>
                            ) : seasonData[season.season_number]?.episodes ? (
                                <div className="space-y-4">
                                    {seasonData[season.season_number].episodes.map((episode: any) => (
                                        <div key={episode.id} className="flex flex-col sm:flex-row gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                                            <div className="w-full sm:w-40 aspect-video flex-shrink-0 relative rounded-lg overflow-hidden bg-white/5">
                                                {episode.still_path ? (
                                                    <Image
                                                        src={getImageUrl(episode.still_path, 'w500')}
                                                        alt={episode.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 640px) 100vw, 160px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No Image</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <h4 className="text-white font-semibold text-sm sm:text-base leading-tight">
                                                        {episode.episode_number}. {episode.name}
                                                    </h4>
                                                    {episode.runtime && <span className="text-xs font-medium text-slate-400 flex-shrink-0 bg-white/5 py-0.5 px-2 rounded">{episode.runtime}m</span>}
                                                </div>
                                                <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                                                    {episode.overview || "No overview available."}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-slate-400 text-sm py-4 text-center">Failed to load episodes.</div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
