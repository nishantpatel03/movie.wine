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

const scaleOnHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3 } }
};

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-dark text-slate-100 font-display">
      {/* Glassmorphic Top Navigation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 z-50 w-full px-6 py-4"
      >
        <div className="max-w-7xl mx-auto glassmorphism rounded-xl px-8 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">movie_filter</span>
              <h2 className="text-slate-100 text-2xl font-bold tracking-tight font-serif italic">MovieWine</h2>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#" className="text-slate-300 hover:text-primary text-sm font-medium transition-colors">Movies</Link>
              <Link href="#" className="text-slate-300 hover:text-primary text-sm font-medium transition-colors">TV Shows</Link>
              <Link href="#" className="text-slate-300 hover:text-primary text-sm font-medium transition-colors">Community</Link>
              <Link href="#" className="text-slate-300 hover:text-primary text-sm font-medium transition-colors">My List</Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 text-xl">search</span>
              <input
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-6 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 w-64 placeholder:text-slate-500"
                placeholder="Search titles, actors, genres..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center justify-center p-2 text-slate-300 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(244,192,37,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-background-dark px-6 py-2 rounded-lg font-bold text-sm transition-all"
              >
                SUBSCRIBE
              </motion.button>
              <div className="h-10 w-10 rounded-full border border-primary/30 p-0.5">
                <img className="h-full w-full rounded-full object-cover" alt="User Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq0dvK1XsgMqzoHnI4vipCZqXBuCr_tUh1PKtz7QhJchLHrmz2zBohdvwKPh5vzJmquxA3L3oh01ALMkomh4bWvnBfkEkK2BJhm9p52SUGNyuZ2U3IUf7nPVKg-o237VgL0ocml0jQf_3FDMRGjl4N4z_KUCOST7lLsXUyCklYBor3t_g37CoCo1EnOeEQMLI-n3lrKpRiVChBjMt9zauUknaoon1lRYkK3lvkqSZZe0r1HpoxXVhMMYxCStWylG957IFleNzkqgg" />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">

        {/* Hero Carousel Section */}
        <section className="relative h-[90vh] w-full">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img className="h-full w-full object-cover" alt="Hero Background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2okTzokXQRyCvk9QEgS2_g9rUVlH5oBC1Uu2qS17pyvFwoS_MGwXVGWrd1fOBmQ-9gUqSXrhGlGGL2qhJGExMJ1-wptu6YzOb0LOgZMmIq7C2QGg5gj003LWR1XDt0b9SB4wbZy1YWWFyurOvWVyqbg-jaX_qVGVm_b-jGAwId_x-tZb8MXwqrd52jXIly44LxO37_adtCDTbf7K4YUPhvtXe9PHmNAOOksLVL8q_ZgljVSGLo7ds0Ka0Hn-WxBVdm-1aZik7Zhg" />
            <div className="absolute inset-0 hero-gradient"></div>
            <div className="absolute inset-0 bg-black/20"></div>
          </motion.div>

          <div className="relative h-full max-w-7xl mx-auto px-10 flex flex-col justify-end pb-32">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-2xl space-y-6"
            >
              <motion.div variants={fadeInUp} className="flex items-center gap-3">
                <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded text-xs font-bold tracking-widest uppercase">Trending Now</span>
                <span className="text-slate-400 text-sm font-medium">PG-13 • 2h 45m • Sci-Fi / Drama</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-7xl font-serif italic text-white leading-tight text-glow">
                The Obsidian <br /> Chronicles
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-slate-300 text-lg leading-relaxed max-w-xl">
                In a world where light is a rare commodity, one explorer journeys into the deepest shadows of the void to find the truth behind the Great Eclipse.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex items-center gap-4 pt-4">
                <motion.button
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  variants={scaleOnHover}
                  className="bg-primary text-background-dark px-10 py-4 rounded-xl font-bold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined fill-1">play_arrow</span>
                  WATCH NOW
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-md text-white border border-white/10 px-10 py-4 rounded-xl font-bold flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined">add</span>
                  MY LIST
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute right-10 bottom-32 flex flex-col gap-4">
            <motion.div animate={{ scaleY: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-12 bg-primary rounded-full origin-bottom"></motion.div>
            <div className="w-1.5 h-8 bg-white/20 rounded-full hover:bg-white/40 cursor-pointer transition-colors"></div>
            <div className="w-1.5 h-8 bg-white/20 rounded-full hover:bg-white/40 cursor-pointer transition-colors"></div>
          </div>
        </section>

        {/* Voice of the Cinephile Section */}
        <section className="py-24 px-10 max-w-7xl mx-auto overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-serif italic text-white">Voice of the Cinephile</h2>
              <p className="text-slate-400 text-lg max-w-xl">Dynamic community insights and trending discussions from our global audience of film enthusiasts.</p>
            </div>
            <button className="flex items-center gap-2 text-primary font-bold hover:underline">
              VIEW ALL DISCUSSIONS
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </motion.div>

          {/* Masonry Style Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            {/* Community Card 1 */}
            <motion.div variants={fadeInUp} className="break-inside-avoid glassmorphism p-6 rounded-xl hover:shadow-[0_0_30px_rgba(74,29,150,0.2)] transition-all group">
              <div className="flex items-center gap-3 mb-6">
                <img className="h-10 w-10 rounded-full object-cover" alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBs5CQoJ2uOIkbTxx80_oR2rzMuMNe75MfWJ6GJKwRNImDkpGSUMdVo0jYXFg3W29y_bEfI7X9goR1rDVUlqkSHHWvCIJWKhDkPMsmOWSWxehqb_HLdv84oNP1IbUkxDDDoh_DJRl0EkfSqt9ygN6aovAF5YhdjmAsDjB5oqfSMPr0KuWif_OPvDCpHje6Cp6Jd9kvmzpj9n5_ntn7sXpF1d_negNFLXzPuS-CJgeBF1i89B7ptjp1UkUM7OT6VeuO_I0RBw-H5Yrg" />
                <div>
                  <p className="text-white font-bold text-sm">@CinemaBuff99</p>
                  <p className="text-slate-500 text-xs">2 hours ago</p>
                </div>
              </div>
              <blockquote className="text-slate-100 text-lg font-serif italic mb-6 leading-relaxed">
                &quot;A masterpiece of cinematography. The way they used natural lighting in the second act is something we haven&apos;t seen since Tarkovsky.&quot;
              </blockquote>
              <div className="relative mb-6 overflow-hidden rounded-lg aspect-video">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Scene" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoi9j6kPM6-Dzg5o-I1dLd2PBt5DFebdQvizwioyOEL2ZiQmmh9n48Zl5__eHaqi73K0rc9LDJW03bF34fKspB-oEcsw6P6ResL-69vH1sp_7xPyGfBBLg7iuX8SM5qct0Tk791wZ1Fi9p9VkzVSwk9bbufRUmXlJMq7btnGZWTcry4_xn5yUhCuItcPHp7bR-DZTCi9gNJ1vhxdOryYQedpV0uPyAsaBh-B5yVxk7tVD34dbkKKDScbj1FBydyTrAnqn9t_V2YmU" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                  <span className="text-primary">Masterpiece</span>
                  <span className="text-accent-purple">Critique</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '85%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full sentiment-bar"
                  ></motion.div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>CRITIC SENTIMENT</span>
                  <span>85% POSITIVE</span>
                </div>
              </div>
            </motion.div>

            {/* Community Card 2 */}
            <motion.div variants={fadeInUp} className="break-inside-avoid glassmorphism p-6 rounded-xl hover:shadow-[0_0_30px_rgba(244,192,37,0.1)] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <img className="h-10 w-10 rounded-full object-cover" alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMuSX4GcHJVUItgysbiyfC4N0G-8hzZQAj5AQZLnTAbULuS9gZdputUdpxiVPATrns1b4kVjVNCFDEcan47wGNSaJzt8qzrnmcsh2y-MvTJgZ_QtIGX4Lfa0wTcUJK6BKhVnlgr-17jxphEKzLEha-l8XxAVgKzZl-JCtUZIdMEHuZxF2kOGAIT2yg_3HlZnKTpB7kOa_8-zOmucZKRN1Wh3LaTCrgDMuid6m7gEUIbkXFNf6usU-zV1M2T0uO6FQ4AeEM4UNXYeY" />
                <div>
                  <p className="text-white font-bold text-sm">@DirectorCut</p>
                  <p className="text-slate-500 text-xs">5 hours ago</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Discussion: The underlying metaphor of the wine cellar in &quot;Vintage Dreams&quot; represents more than just aging—it&apos;s a commentary on the preservation of memories in a digital age. What do you all think?
              </p>
              <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                <div className="flex items-center gap-1 text-slate-400 text-xs hover:text-primary cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-sm">thumb_up</span> 1.2k
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-xs hover:text-primary cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-sm">chat_bubble</span> 482
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-xs hover:text-primary cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-sm">share</span> Share
                </div>
              </div>
            </motion.div>

            {/* Community Card 3 */}
            <motion.div variants={fadeInUp} className="break-inside-avoid glassmorphism p-6 rounded-xl hover:shadow-[0_0_30px_rgba(74,29,150,0.2)] transition-all group">
              <div className="flex items-center gap-3 mb-6">
                <img className="h-10 w-10 rounded-full object-cover" alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeVjw67VsyILtoCgHYrFq87GAfcoKmcbLthJB9Aw1T8beCcFi9H9bIBuH0iv59Y6RmaKms-qGDWMONi7SjYxIEw62rPvlu8PyG8DrXI6AUijc9SQco1uvXzI2FFgUOwyTP7BeWxbWQKTlqKmrIXP_AkycsAXj9RqDymIFio5Fbwmn_x2uqipFRlyLdsL5Foc91ewYaoiguIq74x237DTztawSMapo6NrQ-ajb5E-ZwkAgPPAOXKiSae0mowjGUo4ISydh-ZKpQyaQ" />
                <div>
                  <p className="text-white font-bold text-sm">@TheGreatReviewer</p>
                  <p className="text-slate-500 text-xs">Yesterday</p>
                </div>
              </div>
              <blockquote className="text-slate-100 text-lg font-serif italic mb-6 leading-relaxed">
                &quot;The score by Hanz Zimmer here is ethereal. It breathes with the characters.&quot;
              </blockquote>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '94%' }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-full sentiment-bar"
                  ></motion.div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>AUDIO IMMERSION</span>
                  <span>94% EXCELLENCE</span>
                </div>
              </div>
            </motion.div>

            {/* Community Card 4 */}
            <motion.div variants={fadeInUp} className="break-inside-avoid glassmorphism p-6 rounded-xl hover:shadow-[0_0_30px_rgba(244,192,37,0.1)] transition-all group">
              <div className="relative mb-4 overflow-hidden rounded-lg aspect-square">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Scene" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCER2Vmr68AgZU425c3K6MwCGCN0FsPT1yvi6WcapL2YTTgw3tsvx3Kw9Zmqzvs1Z79-2eXtOag0r2i1w5HGDosRMveY2ACjzZo4icjmpla7eA7nQ_VOtF02sWu0e7MNKJVBh2VdXNH0WiBvT2y0EuImcRrpT3uaXGkmpgi4uIJD-GxM9Ff1OL9wfC5eJssrkDvHMSL1J-QrcjiloWeYwmriYAQyvuuwxy2O9buZxCWVlQ-yzuTWvS-1Bd61HOeaZxTZm39NKkIRYs" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <img className="h-8 w-8 rounded-full object-cover" alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqGQiZSr4yY7N6EQ0tbUJzMeuSxISWgwkSAT2ALI1qqut6nuOIAa5BIMNID08LHcPV2zZRdyty71Qfk34RCllEn5qFe16Z2pp2DkQDlRm-t2iZXM4mpamUqrG-a4sNk7DJvU3qsZZZ3575pW6wIv5J76MKw5tHZ82PBwtileR5gIadTUW4UNFXMmb_djhDX0BEfAGfuG2a36kEnWMbwpZ_gtX0MoiF09tJlYRlOQdfSZ92ykL_4-onk8GPoRnoYhcIJR5LeYEMGUs" />
                <p className="text-slate-300 font-bold text-sm">@OldSchoolCool</p>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed mb-4">Rediscovering the golden era of French Noir today. &quot;The Midnight Shadows&quot; is a 10/10.</p>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '70%' }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="h-full bg-primary"
                ></motion.div>
              </div>
            </motion.div>

            {/* Community Card 5 */}
            <motion.div variants={fadeInUp} className="break-inside-avoid glassmorphism p-6 rounded-xl hover:shadow-[0_0_30px_rgba(74,29,150,0.2)] transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] bg-accent-purple/40 text-accent-purple border border-accent-purple/50 px-2 py-0.5 rounded uppercase font-bold">Trending Theory</span>
                <span className="material-symbols-outlined text-slate-500 text-lg cursor-pointer hover:text-white transition-colors">more_horiz</span>
              </div>
              <h3 className="text-white font-bold mb-3">Is Marcus actually a clone?</h3>
              <p className="text-slate-400 text-xs mb-4">Based on the reflections in the final scene of Episode 4...</p>
              <div className="flex -space-x-2">
                <img className="h-6 w-6 rounded-full border-2 border-background-dark object-cover" alt="Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl72qjfkaIPa6Ll9Cyt7aw71V3ogW7KSwZf1eGhyrodJxGClhoJ3Xuo9b1NkgKFFf2olntzxfdGkDhwoa3HxAzKgcQ6dnZ3E56wJR7XBNI9oREho_dXzhIqfXRXLMwyZmNAxyV861NZ7OvccSktKmWjrMSGlBd5JkycbUs5DM-zVNsa3LiEuQavGM9ag3y5b2pWt8IVwg8vBc7H4G5JX7AIjtIL3-WxYaoC-yHt_GXDOFi3O5dFXT1ctMQY7c9cXI6yVaheHAt6Fg" />
                <img className="h-6 w-6 rounded-full border-2 border-background-dark object-cover" alt="Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXyH1ozzjjjrM58AMizeV7_7kCOOex6N_P2w0x_YgMAOWHstMY7lkQ2kaSPHG0OoyoQ9VGGqeKAl1zQsfGWgBCjP5rlSnUAuiRlc81e5zDrphkJ8jnN_Or7hhQR41pcFjwWTUKv0Baxyt8sW6BAJdd63UPpaWUVJXdnHKkJkkES0C690EynDq9cdF01tG8ZgbCMY7Ig4hkPK_fN7TIwccdr67jwxKCsLMnNP-C2_cQRS--6YPRmojP8nnZWYLAL6wb8sKe0DbLoxU" />
                <img className="h-6 w-6 rounded-full border-2 border-background-dark object-cover" alt="Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd6TK1cUOuYmGesj0hnQRT13onPbMWxJQxE6mb1o4IR4ueRi1LfpjLtaBkNN6XG9NNAY6YCZYvMXnMwlm4PbcBGKEjuYsJ18Ni5Q3ibfKct4VI428u__Z9_Odm0DyvpLsDL1awV8YaROlbrWxyfv7Fhx3zvokY0fz1qv0CeMLonhzHCCJn6AWH617iBSzkIJYZG6FLmYHBruzq_WF4linK4mPxe_z2mW1DrP6fYOpY-yTr-oYApzdr2t8PRTO16oLmlq1Ss-qNpts" />
                <div className="h-6 w-6 rounded-full bg-white/10 border-2 border-background-dark flex items-center justify-center text-[8px] text-white">+12</div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Newsletter/CTA Section */}
        <section className="max-w-7xl mx-auto px-10 py-24">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-accent-purple/20 to-primary/10 border border-white/5 p-12 md:p-20 text-center space-y-8"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-purple/20 blur-[120px] translate-x-1/3 translate-y-1/3"></div>

            <h2 className="text-5xl font-serif italic text-white relative z-10">Join the Connoisseurs</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto relative z-10">Get curated film recommendations, early access to premieres, and exclusive community insights delivered to your inbox.</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto relative z-10">
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter your email address"
                type="email"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-primary text-background-dark font-bold px-8 py-4 rounded-xl whitespace-nowrap"
              >
                JOIN NOW
              </motion.button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-background-dark py-16 px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">movie_filter</span>
              <h2 className="text-white text-2xl font-bold font-serif italic">MovieWine</h2>
            </div>
            <p className="text-slate-500 max-w-xs leading-relaxed">The premier destination for the discerning viewer. Experience cinema like never before.</p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary transition-colors border border-white/5">
                <span className="material-symbols-outlined text-xl">share</span>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-primary transition-colors border border-white/5">
                <span className="material-symbols-outlined text-xl">public</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Movies</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">TV Shows</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Documentaries</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Awards</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Community</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Forums</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Member Stories</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Guidelines</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Devices</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Account</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 text-xs">© 2024 MovieWine Premium Streaming. All rights reserved.</p>
          <div className="flex gap-8 text-slate-600 text-xs uppercase tracking-widest">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookie Settings</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
