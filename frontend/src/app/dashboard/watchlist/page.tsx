'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useState } from 'react';

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

export default function WatchlistPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // Placeholder Data
    const savedMovies = Array.from({ length: 12 }).map((_, i) => ({
        id: i + 1,
        title: ["The Obsidian Chronicles", "Vintage Dreams", "Midnight Shadows", "Echoes of Time", "Silent Echo", "Neon Lights"][i % 6],
        year: [2024, 2023, 2022, 2021][i % 4],
        genre: ["Sci-Fi", "Drama", "Thriller", "Action"][i % 4],
        src: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD2okTzokXQRyCvk9QEgS2_g9rUVlH5oBC1Uu2qS17pyvFwoS_MGwXVGWrd1fOBmQ-9gUqSXrhGlGGL2qhJGExMJ1-wptu6YzOb0LOgZMmIq7C2QGg5gj003LWR1XDt0b9SB4wbZy1YWWFyurOvWVyqbg-jaX_qVGVm_b-jGAwId_x-tZb8MXwqrd52jXIly44LxO37_adtCDTbf7K4YUPhvtXe9PHmNAOOksLVL8q_ZgljVSGLo7ds0Ka0Hn-WxBVdm-1aZik7Zhg",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCER2Vmr68AgZU425c3K6MwCGCN0FsPT1yvi6WcapL2YTTgw3tsvx3Kw9Zmqzvs1Z79-2eXtOag0r2i1w5HGDosRMveY2ACjzZo4icjmpla7eA7nQ_VOtF02sWu0e7MNKJVBh2VdXNH0WiBvT2y0EuImcRrpT3uaXGkmpgi4uIJD-GxM9Ff1OL9wfC5eJssrkDvHMSL1J-QrcjiloWeYwmriYAQyvuuwxy2O9buZxCWVlQ-yzuTWvS-1Bd61HOeaZxTZm39NKkIRYs",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBoi9j6kPM6-Dzg5o-I1dLd2PBt5DFebdQvizwioyOEL2ZiQmmh9n48Zl5__eHaqi73K0rc9LDJW03bF34fKspB-oEcsw6P6ResL-69vH1sp_7xPyGfBBLg7iuX8SM5qct0Tk791wZ1Fi9p9VkzVSwk9bbufRUmXlJMq7btnGZWTcry4_xn5yUhCuItcPHp7bR-DZTCi9gNJ1vhxdOryYQedpV0uPyAsaBh-B5yVxk7tVD34dbkKKDScbj1FBydyTrAnqn9t_V2YmU",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBs5CQoJ2uOIkbTxx80_oR2rzMuMNe75MfWJ6GJKwRNImDkpGSUMdVo0jYXFg3W29y_bEfI7X9goR1rDVUlqkSHHWvCIJWKhDkPMsmOWSWxehqb_HLdv84oNP1IbUkxDDDoh_DJRl0EkfSqt9ygN6aovAF5YhdjmAsDjB5oqfSMPr0KuWif_OPvDCpHje6Cp6Jd9kvmzpj9n5_ntn7sXpF1d_negNFLXzPuS-CJgeBF1i89B7ptjp1UkUM7OT6VeuO_I0RBw-H5Yrg",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAMuSX4GcHJVUItgysbiyfC4N0G-8hzZQAj5AQZLnTAbULuS9gZdputUdpxiVPATrns1b4kVjVNCFDEcan47wGNSaJzt8qzrnmcsh2y-MvTJgZ_QtIGX4Lfa0wTcUJK6BKhVnlgr-17jxphEKzLEha-l8XxAVgKzZl-JCtUZIdMEHuZxF2kOGAIT2yg_3HlZnKTpB7kOa_8-zOmucZKRN1Wh3LaTCrgDMuid6m7gEUIbkXFNf6usU-zV1M2T0uO6FQ4AeEM4UNXYeY"
        ][i % 5]
    }));

    const filteredMovies = searchQuery === ''
        ? savedMovies
        : savedMovies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-serif italic text-white mb-2">My Watchlist</h1>
                    <p className="text-slate-400">Your curated collection, ready to be watched.</p>
                </motion.div>

                {/* Search inside Watchlist */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-3 focus-within:ring-1 focus-within:ring-primary/50 focus-within:bg-white/10 transition-all w-full md:w-80"
                >
                    <Search className="text-white/50 w-5 h-5 shrink-0 mr-3" />
                    <input
                        className="bg-transparent text-sm focus:outline-none placeholder:text-slate-500 text-white w-full"
                        placeholder="Search your list..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </motion.div>
            </div>

            {/* Movies Grid */}
            {filteredMovies.length > 0 ? (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-12"
                >
                    {filteredMovies.map((movie) => (
                        <motion.div
                            key={movie.id}
                            variants={fadeInUp}
                            className="relative group cursor-pointer flex flex-col h-full"
                        >
                            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 border border-white/5 shadow-lg group-hover:shadow-[0_0_30px_rgba(244,192,37,0.15)] transition-all">
                                <img src={movie.src} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                                {/* Remove from list button */}
                                <button className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/80 hover:scale-110 z-10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>

                                {/* Hover Play Button Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="h-16 w-16 bg-primary/90 text-background-dark rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(244,192,37,0.5)] transform translate-y-4 group-hover:translate-y-0"
                                    >
                                        <span className="material-symbols-outlined text-3xl font-bold ml-1">play_arrow</span>
                                    </motion.div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-primary tracking-wider uppercase">{movie.genre}</span>
                                    <span className="text-xs text-slate-500 font-medium">{movie.year}</span>
                                </div>
                                <h3 className="text-white font-serif italic text-xl group-hover:text-primary transition-colors line-clamp-2">{movie.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                    <span className="material-symbols-outlined text-6xl text-white/20 mb-4">movie</span>
                    <h3 className="text-xl font-bold text-white mb-2">No titles found</h3>
                    <p className="text-slate-400">We couldn't find anything matching "{searchQuery}" in your list.</p>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors"
                    >
                        Clear Search
                    </button>
                </div>
            )}
        </>
    );
}
