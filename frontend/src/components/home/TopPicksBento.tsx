'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } }
};

const item = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } }
};

function PosterCard({ movie, large = false }: { movie: any; large?: boolean }) {
    const imgSrc = large
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : `https://image.tmdb.org/t/p/w342${movie.poster_path || movie.backdrop_path}`;
    const href = `/${movie.media_type === 'tv' ? 'series' : 'movies'}/${movie.id}`;
    const rating = movie.vote_average?.toFixed(1);
    const title = movie.title || movie.name;

    return (
        <motion.div variants={item} className="group relative" style={{ borderRadius: 16, overflow: 'hidden', height: '100%' }}>
            <Link href={href} style={{ display: 'block', height: '100%' }}>
                <div style={{
                    position: 'relative',
                    height: '100%',
                    background: '#16140b',
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                }}>
                    <img
                        src={imgSrc}
                        alt={title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', display: 'block' }}
                        className="group-hover:scale-105"
                    />

                    {/* Gradient overlay — always present */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(10,9,4,0.95) 0%, rgba(10,9,4,0.2) 45%, transparent 70%)',
                    }} />

                    {/* Play button on hover */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        background: 'rgba(10,9,4,0.3)',
                    }} className="group-hover:opacity-100">
                        <div style={{
                            width: 54,
                            height: 54,
                            borderRadius: '50%',
                            background: '#f4c025',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 30px rgba(244,192,37,0.5)',
                        }}>
                            <span className="material-symbols-outlined fill-1" style={{ fontSize: 28, color: '#0a0904', marginLeft: 3 }}>play_arrow</span>
                        </div>
                    </div>

                    {/* Bottom info */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: large ? '20px 18px' : '14px 14px' }}>
                        {rating && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                                <span className="material-symbols-outlined fill-1" style={{ fontSize: 12, color: '#f4c025' }}>star</span>
                                <span style={{ color: '#f4c025', fontSize: '11px', fontWeight: 900 }}>{rating}</span>
                            </div>
                        )}
                        <h3 style={{
                            color: '#fff',
                            fontFamily: "'Playfair Display', serif",
                            fontSize: large ? '1.5rem' : '0.88rem',
                            fontWeight: 700,
                            lineHeight: 1.2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}>
                            {title}
                        </h3>
                        {large && movie.overview && (
                            <p style={{
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '0.78rem',
                                lineHeight: 1.6,
                                marginTop: 8,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}>
                                {movie.overview}
                            </p>
                        )}
                        {large && (
                            <div style={{
                                marginTop: 14,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                background: '#f4c025',
                                color: '#0a0904',
                                padding: '8px 16px',
                                borderRadius: 9,
                                fontSize: '10px',
                                fontWeight: 900,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                            }}>
                                <span className="material-symbols-outlined fill-1" style={{ fontSize: 15 }}>play_arrow</span>
                                Watch Now
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export function TopPicksBento({ topPicks }: { topPicks: any[] }) {
    if (!topPicks || topPicks.length === 0) return null;

    const featured = topPicks[0];
    // Always take exactly 8 secondary cards so rows are always full (2 rows of 4 cols minus 1 col = 3 cols × 2 rows + 2 = 8)
    // Grid: 4 cols. Col 1 spans 2 rows (featured). Remaining 3 cols × 2 rows = 6 slots. Take 6.
    const secondary = topPicks.slice(1, 7); // exactly 6 secondary (fills 3 cols × 2 rows)

    return (
        <section style={{ padding: '80px 0', position: 'relative' }}>
            <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '60%', height: '1px',
                background: 'linear-gradient(to right, transparent, rgba(244,192,37,0.2), transparent)',
            }} />

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}
                >
                    <div>
                        <p style={{ color: '#f4c025', fontSize: '10px', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 8 }}>
                            Curated For You
                        </p>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', fontWeight: 700, lineHeight: 1 }}>
                            Top Picks
                        </h2>
                    </div>
                    <Link href="/movies" style={{
                        color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontWeight: 900,
                        letterSpacing: '0.25em', textTransform: 'uppercase',
                        display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none',
                    }} className="hover:text-primary">
                        Explore All
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                    </Link>
                </motion.div>

                {/* 
                  Grid layout: 4 cols × 2 rows
                  - Col 1, rows 1-2: featured poster (tall)
                  - Cols 2-4, row 1: 3 cards
                  - Cols 2-4, row 2: 3 cards
                */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gridTemplateRows: 'repeat(2, 300px)',
                        gap: 16,
                    }}
                >
                    {/* Featured — col 1, spans rows 1-2 */}
                    <div style={{ gridColumn: '1', gridRow: '1 / 3', height: '100%' }}>
                        <PosterCard movie={featured} large />
                    </div>

                    {/* Row 1: cols 2, 3, 4 */}
                    {secondary.slice(0, 3).map((m, i) => (
                        <div key={m.id} style={{ gridColumn: `${i + 2}`, gridRow: '1', height: '300px', overflow: 'hidden' }}>
                            <PosterCard movie={m} />
                        </div>
                    ))}

                    {/* Row 2: cols 2, 3, 4 */}
                    {secondary.slice(3, 6).map((m, i) => (
                        <div key={m.id} style={{ gridColumn: `${i + 2}`, gridRow: '2', height: '300px', overflow: 'hidden' }}>
                            <PosterCard movie={m} />
                        </div>
                    ))}
                </motion.div>
            </div>

            <div style={{
                position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                width: '60%', height: '1px',
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)',
            }} />
        </section>
    );
}

