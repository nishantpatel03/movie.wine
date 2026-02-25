'use client';

import { Play, Info } from 'lucide-react';
import styles from './HeroBanner.module.css';

interface HeroBannerProps {
    title: string;
    description: string;
    imageUrl: string;
    tags?: string[];
}

export default function HeroBanner({ title, description, imageUrl, tags }: HeroBannerProps) {
    return (
        <div className={styles.hero} style={{ backgroundImage: `url(${imageUrl})` }}>
            <div className={styles.overlay}>
                <div className={styles.content}>
                    {tags && (
                        <div className={styles.tags}>
                            {tags.map((tag, idx) => (
                                <span key={idx} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                    )}
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.description}>{description}</p>
                    <div className={styles.actions}>
                        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Play fill="currentColor" size={20} /> Watch Now
                        </button>
                        <button className={styles.btnSecondary}>
                            <Info size={20} /> More Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
