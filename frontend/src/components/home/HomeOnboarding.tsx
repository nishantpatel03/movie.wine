'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { User, getUserProfile } from '@/lib/api';
import OnboardingModal from './OnboardingModal';

export default function HomeOnboarding() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [dbUser, setDbUser] = useState<User | null>(null);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            const fetchUserProfile = async () => {
                try {
                    const profile = await getUserProfile(user.id);
                    setDbUser(profile);
                    if (!profile.favourite_genres || profile.favourite_genres === '') {
                        setShowOnboarding(true);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            };
            fetchUserProfile();
        }
    }, [isLoaded, isSignedIn, user]);

    const handleOnboardingComplete = (updatedUser: User) => {
        setDbUser(updatedUser);
        setShowOnboarding(false);
        // We might want to trigger a refresh of the page or just let the user see their new content
        // on next refresh, but better to refresh now.
        window.location.reload();
    };

    if (!showOnboarding || !dbUser) return null;

    return (
        <OnboardingModal user={dbUser} onComplete={handleOnboardingComplete} />
    );
}
