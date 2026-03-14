'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const SLIDE_INTERVAL = 4000; // ms between auto-advance

const slideVariants = {
    enter: (dir: number) => ({
        x: dir > 0 ? '5%' : '-5%',
        opacity: 0,
        scale: 1.04,
    }),
    center: {
        x: '0%',
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: (dir: number) => ({
        x: dir > 0 ? '-5%' : '5%',
        opacity: 0,
        scale: 0.97,
        transition: { duration: 0.5, ease: 'easeIn' },
    }),
};

const contentVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }
    }),
};

export function HomeHeroSection({ slides }: { slides: any[] }) {
    const [index, setIndex] = useState(0);
    const [dir, setDir] = useState(1);
    const [paused, setPaused] = useState(false);

    const goTo = useCallback((next: number, direction: number) => {
        setDir(direction);
        setIndex(next);
    }, []);

    const prev = () => {
        const next = (index - 1 + slides.length) % slides.length;
        goTo(next, -1);
    };

    const next = () => {
        const next = (index + 1) % slides.length;
        goTo(next, 1);
    };

    useEffect(() => {
        if (paused || slides.length <= 1) return;
        const timer = setInterval(() => {
            setDir(1);
            setIndex(i => (i + 1) % slides.length);
        }, SLIDE_INTERVAL);
        return () => clearInterval(timer);
    }, [paused, slides.length]);

    if (!slides || slides.length === 0) return null;

    const movie = slides[index];
    const backdropUrl = movie?.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop';

    const title = movie?.title || movie?.name || 'Cinematic Excellence';
    const overview = movie?.overview || '';
    const year = (movie?.release_date || movie?.first_air_date || '').substring(0, 4);
    const rating = movie?.vote_average?.toFixed(1);
    const mediaType = movie?.media_type === 'tv' ? 'tv-shows' : 'movies';
    const mediaLabel = movie?.media_type === 'tv' ? 'TV Series' : 'Film';
    const href = movie ? `/${mediaType}/${movie.id}` : '/movies';

    return (
        <section
            className="relative w-full overflow-hidden"
            style={{ height: '100svh', minHeight: 700 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* ── Backdrop slideshow ── */}
            <AnimatePresence custom={dir} initial={false}>
                <motion.div
                    key={`bg-${index}`}
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                    style={{ willChange: 'transform, opacity' }}
                >
                    <img
                        src={backdropUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center 20%' }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* ── Film grain ── */}
            <div className="absolute inset-0 pointer-events-none z-[1]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                backgroundSize: '200px 200px',
                opacity: 0.35,
            }} />

            {/* ── Gradients ── */}
            <div className="absolute inset-0 z-[2]" style={{ background: 'linear-gradient(to top, #0a0904 0%, rgba(10,9,4,0.55) 45%, transparent 80%)' }} />
            <div className="absolute inset-0 z-[2]" style={{ background: 'linear-gradient(to right, #0a0904 0%, rgba(10,9,4,0.45) 55%, transparent 100%)' }} />

            {/* ── Content ── */}
            <div className="relative z-[10] h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-end pb-24 lg:pb-32">
                <AnimatePresence mode="wait">
                    <motion.div key={`content-${index}`} className="max-w-2xl space-y-6">

                        {/* Meta pills */}
                        <motion.div
                            custom={0.05}
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex items-center gap-3 flex-wrap"
                        >
                            <span style={{
                                background: '#f4c025', color: '#0a0904',
                                fontSize: '9px', fontWeight: 900, letterSpacing: '0.22em',
                                padding: '5px 12px', borderRadius: '99px', textTransform: 'uppercase',
                                boxShadow: '0 0 18px rgba(244,192,37,0.45)',
                            }}>
                                Trending Now
                            </span>
                            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                                {year && <span>{year}</span>}
                                {year && <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'inline-block' }} />}
                                <span>{mediaLabel}</span>
                                {rating && <>
                                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f4c025' }}>
                                        <span className="material-symbols-outlined fill-1" style={{ fontSize: 13 }}>star</span>
                                        {rating}
                                    </span>
                                </>}
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            custom={0.2}
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)',
                                fontWeight: 700,
                                lineHeight: 0.92,
                                letterSpacing: '-0.02em',
                                color: '#fff',
                                textShadow: '0 8px 40px rgba(0,0,0,0.6)',
                            }}
                        >
                            {title}
                        </motion.h1>

                        {/* Overview */}
                        <motion.p
                            custom={0.35}
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            style={{
                                color: 'rgba(255,255,255,0.62)',
                                fontSize: '0.97rem',
                                lineHeight: 1.75,
                                maxWidth: 460,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            {overview}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            custom={0.5}
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex items-center gap-4"
                        >
                            <Link href={href}>
                                <motion.button
                                    whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(244,192,37,0.55)' }}
                                    whileTap={{ scale: 0.96 }}
                                    style={{
                                        background: '#f4c025', color: '#0a0904',
                                        padding: '13px 28px', borderRadius: '12px',
                                        fontWeight: 900, fontSize: '11px', letterSpacing: '0.18em',
                                        textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8,
                                        border: 'none', cursor: 'pointer',
                                        boxShadow: '0 0 24px rgba(244,192,37,0.2)',
                                    }}
                                >
                                    <span className="material-symbols-outlined fill-1" style={{ fontSize: 18 }}>play_arrow</span>
                                    Watch Now
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.15)' }}
                                whileTap={{ scale: 0.96 }}
                                style={{
                                    background: 'rgba(255,255,255,0.08)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    color: '#fff', padding: '13px 24px',
                                    borderRadius: '12px', fontWeight: 900,
                                    fontSize: '11px', letterSpacing: '0.18em',
                                    textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8,
                                    border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>bookmark_add</span>
                                My List
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Prev / Next arrows ── */}
            {slides.length > 1 && (
                <>
                    {[{ dir: 'prev', icon: 'chevron_left', action: prev }, { dir: 'next', icon: 'chevron_right', action: next }].map(btn => (
                        <button
                            key={btn.dir}
                            onClick={btn.action}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                [btn.dir === 'prev' ? 'left' : 'right']: 24,
                                zIndex: 20,
                                width: 44,
                                height: 44,
                                borderRadius: '50%',
                                background: 'rgba(10,9,4,0.55)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background 0.2s, border-color 0.2s',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,192,37,0.25)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(244,192,37,0.5)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(10,9,4,0.55)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{btn.icon}</span>
                        </button>
                    ))}
                </>
            )}

            {/* ── Dot indicators + thumbnail strip ── */}
            {slides.length > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: 28,
                    right: 32,
                    zIndex: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 10,
                }}>
                    {/* Thumbnail strip */}
                    <div style={{ display: 'flex', gap: 8 }} className="hidden lg:flex">
                        {slides.slice(0, 8).map((s, i) => (
                            <button
                                key={s.id}
                                onClick={() => goTo(i, i > index ? 1 : -1)}
                                style={{
                                    width: 52,
                                    height: 34,
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                    border: i === index ? '2px solid #f4c025' : '2px solid rgba(255,255,255,0.15)',
                                    opacity: i === index ? 1 : 0.5,
                                    cursor: 'pointer',
                                    padding: 0,
                                    transition: 'border-color 0.3s, opacity 0.3s',
                                    flexShrink: 0,
                                    background: 'transparent',
                                }}
                            >
                                {s.backdrop_path && (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w92${s.backdrop_path}`}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Progress dots */}
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {slides.slice(0, 8).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i, i > index ? 1 : -1)}
                                style={{
                                    width: i === index ? 22 : 6,
                                    height: 6,
                                    borderRadius: 99,
                                    background: i === index ? '#f4c025' : 'rgba(255,255,255,0.25)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    transition: 'width 0.35s ease, background 0.35s ease',
                                }}
                            />
                        ))}
                    </div>

                    {/* Progress bar */}
                    <div style={{ width: 80, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                        <motion.div
                            key={`bar-${index}`}
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: SLIDE_INTERVAL / 1000, ease: 'linear' }}
                            style={{ height: '100%', background: '#f4c025', borderRadius: 2 }}
                        />
                    </div>
                </div>
            )}

            {/* ── Counter ── */}
            {slides.length > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: 86,
                    right: 32,
                    zIndex: 20,
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: '10px',
                    fontWeight: 900,
                    letterSpacing: '0.2em',
                }}>
                    <span style={{ color: '#f4c025' }}>{String(index + 1).padStart(2, '0')}</span>
                    {' / '}
                    {String(Math.min(slides.length, 8)).padStart(2, '0')}
                </div>
            )}

            {/* ── Bottom fade ── */}
            <div className="absolute bottom-0 left-0 w-full z-[5]" style={{ height: 200, background: 'linear-gradient(to top, #0a0904, transparent)' }} />
        </section>
    );
}
