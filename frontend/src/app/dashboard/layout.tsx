'use client';

import { motion } from 'framer-motion';
import { SignedIn, SignedOut, UserButton, RedirectToSignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background-dark text-slate-100 font-display flex flex-col md:flex-row">

            {/* Fallback to SignIn if not authenticated */}
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>

            {/* Main Dashboard - Only visible when SignedIn */}
            <SignedIn>

                {/* Sidebar Navigation */}
                <motion.aside
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-background-dark/80 backdrop-blur-xl p-6 flex flex-col justify-between shrink-0"
                >
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-12">
                            <span className="material-symbols-outlined text-primary text-3xl">movie_filter</span>
                            <h2 className="text-white text-2xl font-bold font-serif italic tracking-tight hidden md:block">MovieWine</h2>
                        </Link>

                        <nav className="space-y-2 flex gap-4 md:block overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors shrink-0">
                                <span className="material-symbols-outlined">dashboard</span>
                                <span>Overview</span>
                            </Link>
                            <Link href="/dashboard/watchlist" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors shrink-0">
                                <span className="material-symbols-outlined">bookmark</span>
                                <span>My Watchlist</span>
                            </Link>
                            <Link href="/dashboard/reviews" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors shrink-0">
                                <span className="material-symbols-outlined">reviews</span>
                                <span>My Reviews</span>
                            </Link>
                            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors shrink-0">
                                <span className="material-symbols-outlined">settings</span>
                                <span>Settings</span>
                            </Link>
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center gap-4 mt-12 p-4 rounded-xl glassmorphism border border-white/5">
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "h-10 w-10 border border-primary/30"
                                }
                            }}
                        />
                        <div>
                            <p className="text-sm font-bold text-white">My Account</p>
                            <p className="text-xs text-slate-500">Manage Profile</p>
                        </div>
                    </div>
                </motion.aside>

                {/* Dashboard Main Content Area */}
                <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full max-w-7xl mx-auto">

                    {/* Header Mobile Auth (only visible on small screens) */}
                    <div className="md:hidden flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-serif italic text-white flex gap-2 items-center">
                            <span className="material-symbols-outlined text-primary">waving_hand</span>
                            Welcome back
                        </h1>
                        <UserButton />
                    </div>

                    {children}
                </main>

            </SignedIn>
        </div>
    );
}
