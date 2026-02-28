import { getTrending } from '@/lib/api';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import { TopPicksBento } from '@/components/home/TopPicksBento';
import { HomeNavBar } from '@/components/home/HomeNavBar';
import Link from 'next/link';

export default async function HomePage() {
  // Fetch real data on the server
  let trendingMovies = [];
  try {
    const response = await getTrending('all', 'day');
    trendingMovies = response.results;
  } catch (e) {
    console.error("Error fetching trending data inside Server Component:", e);
  }

  // Fallback to placeholder if backend fails
  const topPicks = trendingMovies.length > 5 ? trendingMovies : [];
  const heroMovie = topPicks.length > 0 ? topPicks[0] : null;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-dark text-slate-100 font-display">

      {/* Extracted Client Navbar */}
      <HomeNavBar />

      <main className="flex-1">
        {/* Extracted Client Hero section passing real TMDB data */}
        <HomeHeroSection trendingMovie={heroMovie} />

        {/* Extracted Client Bento Grid passing real TMDB data */}
        <TopPicksBento topPicks={topPicks} />

        {/* Personalized Discovery Section - Premium AI Overhaul */}
        <section className="relative px-6 lg:px-12 py-32 overflow-hidden">
          {/* Subtle background effects */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] -z-10"></div>

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-20">
            <div className="w-full lg:w-1/2 space-y-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full premium-blur bg-white/5 border border-white/10 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                <span className="text-primary font-black tracking-[0.2em] uppercase text-[10px]">MovieWine Intelligence</span>
              </div>

              <div className="space-y-6">
                <h2 className="text-5xl lg:text-7xl font-serif text-white leading-[0.9] tracking-tighter">
                  Not just Search. <br />
                  <span className="text-secondary italic">Discovery.</span>
                </h2>
                <p className="text-white/60 text-xl leading-relaxed max-w-lg font-medium">
                  Tired of scrolling? Converge your mood, genre, and time into a single prompt. Our AI architect crafts your perfect cinematic evening.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <button className="gold-glow bg-primary text-background-dark px-10 py-4 rounded-2xl font-black text-sm tracking-widest transition-all scale-100 hover:scale-105 active:scale-95 shadow-2xl">
                  LAUNCH AI CHAT
                </button>
                <div className="flex -space-x-3 items-center">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background-dark bg-background-light overflow-hidden shadow-xl">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover opacity-80" />
                    </div>
                  ))}
                  <span className="pl-4 text-xs font-black text-white/40 tracking-widest uppercase italic">Used by 2k+ Cinephiles</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative">
              {/* The Holographic Container */}
              <div className="relative aspect-square max-w-[500px] mx-auto group">
                {/* Rotating Inner Rings */}
                <div className="absolute inset-x-4 inset-y-4 border border-white/5 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-x-12 inset-y-12 border border-primary/10 rounded-full animate-reverse-spin border-dashed"></div>

                {/* Main Glass Card */}
                <div className="absolute inset-0 premium-blur bg-white/[0.03] rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 radial-mask bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>

                  {/* AI Pulse Avatar */}
                  <div className="relative flex flex-col items-center gap-6">
                    <div className="w-32 h-32 rounded-full bg-background-dark flex items-center justify-center relative group-hover:scale-110 transition-transform duration-700">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                      <span className="material-symbols-outlined text-primary text-5xl fill-1 z-10 drop-shadow-[0_0_15px_rgba(244,192,37,0.8)]">auto_awesome</span>

                      {/* Floating bits */}
                      <span className="absolute -top-4 -right-4 w-3 h-3 bg-secondary rounded-full animate-float shadow-[0_0_10px_rgba(157,78,221,0.5)]"></span>
                      <span className="absolute -bottom-2 -left-6 w-2 h-2 bg-primary rounded-full animate-float-delayed shadow-[0_0_10px_rgba(244,192,37,0.5)]"></span>
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-white text-lg font-serif italic">"I'm feeling nostalgic..."</p>
                      <div className="h-[2px] w-24 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                      <p className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase">Processing Intent</p>
                    </div>
                  </div>

                  {/* UI Chat Bubbles Floating */}
                  <div className="absolute top-12 -right-8 premium-blur bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] text-white/80 max-w-[150px] shadow-2xl animate-float">
                    How about a 90's Neo-noir?
                  </div>
                  <div className="absolute bottom-12 -left-8 premium-blur bg-primary/10 border border-primary/20 rounded-2xl p-4 text-[10px] text-primary max-w-[150px] shadow-2xl animate-float-delayed">
                    Perfect. Curate the list.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer - Professional Redesign */}
      <footer className="w-full border-t border-white/5 bg-[#0A0A0A] px-6 py-20 lg:px-12 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <Link href="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
              MOVIE<span className="text-primary italic">WINE</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">
              Curating the finest cinematic experiences through artificial intelligence and passion.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black tracking-widest text-white uppercase">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/movies" className="text-white/40 hover:text-primary transition-colors text-sm font-medium">Browse Movies</Link></li>
              <li><Link href="/tv-shows" className="text-white/40 hover:text-primary transition-colors text-sm font-medium">TV Series</Link></li>
              <li><Link href="/ai-discovery" className="text-white/40 hover:text-primary transition-colors text-sm font-medium">AI Discovery</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black tracking-widest text-white uppercase">Community</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-white/40 hover:text-primary transition-colors text-sm font-medium">Discussion</Link></li>
              <li><Link href="#" className="text-white/40 hover:text-primary transition-colors text-sm font-medium">Discord</Link></li>
              <li><Link href="#" className="text-white/40 hover:text-primary transition-colors text-sm font-medium">Newsletter</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black tracking-widest text-white uppercase">Social</h4>
            <div className="flex items-center gap-4">
              {['Twitter', 'Instagram', 'Dribbble'].map(social => (
                <Link key={social} href="#" className="w-10 h-10 rounded-full flex items-center justify-center premium-blur bg-white/5 border border-white/10 hover:border-primary/50 text-white/40 hover:text-primary transition-all">
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-current rounded-sm opacity-20"></div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[10px] font-black tracking-widest uppercase">
            © {new Date().getFullYear()} MOVIEWINE STUDIOS. BUILT FOR CINEPHILES.
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-white/20 hover:text-white transition-colors text-[10px] font-black tracking-widest uppercase">Privacy</Link>
            <Link href="#" className="text-white/20 hover:text-white transition-colors text-[10px] font-black tracking-widest uppercase">Terms</Link>
            <Link href="#" className="text-white/20 hover:text-white transition-colors text-[10px] font-black tracking-widest uppercase">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
