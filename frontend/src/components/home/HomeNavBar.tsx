'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { LiveSearch } from '@/components/shared/LiveSearch';

export function HomeNavBar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`sticky top-0 z-[100] w-full transition-all duration-500 bg-background-dark border-b border-white/5 shadow-2xl ${isScrolled ? "py-3" : "py-5"}`}
        >
            <div className="w-full px-6 lg:px-12 flex items-center justify-between gap-8">
                <div className="flex items-center gap-12 lg:gap-20 shrink-0">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <span className="material-symbols-outlined text-primary text-4xl fill-1 group-hover:scale-110 transition-transform duration-500">movie_filter</span>
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <h2 className="text-white text-2xl font-black tracking-tighter uppercase">
                            MOVIE<span className="text-primary italic">WINE</span>
                        </h2>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-10">
                        {['Home', 'Movies', 'Series', 'Community'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                                className="text-white/40 hover:text-white text-[11px] font-black tracking-[0.2em] uppercase transition-all relative group"
                            >
                                {item}
                                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-8 flex-1 justify-end">
                    <div className="hidden md:block w-full max-w-2xl mr-auto">
                        <LiveSearch />
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                        {/* Notification Bell */}
                        <button className="relative text-white/40 hover:text-white transition-colors group">
                            <span className="material-symbols-outlined text-2xl">notifications</span>
                            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-background-dark"></span>
                        </button>

                        {/* My List icon — only when signed in */}
                        <SignedIn>
                            <Link
                                href="/my-list"
                                title="My List"
                                className="relative text-white/40 hover:text-primary transition-colors group"
                            >
                                <span className="material-symbols-outlined text-2xl">bookmark</span>
                                <div className="absolute inset-0 bg-primary/10 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </Link>
                        </SignedIn>

                        {/* My Dashboard icon — only when signed in */}
                        <SignedIn>
                            <Link
                                href="/dashboard"
                                title="My Dashboard"
                                className="relative text-white/40 hover:text-primary transition-colors group"
                            >
                                <span className="material-symbols-outlined text-2xl">dashboard</span>
                                <div className="absolute inset-0 bg-primary/10 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </Link>
                        </SignedIn>

                        <SignedOut>
                            <div className="flex items-center gap-4">
                                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                    <button className="text-white/60 hover:text-white text-[11px] font-black tracking-widest uppercase transition-colors">
                                        Log In
                                    </button>
                                </SignInButton>

                                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(244,192,37,0.3)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-primary text-background-dark px-8 py-3 rounded-xl font-black text-[11px] tracking-widest uppercase shadow-xl"
                                    >
                                        Join Now
                                    </motion.button>
                                </SignUpButton>
                            </div>
                        </SignedOut>

                        <SignedIn>
                            <div className="relative group cursor-pointer">
                                {/* Circular border wrapper */}
                                <div className="h-10 w-10 rounded-full flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-all duration-300 bg-white/5 p-[1px]">
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                userButtonAvatarBox: "h-8 w-8",
                                                userButtonTrigger: "focus:shadow-none focus:outline-none"
                                            }
                                        }}
                                    />
                                </div>
                                {/* Subtle glow effect on hover */}
                                <div className="absolute inset-0 bg-primary/10 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
