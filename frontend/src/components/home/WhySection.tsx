'use client';

import { motion } from 'framer-motion';

const features = [
    {
        icon: 'auto_awesome',
        title: 'Smart Discovery',
        desc: 'Our AI dissects your mood, genre preferences, and viewing history to surface films you\'ll actually love — not just what\'s popular.',
        accent: '#f4c025',
        glow: 'rgba(244,192,37,0.15)',
    },
    {
        icon: 'wine_bar',
        title: 'Curated Taste',
        desc: 'Like a fine sommelier, MovieWine pairs each viewer with precisely the right cinematic experience. No noise. No filler.',
        accent: '#9d4edd',
        glow: 'rgba(157,78,221,0.15)',
    },
    {
        icon: 'groups',
        title: 'Community Pulse',
        desc: 'Real opinions from real cinephiles. Deep-dive discussions, sentiment analysis, and crowd ratings that actually matter.',
        accent: '#2dd4bf',
        glow: 'rgba(45,212,191,0.15)',
    },
];

const cardVariant = {
    hidden: { opacity: 0, y: 36 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] as any }
    })
};

export default function WhySection() {
    return (
        <section style={{
            position: 'relative',
            padding: '100px 24px',
            overflow: 'hidden',
        }}>
            {/* Background texture */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(244,192,37,0.04) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '1px',
                background: 'linear-gradient(to right, transparent, rgba(244,192,37,0.2), transparent)',
            }} />

            <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: 72 }}
                >
                    <p style={{
                        color: '#f4c025',
                        fontSize: '10px',
                        fontWeight: 900,
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        marginBottom: 16,
                    }}>
                        Why MovieWine
                    </p>
                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                        fontWeight: 700,
                        color: '#fff',
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        maxWidth: 540,
                        margin: '0 auto',
                    }}>
                        Cinema deserves more than&nbsp;
                        <span style={{ color: '#f4c025', fontStyle: 'italic' }}>an algorithm.</span>
                    </h2>
                    <p style={{
                        color: 'rgba(255,255,255,0.45)',
                        fontSize: '1rem',
                        lineHeight: 1.75,
                        maxWidth: 500,
                        margin: '20px auto 0',
                        fontWeight: 400,
                    }}>
                        We combine AI precision with human editorial instinct to give you a streaming experience that feels personal.
                    </p>
                </motion.div>

                {/* Feature Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 20,
                }}>
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            custom={i}
                            variants={cardVariant}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            whileHover={{ y: -6, transition: { duration: 0.3 } }}
                            style={{
                                position: 'relative',
                                background: 'rgba(22,20,11,0.7)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: 24,
                                padding: '40px 36px',
                                overflow: 'hidden',
                                cursor: 'default',
                            }}
                        >
                            {/* Glow corner */}
                            <div style={{
                                position: 'absolute',
                                top: -40,
                                right: -40,
                                width: 160,
                                height: 160,
                                borderRadius: '50%',
                                background: f.glow,
                                filter: 'blur(40px)',
                                pointerEvents: 'none',
                            }} />

                            {/* Icon */}
                            <div style={{
                                width: 56,
                                height: 56,
                                borderRadius: 16,
                                background: `${f.glow}`,
                                border: `1px solid ${f.accent}30`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 28,
                            }}>
                                <span
                                    className="material-symbols-outlined fill-1"
                                    style={{ fontSize: 26, color: f.accent }}
                                >
                                    {f.icon}
                                </span>
                            </div>

                            {/* Accent line */}
                            <div style={{
                                width: 32,
                                height: 2,
                                borderRadius: 2,
                                background: f.accent,
                                marginBottom: 20,
                                opacity: 0.7,
                            }} />

                            <h3 style={{
                                color: '#fff',
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '1.35rem',
                                fontWeight: 700,
                                marginBottom: 14,
                                lineHeight: 1.2,
                            }}>
                                {f.title}
                            </h3>
                            <p style={{
                                color: 'rgba(255,255,255,0.45)',
                                fontSize: '0.88rem',
                                lineHeight: 1.75,
                                fontWeight: 400,
                            }}>
                                {f.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    style={{ textAlign: 'center', marginTop: 64 }}
                >
                    <a href="/movies" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 10,
                        background: '#f4c025',
                        color: '#0a0904',
                        padding: '15px 36px',
                        borderRadius: 14,
                        fontWeight: 900,
                        fontSize: '12px',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        boxShadow: '0 0 32px rgba(244,192,37,0.2)',
                        transition: 'box-shadow 0.3s, transform 0.2s',
                    }}>
                        Start Exploring
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                    </a>
                </motion.div>
            </div>

            {/* Bottom divider */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '1px',
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)',
            }} />
        </section>
    );
}
