import { useLanguage } from '../../contexts/LanguageContext'

const STAR_TILE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpolygon points='32%2C2 37%2C20 55%2C11 46%2C28 64%2C32 46%2C36 55%2C53 37%2C44 32%2C62 27%2C44 9%2C53 18%2C36 0%2C32 18%2C28 9%2C11 27%2C20' fill='none' stroke='rgba(216%2C184%2C102%2C0.09)' stroke-width='0.6'/%3E%3C/svg%3E")`

export default function PageHero({ title, subtitle, crumb }) {
  const { isRTL } = useLanguage()

  return (
    <>
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-up { animation: heroFadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <section
        className="relative overflow-hidden bg-[var(--landing-green)]"
        style={{ backgroundImage: STAR_TILE, backgroundSize: '64px 64px', paddingTop: '6.5rem', paddingBottom: '4rem' }}
      >
        {/* Layered atmosphere */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(11,31,23,0.72), rgba(23,71,55,0.35), rgba(23,71,55,0.75))' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(11,31,23,0.5), transparent)' }} />

        {/* Bottom gold hairline */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--landing-gold)]/35 to-transparent" />

        {/* Decorative corner ornaments */}
        <div className="absolute top-20 start-6 hidden lg:block opacity-30">
          <div className="w-6 h-6 border border-[var(--landing-gold)]/40 rotate-45" />
        </div>
        <div className="absolute top-20 end-6 hidden lg:block opacity-30">
          <div className="w-6 h-6 border border-[var(--landing-gold)]/40 rotate-45" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          {crumb && (
            <p
              className={`hero-up text-[9px] uppercase tracking-[0.42em] mb-5 ${isRTL ? 'text-right font-urdu tracking-normal text-xs' : ''}`}
              style={{ animationDelay: '0.05s', color: 'rgba(216,184,102,0.8)' }}
            >
              {crumb}
            </p>
          )}

          {/* Gold rule above heading */}
          <div
            className="hero-up h-px w-10 bg-[var(--landing-gold)]/45 mb-5"
            style={{ animationDelay: '0.1s', ...(isRTL ? { marginLeft: 'auto' } : {}) }}
          />

          {/* Heading */}
          <h1
            className={`hero-up font-display text-[var(--landing-cream)] ${isRTL ? 'text-right font-urdu' : 'leading-[1.08]'}`}
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
              lineHeight: isRTL ? 1.95 : 1.08,
              animationDelay: '0.14s',
              textShadow: '0 2px 32px rgba(11,31,23,0.6)',
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              className={`hero-up max-w-2xl leading-relaxed ${isRTL ? 'mt-10 text-right font-urdu text-base leading-loose' : 'mt-4 text-[0.9375rem]'}`}
              style={{ animationDelay: '0.22s', color: 'rgba(247,240,221,0.78)', ...(isRTL ? { marginLeft: 'auto' } : {}) }}
            >
              {subtitle}
            </p>
          )}

          {/* Bottom ornament */}
          <div
            className="hero-up mt-7 flex items-center gap-3"
            style={{ animationDelay: '0.28s' }}
          >
            <div className="h-px w-8 bg-[var(--landing-gold)]/35" />
            <div className="h-1.5 w-1.5 border border-[var(--landing-gold)]/45 rotate-45 flex-shrink-0" />
            <div className="h-px w-8 bg-[var(--landing-gold)]/35" />
          </div>
        </div>
      </section>
    </>
  )
}
