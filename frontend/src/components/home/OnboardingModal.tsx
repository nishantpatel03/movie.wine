'use client';

import React, { useState } from 'react';
import { User, updateUser } from '@/lib/api';
import styles from './OnboardingModal.module.css';

interface OnboardingModalProps {
    user: User;
    onComplete: (updatedUser: User) => void;
}

const GENRES = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 27, name: 'Horror' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Sci-Fi' },
    { id: 53, name: 'Thriller' },
];

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
];

export default function OnboardingModal({ user, onComplete }: OnboardingModalProps) {
    const [step, setStep] = useState(1);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en']);
    const [defaultFeed, setDefaultFeed] = useState('all');
    const [loading, setLoading] = useState(false);

    const toggleGenre = (id: number) => {
        setSelectedGenres(prev => 
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        );
    };
    
    const toggleLanguage = (code: string) => {
        setSelectedLanguages(prev => 
            prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]
        );
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleFinish = async () => {
        setLoading(true);
        try {
            const updated = await updateUser(user.clerk_id, {
                favourite_genres: selectedGenres.join(','),
                content_language: selectedLanguages.join(','),
                default_feed: defaultFeed
            });
            onComplete(updated);
        } catch (error) {
            console.error("Failed to update preferences:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.progress}>
                    <div className={styles.progressBar} style={{ width: `${(step / 3) * 100}%` }} />
                </div>

                {step === 1 && (
                    <div className={styles.step}>
                        <h2>What do you feel like watching?</h2>
                        <p>Select your favorite genres to personalize your feed.</p>
                        <div className={styles.genreGrid}>
                            {GENRES.map(genre => (
                                <button 
                                    key={genre.id}
                                    className={`${styles.genreBtn} ${selectedGenres.includes(genre.id) ? styles.active : ''}`}
                                    onClick={() => toggleGenre(genre.id)}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>
                        <div className={styles.actions}>
                            <button 
                                className={styles.primaryBtn} 
                                onClick={handleNext}
                                disabled={selectedGenres.length === 0}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.step}>
                        <h2>Preferred Language?</h2>
                        <p>Choose the language you prefer for movies and series.</p>
                        <div className={styles.languageList}>
                            {LANGUAGES.map(lang => (
                                <button 
                                    key={lang.code}
                                    className={`${styles.langBtn} ${selectedLanguages.includes(lang.code) ? styles.active : ''}`}
                                    onClick={() => toggleLanguage(lang.code)}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.secondaryBtn} onClick={handleBack}>Back</button>
                            <button className={styles.primaryBtn} onClick={handleNext}>Next</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className={styles.step}>
                        <h2>Show me more...</h2>
                        <p>What type of content do you prefer on your home page?</p>
                        <div className={styles.feedOptions}>
                            <button 
                                className={`${styles.feedBtn} ${defaultFeed === 'movie' ? styles.active : ''}`}
                                onClick={() => setDefaultFeed('movie')}
                            >
                                Movies
                            </button>
                            <button 
                                className={`${styles.feedBtn} ${defaultFeed === 'tv' ? styles.active : ''}`}
                                onClick={() => setDefaultFeed('tv')}
                            >
                                TV Series
                            </button>
                            <button 
                                className={`${styles.feedBtn} ${defaultFeed === 'all' ? styles.active : ''}`}
                                onClick={() => setDefaultFeed('all')}
                            >
                                Both
                            </button>
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.secondaryBtn} onClick={handleBack} disabled={loading}>Back</button>
                            <button className={styles.primaryBtn} onClick={handleFinish} disabled={loading}>
                                {loading ? 'Saving...' : 'Start Watching'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
