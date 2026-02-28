'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

export default function DashboardOverviewPage() {
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden md:block mb-12"
            >
                <h1 className="text-4xl font-serif italic text-white mb-2">Welcome to your cellar</h1>
                <p className="text-slate-400">Here's an overview of your cinematic journey.</p>
            </motion.div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-12"
            >
                {/* Stats Overview */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { label: "Movies Watched", value: "342", trend: "+12 this month", icon: "movie", color: "text-blue-400" },
                        { label: "Reviews Written", value: "56", trend: "+3 this month", icon: "edit_document", color: "text-accent-purple" },
                        { label: "Watchtime (hrs)", value: "894", trend: "+45 this month", icon: "schedule", color: "text-primary" }
                    ].map((stat, i) => (
                        <motion.div key={i} variants={fadeInUp} className="glassmorphism p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`material-symbols-outlined text-3xl ${stat.color} p-2 rounded-xl bg-white/5`}>{stat.icon}</span>
                            </div>
                            <h3 className="text-4xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-slate-400 font-medium mb-2">{stat.label}</p>
                            <p className="text-xs text-emerald-400 font-bold tracking-wide uppercase">{stat.trend}</p>
                        </motion.div>
                    ))}
                </section>

                {/* Recent Watchlist */}
                <section>
                    <div className="flex items-end justify-between mb-6">
                        <h2 className="text-2xl font-serif italic text-white">Recently Added to Watchlist</h2>
                        <Link href="/dashboard/watchlist" className="text-primary hover:text-white text-sm font-bold transition-colors">View All</Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "The Obsidian Chronicles", year: "2024", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2okTzokXQRyCvk9QEgS2_g9rUVlH5oBC1Uu2qS17pyvFwoS_MGwXVGWrd1fOBmQ-9gUqSXrhGlGGL2qhJGExMJ1-wptu6YzOb0LOgZMmIq7C2QGg5gj003LWR1XDt0b9SB4wbZy1YWWFyurOvWVyqbg-jaX_qVGVm_b-jGAwId_x-tZb8MXwqrd52jXIly44LxO37_adtCDTbf7K4YUPhvtXe9PHmNAOOksLVL8q_ZgljVSGLo7ds0Ka0Hn-WxBVdm-1aZik7Zhg" },
                            { title: "Vintage Dreams", year: "2023", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCER2Vmr68AgZU425c3K6MwCGCN0FsPT1yvi6WcapL2YTTgw3tsvx3Kw9Zmqzvs1Z79-2eXtOag0r2i1w5HGDosRMveY2ACjzZo4icjmpla7eA7nQ_VOtF02sWu0e7MNKJVBh2VdXNH0WiBvT2y0EuImcRrpT3uaXGkmpgi4uIJD-GxM9Ff1OL9wfC5eJssrkDvHMSL1J-QrcjiloWeYwmriYAQyvuuwxy2O9buZxCWVlQ-yzuTWvS-1Bd61HOeaZxTZm39NKkIRYs" },
                            { title: "Midnight Shadows", year: "2022", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoi9j6kPM6-Dzg5o-I1dLd2PBt5DFebdQvizwioyOEL2ZiQmmh9n48Zl5__eHaqi73K0rc9LDJW03bF34fKspB-oEcsw6P6ResL-69vH1sp_7xPyGfBBLg7iuX8SM5qct0Tk791wZ1Fi9p9VkzVSwk9bbufRUmXlJMq7btnGZWTcry4_xn5yUhCuItcPHp7bR-DZTCi9gNJ1vhxdOryYQedpV0uPyAsaBh-B5yVxk7tVD34dbkKKDScbj1FBydyTrAnqn9t_V2YmU" },
                            { title: "Echoes of Time", year: "2024", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBs5CQoJ2uOIkbTxx80_oR2rzMuMNe75MfWJ6GJKwRNImDkpGSUMdVo0jYXFg3W29y_bEfI7X9goR1rDVUlqkSHHWvCIJWKhDkPMsmOWSWxehqb_HLdv84oNP1IbUkxDDDoh_DJRl0EkfSqt9ygN6aovAF5YhdjmAsDjB5oqfSMPr0KuWif_OPvDCpHje6Cp6Jd9kvmzpj9n5_ntn7sXpF1d_negNFLXzPuS-CJgeBF1i89B7ptjp1UkUM7OT6VeuO_I0RBw-H5Yrg" }
                        ].map((movie, i) => (
                            <motion.div key={i} variants={fadeInUp} whileHover={{ scale: 1.05 }} className="relative aspect-[2/3] rounded-xl overflow-hidden group cursor-pointer border border-white/5">
                                <img src={movie.src} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 w-full p-4">
                                    <p className="text-primary text-xs font-bold mb-1">{movie.year}</p>
                                    <h4 className="text-white font-serif italic text-sm group-hover:text-primary transition-colors line-clamp-2">{movie.title}</h4>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

            </motion.div>
        </>
    );
}
