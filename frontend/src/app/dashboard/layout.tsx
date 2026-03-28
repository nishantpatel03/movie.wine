'use client';

import { motion } from 'framer-motion';
import { SignedIn, SignedOut, UserButton, RedirectToSignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeNavBar } from '@/components/home/HomeNavBar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', label: 'Overview', icon: 'dashboard' },
        { href: '/dashboard/watchlist', label: 'My Watchlist', icon: 'bookmark' },
        { href: '/dashboard/reviews', label: 'My Reviews', icon: 'reviews' },
        { href: '/dashboard/settings', label: 'Settings', icon: 'settings' },
    ];

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 font-display flex flex-col">

            {/* Main Site Navbar — always visible at top for navigation back to site */}
            <HomeNavBar />

            {/* Dashboard body: sidebar + content */}
            <div className="flex flex-col md:flex-row flex-1">

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
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link 
                                        key={item.href}
                                        href={item.href} 
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all shrink-0 ${
                                            isActive 
                                            ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(244,192,37,0.1)]' 
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
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
        </div>
    );
}
