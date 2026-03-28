'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded) {
            if (!user || user.publicMetadata.role !== 'admin') {
                router.push('/dashboard');
            }
        }
    }, [user, isLoaded, router]);

    if (!isLoaded || !user || user.publicMetadata.role !== 'admin') {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 font-display flex">
            {/* Admin Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-background-dark/50 backdrop-blur-xl p-6 hidden md:flex flex-col">
                <div className="mb-12">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
                        <h2 className="text-white text-xl font-bold font-serif italic tracking-tight">MovieWine Admin</h2>
                    </Link>
                </div>

                <nav className="space-y-2 flex-1">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span>Overview</span>
                    </Link>
                    <Link href="/admin/movies" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                        <span className="material-symbols-outlined">movie</span>
                        <span>Movie Links</span>
                    </Link>
                    <Link href="/admin/series" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                        <span className="material-symbols-outlined">tv</span>
                        <span>Series Links</span>
                    </Link>
                </nav>

                <div className="pt-6 border-t border-white/5">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span>User Dashboard</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-background-dark/30 backdrop-blur-sm sticky top-0 z-10">
                    <h1 className="text-sm font-bold tracking-widest uppercase text-slate-500">Admin Control Center</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-tighter">Admin Mode</span>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
