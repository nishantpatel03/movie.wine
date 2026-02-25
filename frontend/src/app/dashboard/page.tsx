'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// Animation Variants
const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const movieCardVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } }
};

export default function DashboardPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            <div className="layout-container flex h-full grow flex-col">
                {/* Top Navigation Bar */}
                <motion.header
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 px-6 py-4 lg:px-20 bg-background-dark/80 backdrop-blur-md sticky top-0 z-50"
                >
                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
                                <span className="material-symbols-outlined text-2xl">movie_filter</span>
                            </div>
                            <h2 className="text-slate-100 text-2xl font-bold tracking-tight">Movie<span className="text-primary">Wine</span></h2>
                        </div>
                        <nav className="hidden lg:flex items-center gap-8">
                            <Link href="/" className="text-slate-100 text-sm font-medium hover:text-primary transition-colors">Home</Link>
                            <Link href="#" className="text-slate-400 text-sm font-medium hover:text-primary transition-colors">Movies</Link>
                            <Link href="#" className="text-slate-400 text-sm font-medium hover:text-primary transition-colors">My Library</Link>
                            <Link href="#" className="text-primary text-sm font-bold border-b-2 border-primary pb-1">AI Taste</Link>
                        </nav>
                    </div>
                    <div className="flex flex-1 justify-end gap-6 items-center">
                        <label className="flex flex-col min-w-40 h-10 max-w-md hidden md:block">
                            <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-[#2d1b42]/50 border border-primary/30">
                                <div className="text-primary/60 flex items-center justify-center pl-4">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input className="form-input flex w-full border-none bg-transparent focus:ring-0 text-slate-100 placeholder:text-primary/40 px-3 text-sm" placeholder="Search movies, directors, or AI tags..." />
                            </div>
                        </label>
                        <div className="flex items-center gap-3">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center rounded-xl size-10 bg-[#2d1b42] hover:bg-primary/20 text-slate-100 transition-all">
                                <span className="material-symbols-outlined">notifications</span>
                            </motion.button>
                            <div className="h-10 w-10 rounded-full border-2 border-primary p-0.5">
                                <img alt="User avatar" className="rounded-full h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJVgdRFOmM2y4PyyTwGznnLK6Qlwvar2Zh4qThUJdLenk7l6zTGF3ZfHyOPaMXsN9Z8zBKd71eqOHLBE13OV9lMoFuMbHG0GPieS5q6sIt6ALrxGDySLJHnfmlUFp0oiXs_QnZKHzr0pXhK4_MaBBc_ljOZZHKofvK9RU3nf6cn3eRgDV45-nH1-bS7C-fj-_-6ofMtURbnTtZfEDfXALuwyhTKrfZmqEg4_S3TPP-BL8HW8Hk7FcIRl4y-Lyu3LOysdrv5831mZM" />
                            </div>
                        </div>
                    </div>
                </motion.header>

                <main className="flex flex-col flex-1 px-6 lg:px-20 py-10 max-w-[1440px] mx-auto w-full">

                    {/* AI Taste Profile Summary */}
                    <motion.section
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="mb-12"
                    >
                        <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
                            <div className="flex flex-col gap-2">
                                <motion.h1 variants={fadeInUp} className="text-slate-100 text-4xl lg:text-5xl font-black tracking-tight">Your AI Taste Profile</motion.h1>
                                <motion.p variants={fadeInUp} className="text-primary/70 text-lg font-medium">Curating cinematic experiences based on your unique artistic palette.</motion.p>
                            </div>
                            <motion.button
                                variants={fadeInUp}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/80 transition-all"
                            >
                                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                Recalibrate AI
                            </motion.button>
                        </div>

                        <motion.div variants={staggerContainer} className="flex gap-4 flex-wrap">
                            {/* Tags */}
                            <motion.div variants={fadeInUp} className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#2d1b42] px-5 border border-primary/30 text-slate-100">
                                <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                                <span className="text-sm font-semibold tracking-wide">Cerebral</span>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#2d1b42] px-5 border border-primary/30 text-slate-100">
                                <span className="material-symbols-outlined text-primary text-xl">visibility</span>
                                <span className="text-sm font-semibold tracking-wide">Visual Spectacle</span>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#2d1b42] px-5 border border-primary/30 text-slate-100">
                                <span className="material-symbols-outlined text-primary text-xl">all_inclusive</span>
                                <span className="text-sm font-semibold tracking-wide">Mind-Bending</span>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#2d1b42] px-5 border border-primary/30 text-slate-100">
                                <span className="material-symbols-outlined text-primary text-xl">cloudy</span>
                                <span className="text-sm font-semibold tracking-wide">Atmospheric</span>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#2d1b42]/30 px-5 border border-dashed border-primary/30 text-primary/60 italic">
                                <span className="text-sm font-medium">+ Neo-Noir</span>
                            </motion.div>
                        </motion.div>
                    </motion.section>

                    {/* Recommendations Grid */}
                    <section>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-8"
                        >
                            <span className="material-symbols-outlined text-[#FFD700]">stars</span>
                            <h2 className="text-slate-100 text-2xl font-bold tracking-tight">Top AI Matches for You</h2>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
                        >
                            {/* Movie Card 1 */}
                            <motion.div variants={movieCardVariant} whileHover="hover" className="group relative flex flex-col gap-3 rounded-xl z-10 cursor-pointer">
                                <div className="relative aspect-[2/3] overflow-hidden rounded-xl border-2 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                                    <img alt="Movie Poster" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh0ffDApaVBWdAysTXXRUIIMCX4LI2e76Xmcx2jrt9AUkvl0m7_SXQ7lfV8s0FXJp1FOwXx7mV6FqWlwiMstLWIXwcX8bWRRGpNXaURnjBER_7T59orf-P7XeHryLwPJSU-XAYqydsVhdQ_NSGVPf-AS38f_yuiaCI8U6fgTyRdhOgottbDk0C62YSU8vlXIk2BZJpXG6ShcDCccbRh0ZreQ3mFwUuLrLS_1EjyKi5zsM7YWVi9BiaqkmcX7zaaThkIAEp6Occ9so" />
                                    <div className="absolute top-3 right-3 bg-[#FFD700] text-background-dark px-2 py-1 rounded text-xs font-black shadow-lg">
                                        98% MATCH
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80"></div>

                                    {/* Glassmorphism AI Insight Tooltip */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="absolute bottom-4 left-4 right-4 bg-primary/10 backdrop-blur-md p-4 rounded-lg border border-[#FFD700]/20"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-[#FFD700] text-xs">auto_awesome</span>
                                            <span className="text-[10px] uppercase font-bold text-[#FFD700] tracking-widest">AI Insight</span>
                                        </div>
                                        <p className="text-xs text-slate-200 leading-relaxed">
                                            Recommended because you liked <span className="text-[#FFD700] italic">Interstellar</span>. Matches your preference for <span className="font-bold">Sci-Fi visuals</span>.
                                        </p>
                                    </motion.div>
                                </div>
                                <div className="px-1">
                                    <h3 className="text-slate-100 font-bold text-lg leading-tight truncate">Celestial Voyage</h3>
                                    <p className="text-primary/60 text-sm font-medium">Sci-Fi • 2024</p>
                                </div>
                            </motion.div>

                            {/* Movie Card 2 */}
                            <motion.div variants={movieCardVariant} whileHover="hover" className="group relative flex flex-col gap-3 cursor-pointer">
                                <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-primary/20">
                                    <img alt="Movie Poster" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoWFN-BUvYpUO57qIvs0auwO-o5Zafan3YM_HrVJRlIrEh7BaHJlfmwfMqZusvkr1y487GEdVEaj5g7KObXsakImEkWF8nYc5nbOT7gvvCQeBb3YBoOwBEzdkFjAveKDplEO4xCsP0RW1wSyQGiKzArT5RR_2etcSkrHTuY7IliAdSVDA-46vqsKZ0okRm_UPSgtv60tM9PmnLoUjfOm5JR-drp8zHf70YUJIFlbU2x0ohp9ZxRFu7-jmWFt0DdkLADalV9S1jWwY" />
                                    <div className="absolute top-3 right-3 bg-[#FFD700] text-background-dark px-2 py-1 rounded text-xs font-black">
                                        95% MATCH
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/60 to-transparent group-hover:bg-gradient-to-t group-hover:from-primary/40 group-hover:to-transparent"></div>
                                </div>
                                <div className="px-1">
                                    <h3 className="text-slate-100 font-bold text-lg leading-tight truncate">The Velvet Shadow</h3>
                                    <p className="text-primary/60 text-sm font-medium">Noir Thriller • 2023</p>
                                </div>
                            </motion.div>

                            {/* Movie Card 3 */}
                            <motion.div variants={movieCardVariant} whileHover="hover" className="group relative flex flex-col gap-3 cursor-pointer">
                                <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-primary/20">
                                    <img alt="Movie Poster" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdfOAN65Q6V4h0FZ0Kw-u0pw09abow5lGQEDo3KQm1d3oN2tsIdncLi8TcwWsEyKc_kN7bsX2MMxVZzMNQa2VzHCwGzwHsahzyDHTcTB8axNAAvRv1swXQEzxLU_9OJ2k980-3EfeOEWbvWILyHkDdFUIIkj0bWxod7bsZFr4dSK9u2y21uZXJ4D02fXBGYOgVgCv-DeylWH93ro8UFQ1o0zd20dPCfDiojfeeNeYENQaw36XB2GZDQYZrm33zjnlnocpWduk47wg" />
                                    <div className="absolute top-3 right-3 bg-[#FFD700] text-background-dark px-2 py-1 rounded text-xs font-black">
                                        92% MATCH
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/60 to-transparent"></div>
                                </div>
                                <div className="px-1">
                                    <h3 className="text-slate-100 font-bold text-lg leading-tight truncate">Fractured Mind</h3>
                                    <p className="text-primary/60 text-sm font-medium">Psychological • 2024</p>
                                </div>
                            </motion.div>

                            {/* Movie Card 4 */}
                            <motion.div variants={movieCardVariant} whileHover="hover" className="group relative flex flex-col gap-3 cursor-pointer">
                                <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-primary/20">
                                    <img alt="Movie Poster" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYYFFcNy5DG0y6C6eeQ5awnCwF8divhvVNJBTuptFbd2pG6_FeRTtGYvpMdHer94i0DjSuhzn79b-F1l5bhaO2CNS9M8UTT1t7Zk9MGLt5cST2yPI2gw6JFYPuvJkqSVgre5sQrrYWqSFpKwOyQGhGsqiritL0KZt_rXit79JYh_SSZAm6x168YY4VLgucZADuYvLN_DY4yZYOK2nuH1ax07REuh2tLd65CdlGKYTg-e-3EUT7V6-1XBLaENM89j1QG9GeJ2wbP4c" />
                                    <div className="absolute top-3 right-3 bg-[#FFD700] text-background-dark px-2 py-1 rounded text-xs font-black">
                                        89% MATCH
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/60 to-transparent"></div>
                                </div>
                                <div className="px-1">
                                    <h3 className="text-slate-100 font-bold text-lg leading-tight truncate">Neon Pulse</h3>
                                    <p className="text-primary/60 text-sm font-medium">Cyberpunk • 2023</p>
                                </div>
                            </motion.div>

                            {/* Movie Card 5 */}
                            <motion.div variants={movieCardVariant} whileHover="hover" className="group relative flex flex-col gap-3 cursor-pointer">
                                <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-primary/20">
                                    <img alt="Movie Poster" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbJbMOCH15JgQrXsPLUFWEChJv4x5KRIdxZqG9_3pfl4LQzCaG2qNQ__CnEa17tCKmEqLDYIoLQw_AfN0CcOe13o8vYvayud7RgGqeUa8EsT79vAyvhPkZhTohMR_7cfrFukPTE1g29qJ_HId0BTY5MxtOTOy1HPwPF5rFDY2YJANMdUj8nMdwKGeKDdvlwDOzqWcrJP3zKrXb8gDh93wtMBfBU-O3J5rRiMefjBKPk_ldCIoJ8UordJlAK2w3Qo7Xj2LIkqrrkM8" />
                                    <div className="absolute top-3 right-3 bg-[#FFD700] text-background-dark px-2 py-1 rounded text-xs font-black">
                                        87% MATCH
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/60 to-transparent"></div>
                                </div>
                                <div className="px-1">
                                    <h3 className="text-slate-100 font-bold text-lg leading-tight truncate">The Silent Peak</h3>
                                    <p className="text-primary/60 text-sm font-medium">Atmospheric Drama • 2022</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* Second Row: Recently Watched */}
                    <section className="mt-16 pb-20">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">history</span>
                                <h2 className="text-slate-100 text-2xl font-bold tracking-tight">Reinforcing Your Taste</h2>
                            </div>
                            <a className="text-primary text-sm font-bold hover:underline" href="#">View Watch History</a>
                        </div>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
                        >
                            {[
                                { title: "Interstellar", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYMdTcqqCU74tjR_d4ANlm8F91ah2a8A2ygyMdf_kt-CFp-sWXCI9pr64dGVQbnHyEEjlisNMykdS2_RBWmT-uaFZXo2fUCSdThc9iDC-_glkguzKSxtccAgQPOH4Pa9T-GxWAhiAkUXOaMz1ZTb4BhbTgNaYSysZ5dJ2UMoc85vvh6KICehN338Vwoi2W-0ZvGxyn7uE9wzGZcW47iwtnVEYENCzfPsmJYRg0-FCDbxMFDKGn5Pg5Nvv94VloiKie7UnDeWrgTlU" },
                                { title: "Blade Runner 2049", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQIjbzGFCdJBkew795yjMtp4-stz3uU-FAPEVV21cmKWsK9U6cLSWXaeYT4PcZ6Va5qXZPamkuvkld7bxhv-dM_aoaOXspEvIkIJpiRkKbd_ifAcWqrhwo0eEU1E3AQ-TiYiCFmphJX1voq0RPwEQ_MrFKEQi1IjGXQhWDWmyfJkFW9uKowanjYppwsC4WKaFORYMqqtGMcATJdGkJm9Mal-3GaY5TdBcE1DpZNEG1eKrgrV31-k_J8kyqRF8LjWgn852nQscaRQM" },
                                { title: "Inception", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJqkH9tPqDw1M3gU2BmQBLZEIKrvat1Ae_XoVGEoyUr6P_-jtvtGQI7tsMNbmiEf8zkPI1oQnoaIECOeFEOawWhyeCJlDdwiwHGoJ8JmfiF9kKC94thA9WMFC5xDVFdQH4uheoTj4PQl2TaXutdE2ThiUhqq2K6qInArBRAJUckW-3-vhMDLPB6oXvlRUxhpPR9O27ztdoxagEvUgF4_yMI8hUReUfgNd-JUiIZGmatU229IFCxDrxep8WkFScfsueXgU7nOcHyI0" },
                                { title: "Dune", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM5aKTRtpxdZ7Fq8t-CRRA5VseAq0B5O8Odzk8VHedWjWc1KzNhSwFBtF_T99q140SgAz5YtFk3g5VYY5Wj8Vzz11NuSTwbdSu7ioqOEUlnna1tle4afb8A0TlgoBvHHI6F9ty062cXiOIv1qD6xZnokrrbATT0ygBzXnMHfxRW426IqANE0ntHYFrkWNXmc084agLijg2szzgzM4xPtoDtLSJMnaeA14Wls3xC92AJUOV678qqKVauyL99lW3DlVcLZnyIGVfoRQ" }
                            ].map((movie, idx) => (
                                <motion.div key={idx} variants={fadeInUp} className="flex flex-col gap-2 group cursor-pointer">
                                    <div className="aspect-video rounded-lg overflow-hidden border border-primary/10">
                                        <img alt="Past Movie" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" src={movie.img} />
                                    </div>
                                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">You Liked</p>
                                    <h4 className="text-slate-100 text-sm font-bold truncate">{movie.title}</h4>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>
                </main>

                {/* Bottom Action Bar (Floating Experience) */}
                <motion.div
                    initial={{ y: 100, x: '-50%', opacity: 0 }}
                    animate={{ y: 0, x: '-50%', opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="fixed bottom-8 left-1/2 z-50 px-6 py-4 bg-primary/10 backdrop-blur-xl rounded-2xl flex items-center gap-8 shadow-2xl border border-primary/30"
                >
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#FFD700] font-bold uppercase tracking-widest">AI Sync Status</span>
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-[#FFD700] animate-pulse"></div>
                            <span className="text-sm font-medium text-slate-100">Live Optimization Active</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-primary/30"></div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-slate-100 text-sm font-bold hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-xl">share</span>
                            Share Taste
                        </button>
                        <button className="flex items-center gap-2 text-slate-100 text-sm font-bold hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-xl">settings_input_component</span>
                            Fine Tune
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
