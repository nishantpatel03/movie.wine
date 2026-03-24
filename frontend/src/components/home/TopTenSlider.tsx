'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

type MediaItem = {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    media_type?: string;
};

function RankNumber({ rank }: { rank: number }) {
    return (
        <div style={{
            position: 'absolute',
            bottom: -6,
            left: -14,
            zIndex: 2,
            lineHeight: 1,
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: rank < 10 ? '6rem' : '5.2rem',
            color: 'transparent',
            WebkitTextStroke: '2px rgba(244,192,37,0.55)',
            userSelect: 'none',
            letterSpacing: '-0.04em',
        }}>
            {rank}
        </div>
    );
}

function MediaCard({ item, rank, mediaType }: { item: MediaItem; rank: number; mediaType: 'movie' | 'tv' }) {
    const href = `/${mediaType === 'tv' ? 'series' : 'movies'}/${item.id}`;
    const title = item.title || item.name || '';
    const year = (item.release_date || item.first_air_date || '').substring(0, 4);
    const rating = item.vote_average?.toFixed(1);
    const imgSrc = item.poster_path
        ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
        : null;

    return (
        <motion.div
            whileHover={{ y: -8, transition: { duration: 0.25 } }}
            style={{
                position: 'relative',
                flexShrink: 0,
                width: 150,
                paddingLeft: 28,
            }}
        >
            <RankNumber rank={rank} />

            <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="group" style={{
                    position: 'relative',
                    aspectRatio: '2/3',
                    borderRadius: 12,
                    overflow: 'hidden',
                    background: '#16140b',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}>
                    {imgSrc ? (
                        <img
                            src={imgSrc}
                            alt={title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }}
                            className="group-hover:scale-105"
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1808' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'rgba(255,255,255,0.2)' }}>movie</span>
                        </div>
                    )}

                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(10,9,4,0.9) 0%, transparent 55%)',
                    }} />

                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        background: 'rgba(10,9,4,0.25)',
                    }} className="group-hover:opacity-100">
                        <div style={{
                            width: 42,
                            height: 42,
                            borderRadius: '50%',
                            background: '#f4c025',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 24px rgba(244,192,37,0.45)',
                        }}>
                            <span className="material-symbols-outlined fill-1" style={{ fontSize: 22, color: '#0a0904', marginLeft: 2 }}>play_arrow</span>
                        </div>
                    </div>

                    <div style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'rgba(10,9,4,0.75)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(244,192,37,0.3)',
                        borderRadius: 6,
                        padding: '3px 7px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                    }}>
                        <span className="material-symbols-outlined fill-1" style={{ fontSize: 11, color: '#f4c025' }}>star</span>
                        <span style={{ color: '#f4c025', fontSize: '10px', fontWeight: 900 }}>{rating}</span>
                    </div>
                </div>

                <div style={{ marginTop: 10, paddingLeft: 2 }}>
                    <p style={{
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 700,
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}>
                        {title}
                    </p>
                    {year && (
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', marginTop: 3, fontWeight: 600 }}>
                            {year}
                        </p>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}

function SliderRow({ items, type, label, duration = 36 }: {
    items: MediaItem[];
    type: 'movie' | 'tv';
    label: string;
    duration?: number;
}) {
    const top10 = items.slice(0, 10);
    // Duplicate so the loop is seamless
    const doubled = [...top10, ...top10];

    return (
        <div style={{ marginBottom: 56 }}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, paddingLeft: 4 }}>
                <div style={{ width: 3, height: 22, borderRadius: 2, background: '#f4c025', flexShrink: 0 }} />
                <div>
                    <p style={{ color: '#f4c025', fontSize: '9px', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 2 }}>
                        Top 10
                    </p>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.45rem', color: '#fff', fontWeight: 700, lineHeight: 1 }}>
                        {label}
                    </h3>
                </div>
            </div>

            {/* Marquee wrapper */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Edge fade left */}
                <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: 80,
                    background: 'linear-gradient(to right, #0a0904, transparent)',
                    zIndex: 10, pointerEvents: 'none',
                }} />
                {/* Edge fade right */}
                <div style={{
                    position: 'absolute', right: 0, top: 0, bottom: 0, width: 80,
                    background: 'linear-gradient(to left, #0a0904, transparent)',
                    zIndex: 10, pointerEvents: 'none',
                }} />

                {/* Scrolling track */}
                <div
                    className="marquee-track"
                    style={{
                        display: 'flex',
                        gap: 24,
                        paddingBottom: 24,
                        animation: `marquee-scroll ${duration}s linear infinite`,
                        width: 'max-content',
                    }}
                >
                    {doubled.map((item, i) => (
                        <MediaCard
                            key={`${item.id}-${i}`}
                            item={item}
                            rank={(i % top10.length) + 1}
                            mediaType={type}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function TopTenSlider({
    topMovies,
    topSeries,
}: {
    topMovies: MediaItem[];
    topSeries: MediaItem[];
}) {
    if (!topMovies.length && !topSeries.length) return null;

    return (
        <section style={{ padding: '72px 0 32px', position: 'relative' }}>
            {/* Top divider */}
            <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '70%', height: '1px',
                background: 'linear-gradient(to right, transparent, rgba(244,192,37,0.18), transparent)',
            }} />

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                {topMovies.length > 0 && (
                    <SliderRow items={topMovies} type="movie" label="Movies in India" duration={34} />
                )}
                {topSeries.length > 0 && (
                    <SliderRow items={topSeries} type="tv" label="Series in India" duration={40} />
                )}
            </div>

            <style>{`
                @keyframes marquee-scroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-track:hover {
                    animation-play-state: paused !important;
                }
            `}</style>
        </section>
    );
}
