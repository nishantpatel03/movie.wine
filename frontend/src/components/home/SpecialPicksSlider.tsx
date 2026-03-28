'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { createSlug } from '@/lib/api';
import { Sparkles } from 'lucide-react';

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

function MediaCard({ item }: { item: MediaItem }) {
    const mediaType = item.title ? 'movie' : 'tv';
    const title = item.title || item.name || '';
    const href = `/${mediaType === 'tv' ? 'series' : 'movies'}/${createSlug(item.id, title)}`;
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
                width: 160,
            }}
        >
            <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="group" style={{
                    position: 'relative',
                    aspectRatio: '2/3',
                    borderRadius: 16,
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

                <div style={{ marginTop: 12, textAlign: 'center' }}>
                    <p style={{
                        color: '#fff',
                        fontSize: '13px',
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
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: 4, fontWeight: 600 }}>
                            {year}
                        </p>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}

export default function SpecialPicksSlider({
    items,
    label = "Specially For You",
    duration = 40
}: {
    items: MediaItem[];
    label?: string;
    duration?: number;
}) {
    if (!items.length) return null;

    const doubled = [...items, ...items];

    return (
        <section style={{ padding: '48px 0 64px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                {/* Section header */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 48 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <Sparkles className="w-5 h-5 text-primary" />
                        <p style={{ color: '#f4c025', fontSize: '10px', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                            Curated Selection
                        </p>
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#fff', fontWeight: 700, lineHeight: 1.2, fontStyle: 'italic' }}>
                        {label}
                    </h2>
                    <div style={{ width: 60, height: 3, background: 'linear-gradient(to right, transparent, #f4c025, transparent)', marginTop: 20, borderRadius: 2 }} />
                </div>

                {/* Marquee wrapper */}
                <div style={{ position: 'relative' }}>
                    {/* Edge fade left */}
                    <div style={{
                        position: 'absolute', left: -2, top: 0, bottom: 0, width: 120,
                        background: 'linear-gradient(to right, #0a0904, transparent)',
                        zIndex: 10, pointerEvents: 'none',
                    }} />
                    {/* Edge fade right */}
                    <div style={{
                        position: 'absolute', right: -2, top: 0, bottom: 0, width: 120,
                        background: 'linear-gradient(to left, #0a0904, transparent)',
                        zIndex: 10, pointerEvents: 'none',
                    }} />

                    {/* Scrolling track */}
                    <div
                        className="marquee-track"
                        style={{
                            display: 'flex',
                            gap: 32,
                            paddingBottom: 24,
                            animation: `marquee-scroll ${duration}s linear infinite`,
                            width: 'max-content',
                        }}
                    >
                        {doubled.map((item, i) => (
                            <MediaCard
                                key={`${item.id}-${i}`}
                                item={item}
                            />
                        ))}
                    </div>
                </div>
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
