import { getTrending, fetchFromBackend, TMDBResponse } from '@/lib/api';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import { TopPicksBento } from '@/components/home/TopPicksBento';
import { HomeNavBar } from '@/components/home/HomeNavBar';
import Link from 'next/link';
import WhySection from '@/components/home/WhySection';
import TopTenSlider from '@/components/home/TopTenSlider';

export default async function HomePage() {
  // Fetch trending all (for hero + top picks), movies, and tv in parallel
  let trendingAll: any[] = [];
  let trendingMovies: any[] = [];
  let trendingSeries: any[] = [];
  let recommendedMovies: any[] = [];
  let recommendedSeries: any[] = [];

  try {
    const [allRes, moviesRes, seriesRes, recMoviesRes, recSeriesRes] = await Promise.all([
      getTrending('all', 'day'),
      getTrending('movie', 'week'),
      getTrending('tv', 'week'),
      fetchFromBackend<TMDBResponse<any>>('/tmdb/discover/movie', { sort_by: 'vote_average.desc', 'vote_count.gte': 1000, page: 1 }),
      fetchFromBackend<TMDBResponse<any>>('/tmdb/discover/tv', { sort_by: 'vote_average.desc', 'vote_count.gte': 500, page: 1 }),
    ]);
    trendingAll = allRes.results;
    trendingMovies = moviesRes.results;
    trendingSeries = seriesRes.results;
    recommendedMovies = recMoviesRes.results;
    recommendedSeries = recSeriesRes.results;
  } catch (e) {
    console.error('Error fetching trending data:', e);
  }

  const topPicks = trendingAll.length > 5 ? trendingAll : [];
  // Use the first 8 trending items as hero slides
  const heroSlides = topPicks.slice(0, 8).filter((m: any) => m.backdrop_path);


  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background-dark text-slate-100 font-display overflow-x-hidden">
      {/* Header — unchanged */}
      <HomeNavBar />
      
      <main className="flex-1 flex flex-col">
        {/* Hero section handles its own internal padding/centering */}
        <HomeHeroSection slides={heroSlides} />

        {/* Regular sections use consistent padding and max-width */}
        <div className="flex flex-col gap-16 md:gap-24 lg:gap-32 pb-32">
          <section className="max-content-width px-6 lg:px-12">
            <TopTenSlider topMovies={trendingMovies} topSeries={trendingSeries} />
          </section>

          <section className="max-content-width px-6 lg:px-12">
            <div className="mb-12">
              <h2 className="text-3xl md:text-5xl font-serif italic text-white mb-4">Specially For You</h2>
              <p className="text-slate-400 max-w-2xl">Curated masterpieces and hidden gems our curators love.</p>
            </div>
            <TopTenSlider topMovies={recommendedMovies} topSeries={recommendedSeries} />
          </section>

          <section className="max-content-width px-6 lg:px-12">
            <TopPicksBento topPicks={topPicks} />
          </section>

          <section className="max-content-width px-6 lg:px-12">
            <WhySection />
          </section>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: '#080703',
        padding: '64px 24px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle grid texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Main footer links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 48, marginBottom: 56 }}>
            {/* Brand */}
            <div>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>
                  MOVIE<span style={{ color: '#f4c025', fontStyle: 'italic' }}>WINE</span>
                </span>
              </Link>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', lineHeight: 1.7, marginTop: 14, maxWidth: 200 }}>
                Curating cinema through AI and passion.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 style={{ color: '#fff', fontSize: '10px', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 16 }}>Platform</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Browse Movies', href: '/movies' },
                  { label: 'Series', href: '/series' },
                  { label: 'Community', href: '/community' },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}
                      className="hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 style={{ color: '#fff', fontSize: '10px', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 16 }}>Community</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Discussions', href: '/community' },
                  { label: 'Discord', href: '#' },
                  { label: 'Newsletter', href: '#' },
                ].map(link => (
                  <li key={link.label}>
                    <Link href={link.href} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}
                      className="hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 style={{ color: '#fff', fontSize: '10px', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 16 }}>Follow Us</h4>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { label: 'X', icon: 'language' },
                  { label: 'IG', icon: 'photo_camera' },
                  { label: 'DC', icon: 'forum' },
                ].map(s => (
                  <Link key={s.label} href="#" style={{
                    width: 38, height: 38, borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, color 0.2s',
                    background: 'rgba(255,255,255,0.04)',
                  }}
                    className="hover:border-primary hover:text-primary"
                    title={s.label}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{s.icon}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: 28,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              © {new Date().getFullYear()} MovieWine Studios. Built for Cinephiles.
            </p>
            <div style={{ display: 'flex', gap: 28 }}>
              {['Privacy', 'Terms', 'Contact'].map(l => (
                <Link key={l} href="#" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none' }}
                  className="hover:text-white/60">
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
