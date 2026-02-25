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
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } }
};

export default function MoviePage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">

      {/* Navigation */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 px-10 py-4 glass-card sticky top-0 z-50"
      >
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-primary">
            <div className="size-6">
              <span className="material-symbols-outlined text-3xl">movie_filter</span>
            </div>
            <h2 className="text-slate-100 text-xl font-bold leading-tight tracking-tight">MovieWine</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-slate-300 hover:text-primary transition-colors text-sm font-medium">Home</Link>
            <Link href="#" className="text-slate-300 hover:text-primary transition-colors text-sm font-medium">Movies</Link>
            <Link href="#" className="text-slate-300 hover:text-primary transition-colors text-sm font-medium">Series</Link>
            <Link href="#" className="text-slate-300 hover:text-primary transition-colors text-sm font-medium">My List</Link>
          </nav>
        </div>
        <div className="flex flex-1 justify-end gap-6">
          <label className="flex flex-col min-w-40 h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-primary/60 flex border-none bg-primary/10 items-center justify-center pl-4 rounded-l-xl">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input className="form-input flex w-full min-w-0 flex-1 border-none bg-primary/10 text-slate-100 focus:ring-0 h-full placeholder:text-primary/40 px-4 rounded-r-xl pl-2 text-sm font-normal" placeholder="Search cinematic wines..." />
            </div>
          </label>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all">
              <span className="material-symbols-outlined text-xl">account_circle</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="relative flex-1">
        {/* Full-bleed Backdrop */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBcAooGIriAAygCJ9Oc95wgl2w3-mTLNpFFMS_KY3tX0kYMq9XuF2XNpAx2C5FAD4r6MkXNE7adnQLp2YiUJqKozp1FBMKu9dIVjOgigL7D_-_MP95yQT-qAD7S_UImDLGz8M5DoF0vSqKgyEXnfE5snKr1uqdnsd6n9i7w9Bp_2Ba3ry9IhO0eXmTWj2zjvM6r4x1IEBKdsgvlOlFQGcFGwDH0-GUDaMJz2PfRP5as9oWI83XSOArsQvd7Cz182x1VCspviMphAK0")' }}
          ></div>
          <div className="absolute inset-0 purple-overlay"></div>
        </motion.div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">

          {/* Left Column: Poster & Score */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8 w-full lg:w-1/3 items-center"
          >
            <motion.div variants={scaleIn} className="relative group w-full max-w-sm">
              <div className="absolute -inset-1 bg-primary/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div
                className="relative bg-center bg-no-repeat aspect-[2/3] bg-cover rounded-xl w-full shadow-2xl border border-primary/20"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxvj5-z9nbLftKeTjCQpLLwxEzql5YTy2NPZxKPfu75CCEElgQhUWAki4CitCYnV_VQcxR5pG8uO_d8vHFE9H1lgKYgCyePTfnCCN_qshjmw9mh_D0BHM8qsSWeP1i8XuMXDCYvB1GKX-qFRvEpLML2trwZRSV0L5ooAzijurHx_J4tgqfzKpsigqaPOJr60RuaYzzWCfHzfDsKG1JdfCZ-ZIBTGqKjF32kJvp4jrpIuDOq0ztbQgCfJBd1DIJiUD6RSK5TTdxHRY")' }}
              ></div>
            </motion.div>

            {/* Match Score Radial */}
            <motion.div variants={fadeInUp} className="glass-card p-6 rounded-xl flex items-center gap-6 w-full max-w-sm">
              <motion.div
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5, type: 'spring' }}
                className="relative size-24 rounded-full radial-progress flex items-center justify-center"
              >
                <span className="text-2xl font-bold text-primary">94%</span>
              </motion.div>
              <div>
                <p className="text-primary font-bold text-lg">AI Match Score</p>
                <p className="text-slate-400 text-sm">Tailored precisely to your palate for psychological thrillers.</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Details */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex-1 flex flex-col gap-8"
          >
            <div className="space-y-2">
              <motion.div variants={fadeInRight} className="flex items-center gap-3 text-primary text-sm font-bold tracking-widest uppercase mb-2">
                <span className="material-symbols-outlined text-sm">stars</span>
                AI RECOMMENDATION OF THE MONTH
              </motion.div>
              <motion.h1 variants={fadeInRight} className="text-primary text-5xl md:text-7xl font-bold leading-none tracking-tighter">
                THE NEURAL EDGE
              </motion.h1>
              <motion.div variants={fadeInRight} className="flex items-center gap-4 text-slate-300 text-lg">
                <span>2024</span>
                <span className="size-1 bg-primary rounded-full"></span>
                <span>2h 15m</span>
                <span className="size-1 bg-primary rounded-full"></span>
                <span>Sci-Fi / Existential Drama</span>
              </motion.div>
            </div>

            {/* Actions */}
            <motion.div variants={fadeInRight} className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(244,192,37,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 bg-primary text-background-dark rounded-xl font-bold text-lg shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined">play_circle</span>
                Watch Trailer
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(244,192,37,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 bg-primary/10 text-primary border border-primary/30 rounded-xl font-bold text-lg transition-colors"
              >
                <span className="material-symbols-outlined">bookmark_add</span>
                Add to Watchlist
              </motion.button>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Synopsis */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-primary text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">notes</span>
                  Synopsis
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed glass-card p-6 rounded-xl">
                  In a near-future Neo-Tokyo, a consciousness-hacker discovers a hidden layer within the global neural net that suggests human reality is a curated simulation for an ancient intelligence. As she dives deeper, she must decide if the painful truth is worth sacrificing a blissful ignorance. A profound exploration of identity and the nature of perception.
                </p>
                <div className="pt-4">
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-3">Similar Moods</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="glass-card px-4 py-2 rounded-full text-primary border-primary/40 text-sm font-medium">#Noir</span>
                    <span className="glass-card px-4 py-2 rounded-full text-primary border-primary/40 text-sm font-medium">#Existential</span>
                    <span className="glass-card px-4 py-2 rounded-full text-primary border-primary/40 text-sm font-medium">#Cerebral</span>
                    <span className="glass-card px-4 py-2 rounded-full text-primary border-primary/40 text-sm font-medium">#VisuallyStunning</span>
                  </div>
                </div>
              </div>

              {/* Nutrition Facts Style Box */}
              <div className="glass-card border-2 border-primary/30 rounded-lg p-6 flex flex-col h-fit">
                <h4 className="text-primary text-2xl font-black italic mb-1 border-b-4 border-primary pb-2">AI BREAKDOWN</h4>
                <p className="text-[10px] text-slate-400 mb-4 border-b border-primary/20 pb-2">PERCENT DAILY VALUE BASED ON YOUR PERSONAL VIEWING HISTORY</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-primary/20 pb-1">
                    <div>
                      <span className="text-xl font-bold">Content Match</span>
                    </div>
                    <span className="text-xl font-bold text-primary">70%</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-primary/20 pb-1">
                    <div>
                      <span className="text-xl font-bold">Cinematic Quality</span>
                    </div>
                    <span className="text-xl font-bold text-primary">20%</span>
                  </div>
                  <div className="flex justify-between items-end border-b-4 border-primary pb-1">
                    <div>
                      <span className="text-xl font-bold">Trend Popularity</span>
                    </div>
                    <span className="text-xl font-bold text-primary">10%</span>
                  </div>
                  <div className="text-[12px] text-slate-400 italic mt-4 leading-tight">
                    * Matches your high affinity for &quot;Mind-Bending Plots&quot; and &quot;Deep Purple Aesthetics&quot;.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer / Cast Preview */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-card mt-auto border-t border-primary/10 py-8 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-primary font-bold mb-6">Starring Cast</h3>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {[
              { name: 'Elena Vance', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHkqL_AZgLwzjylQ1qcHd70vPtxFtnWlBpQjnUQbpudtJWdqQyX1vLM0hFWG6rJ1WnIypEY6CuPoftufEN3xmcJm1QOWh6AQUadPPA571sO_b_9az6UpPXHpCbW8MPPCYg4z9jV6dsqEGGX3CHqSnnGkuOOhszqaWSwm1-H9u_jBHWzpDYcAW9Grfg1XaGhege9z5IPvr6a6uuvxaUWF4XHQoVdKa_tqXNXI4K_bANBW0phhtxw1hhJ20a0-swhzFsv-2tPiRDubg' },
              { name: 'Kaelen Moore', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqe9igDQD2ZKP9pxKuE7_IOJmhvGYGwhgfc-ISs8PIieF6DkGpck_UlQKI9ol3oLGtR_RzxIZEGxhP7SFX0YywfQcHlvDLr0-JduG3w6ztH04ALU7oaHt3hHSzDvfoBX7zNIQcsun_SspAV2hOF8U8-89QjomnzvkVY8MPJqebW3XZIa3uLvsStxBpS7ek9KMQUgSAmKeULxe6PKXMfvciIdUhGsGk0vuutQBTQGW04grtPKJCDIhigNxFsg3LJ5iviPXakBVtFY8' },
              { name: 'Saito Ken', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxc3uJR-18KpwLHx3SUBz_Md-Qb79iVfLlvgBSZxHyshVNkzFx_hP0Nc952mIoC3nxcdvmxoQvDlLFgvUAsT4LLLyTc1YVd1qPhlgkZXvfZ7l6vWmefPQCftTWwknKJ_hKKMf8j8WieDP-F70PWzo_Bv2KtHcZ6nbhGadzlQaBgPEtBik8UHV3dbkDUkJwx_EEPrzPJz3pJflhMSlYx1GYbwMrLp2r6YbBaV4p1nxMemjsIBVnqJ5sDolYy-mqYM4qSr5q_id7Hlo' },
              { name: 'Mara Jade', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbrNnTCve_Y7haLqmQIjeE98WBJTTFgNjsW2om8VkRjQksC_WecgvU_lhoA9RgqivwSAQAeBTmI_cGAqF47YgjTOD-7EjgPSecbSKEZf37ZXrBiAn4ThYZIE1Rk-QvjSCpbsJLrRy8uFcR13a1F3IdeACpXR1orgRNXZWOyYEalwggcrd57Rrp6siWZHAPdV9QMVIDn2aCX18_cbhsaivE9BVnNPpJnmXDgIKyTJhjAABVqvInhMU2l3BLTv6qJW2kGKNyRyfPByM' }
            ].map((cast, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center gap-2 min-w-[80px]"
              >
                <div
                  className="size-16 rounded-full bg-cover bg-center border-2 border-primary/20 cursor-pointer"
                  style={{ backgroundImage: `url("${cast.img}")` }}
                ></div>
                <p className="text-xs text-slate-300 font-medium">{cast.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
