'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import styles from './MediaCarousel.module.css';

interface MediaItem {
    id: string;
    title: string;
    posterUrl: string;
    rating: number;
    year: number;
}

interface MediaCarouselProps {
    title: string;
    items: MediaItem[];
}

export default function MediaCarousel({ title, items }: MediaCarouselProps) {
    const rowRef = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: 'left' | 'right') => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.carouselContainer}>
            <h2 className={styles.carouselTitle}>{title}</h2>
            <div className={styles.controls}>
                <button className={styles.controlBtn} onClick={() => handleScroll('left')}>
                    <ChevronLeft size={24} />
                </button>
                <button className={styles.controlBtn} onClick={() => handleScroll('right')}>
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className={styles.row} ref={rowRef}>
                {items.map((item) => (
                    <div key={item.id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <div
                                className={styles.poster}
                                style={{ backgroundImage: `url(${item.posterUrl})` }}
                            />
                            <div className={styles.overlay}>
                                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                                    View Details
                                </button>
                            </div>
                        </div>
                        <div className={styles.metadata}>
                            <h3 className={styles.itemTitle}>{item.title}</h3>
                            <div className={styles.itemStats}>
                                <span className={styles.year}>{item.year}</span>
                                <span className={styles.rating}>
                                    <Star size={12} fill="var(--primary)" color="var(--primary)" /> {item.rating.toFixed(1)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
