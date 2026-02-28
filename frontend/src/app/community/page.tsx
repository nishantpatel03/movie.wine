'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Search } from 'lucide-react';

export default function CommunityPage() {
    return (
        <div className="min-h-screen w-full flex flex-col bg-background-dark text-slate-100 font-display relative overflow-x-hidden">

            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-background-dark/95 to-primary/10"></div>
                <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3"
                />
            </div>

            {/* Navigation (Shared) */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="fixed top-0 z-50 w-full bg-background-dark/90 backdrop-blur-xl border-b border-white/10 shadow-lg"
            >
                <div className="w-full px-6 lg:px-12 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8 lg:gap-16">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-3xl">movie_filter</span>
                            <h2 className="text-slate-100 text-2xl font-bold tracking-tight font-serif italic">MovieWine</h2>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-8">
                            <Link href="/" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Home</Link>
                            <Link href="/movies" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Movies</Link>
                            <Link href="/tv-shows" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">TV Shows</Link>
                            <Link href="/community" className="text-slate-200 hover:text-primary text-sm font-semibold transition-colors">Community</Link>
                            <Link href="/dashboard/watchlist" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">My List</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center bg-white/10 border border-white/10 rounded-full px-4 py-2 focus-within:ring-1 focus-within:ring-primary/50 focus-within:bg-white/20 transition-all focus-within:w-72 w-64">
                            <Search className="text-white/50 w-4 h-4 shrink-0 mr-3" />
                            <input
                                className="bg-transparent text-sm focus:outline-none placeholder:text-slate-400 text-white w-full"
                                placeholder="Titles, actors, genres..."
                                type="text"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center justify-center p-2 text-slate-300 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>

                            <SignedOut>
                                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(244,192,37,0.4)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-primary text-background-dark px-6 py-2 rounded-lg font-bold text-sm transition-all"
                                    >
                                        SIGN IN
                                    </motion.button>
                                </SignInButton>

                                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-white/10 backdrop-blur-md text-slate-100 border border-white/10 px-6 py-2 rounded-lg font-bold text-sm transition-colors hidden sm:block"
                                    >
                                        SIGN UP
                                    </motion.button>
                                </SignUpButton>
                            </SignedOut>

                            <SignedIn>
                                <div className="h-10 w-10 flex items-center justify-center rounded-full border border-primary/30 p-0.5 hover:border-primary transition-colors cursor-pointer">
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                avatarBox: "h-full w-full rounded-full object-cover"
                                            }
                                        }}
                                    />
                                </div>
                            </SignedIn>

                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 lg:px-10 py-32 lg:py-40 relative z-10 w-full max-w-7xl">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-10"
                    >
                        <div>
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-secondary uppercase bg-secondary/10 border border-secondary/20 rounded-full"
                            >
                                Premium Support
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl lg:text-6xl font-serif italic text-white mb-6 leading-tight"
                            >
                                Let's Discuss <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-200">Cinematic Excellence</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-slate-400 text-lg leading-relaxed max-w-md"
                            >
                                Have a question about our curated selections or need assistance with your membership? Our team of dedicated cinephiles is here to assist you.
                            </motion.p>
                        </div>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.5 } }
                            }}
                            className="space-y-6"
                        >
                            <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-4 p-5 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-secondary/10 group-hover:border-secondary/50 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all">
                                    <span className="material-symbols-outlined text-white group-hover:text-secondary transition-colors text-2xl">location_on</span>
                                </div>
                                <div className="pt-1">
                                    <h3 className="text-white font-bold text-lg mb-1 tracking-wide">Headquarters</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm">
                                        8421 Sunset Boulevard, Suite 500<br />
                                        West Hollywood, CA 90069
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-4 p-5 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-secondary/10 group-hover:border-secondary/50 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all">
                                    <span className="material-symbols-outlined text-white group-hover:text-secondary transition-colors text-2xl">email</span>
                                </div>
                                <div className="pt-1">
                                    <h3 className="text-white font-bold text-lg mb-1 tracking-wide">Email Us</h3>
                                    <p className="text-slate-400 mb-1">concierge@moviewine.com</p>
                                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Response time: Within 2 hours</p>
                                </div>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-4 p-5 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-secondary/10 group-hover:border-secondary/50 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all">
                                    <span className="material-symbols-outlined text-white group-hover:text-secondary transition-colors text-2xl">call</span>
                                </div>
                                <div className="pt-1">
                                    <h3 className="text-white font-bold text-lg mb-1 tracking-wide">Direct Line</h3>
                                    <p className="text-slate-400 mb-1">+1 (323) 555-0198</p>
                                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Mon-Fri, 9am - 6pm PST</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-3xl -z-10 transform rotate-2"></div>
                        <div className="bg-[#261933]/60 backdrop-blur-xl border border-white/10 p-8 lg:p-10 rounded-3xl shadow-2xl">
                            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                                Get in Touch with our Cinephiles
                            </h2>
                            <motion.form
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
                                }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
                                        <label className="block text-slate-300 text-sm font-semibold tracking-wide uppercase">First Name</label>
                                        <input className="w-full rounded-xl px-5 py-4 bg-background-dark/50 text-white placeholder-slate-500 border border-white/10 focus:bg-white/5 focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all outline-none shadow-inner text-base" placeholder="Francis" type="text" />
                                    </motion.div>
                                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
                                        <label className="block text-slate-300 text-sm font-semibold tracking-wide uppercase">Last Name</label>
                                        <input className="w-full rounded-xl px-5 py-4 bg-background-dark/50 text-white placeholder-slate-500 border border-white/10 focus:bg-white/5 focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all outline-none shadow-inner text-base" placeholder="Coppola" type="text" />
                                    </motion.div>
                                </div>
                                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
                                    <label className="block text-slate-300 text-sm font-semibold tracking-wide uppercase">Email Address</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-secondary transition-colors pointer-events-none">email</span>
                                        <input className="w-full rounded-xl pl-14 pr-5 py-4 bg-background-dark/50 text-white placeholder-slate-500 border border-white/10 focus:bg-white/5 focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all outline-none shadow-inner text-base" placeholder="director@studio.com" type="email" />
                                    </div>
                                </motion.div>
                                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
                                    <label className="block text-slate-300 text-sm font-semibold tracking-wide uppercase">Topic</label>
                                    <div className="relative group">
                                        <select className="w-full rounded-xl px-5 py-4 text-white bg-background-dark/50 border border-white/10 focus:bg-white/5 focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all outline-none appearance-none cursor-pointer shadow-inner text-base">
                                            <option className="bg-background-dark text-white p-2">Membership Inquiry</option>
                                            <option className="bg-background-dark text-white p-2">Technical Support</option>
                                            <option className="bg-background-dark text-white p-2">Partnership Proposal</option>
                                            <option className="bg-background-dark text-white p-2">Press Inquiry</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-secondary transition-colors">expand_more</span>
                                    </div>
                                </motion.div>
                                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
                                    <label className="block text-slate-300 text-sm font-semibold tracking-wide uppercase">Message</label>
                                    <textarea className="w-full rounded-xl px-5 py-4 bg-background-dark/50 text-white placeholder-slate-500 border border-white/10 focus:bg-white/5 focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all outline-none resize-none shadow-inner text-base" placeholder="Tell us about your favorite film..." rows={5}></textarea>
                                </motion.div>
                                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(212,175,55,0.5)" }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gradient-to-r from-secondary via-[#F4C430] to-secondary bg-[length:200%_auto] hover:bg-right text-background-dark font-extrabold text-lg py-4 rounded-xl shadow-lg transition-all duration-500 flex items-center justify-center gap-3 group"
                                        type="button"
                                    >
                                        <span>Send Message</span>
                                        <span className="material-symbols-outlined text-[24px] group-hover:translate-x-1 transition-transform">send</span>
                                    </motion.button>
                                </motion.div>
                            </motion.form>
                        </div>
                    </motion.div>
                </div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mt-32 max-w-3xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif italic text-white mb-4">Frequently Asked Questions</h2>
                        <div className="h-1 w-16 bg-secondary mx-auto rounded-full"></div>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "How do I upgrade to the Director's Tier?",
                                a: "You can upgrade your membership at any time from your Account Settings. The Director's Tier includes exclusive access to pre-release screenings and our private film critique forums."
                            },
                            {
                                q: "Are the wine pairings included in the subscription?",
                                a: "Digital pairing guides are included in all tiers. Physical wine deliveries are exclusively available to our \"Sommelier & Cinema\" package members in select regions."
                            },
                            {
                                q: "Can I submit my own short films for review?",
                                a: "Absolutely. We host a monthly \"Indie Spotlight\" where members can submit their work. Selected films receive professional critique from our panel of experts."
                            }
                        ].map((faq, i) => (
                            <details key={i} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/10 transition-colors">
                                    <h3 className="text-white font-medium text-lg">{faq.q}</h3>
                                    <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-180">expand_more</span>
                                </summary>
                                <div className="px-6 pb-6 pt-0 text-slate-400 leading-relaxed border-t border-white/5 mt-2 pt-4">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </motion.div>

            </main>

            {/* Shared Footer */}
            <footer className="border-t border-white/5 bg-background-dark py-16 px-10 mt-auto">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                    <div className="col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-3xl">movie_filter</span>
                            <h2 className="text-white text-2xl font-bold font-serif italic">MovieWine</h2>
                        </div>
                        <p className="text-slate-500 max-w-xs leading-relaxed">The premier destination for the discerning viewer. Experience cinema like never before.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6">Explore</h4>
                        <ul className="space-y-4 text-slate-500 text-sm">
                            <li><Link href="/movies" className="hover:text-primary transition-colors">Movies</Link></li>
                            <li><Link href="/tv-shows" className="hover:text-primary transition-colors">TV Shows</Link></li>
                            <li><Link href="/community" className="hover:text-primary transition-colors">Community</Link></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}
