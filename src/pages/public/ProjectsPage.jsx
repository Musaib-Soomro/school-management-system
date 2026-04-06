import { useLanguage } from '../../contexts/LanguageContext'
import { t as T } from '../../data/translations'
import { projectsContent } from '../../data/publicContent'
import PublicLayout from '../../components/public/PublicLayout'
import PageHero from '../../components/public/PageHero'

const STAR_TILE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpolygon points='32%2C2 37%2C20 55%2C11 46%2C28 64%2C32 46%2C36 55%2C53 37%2C44 32%2C62 27%2C44 9%2C53 18%2C36 0%2C32 18%2C28 9%2C11 27%2C20' fill='none' stroke='rgba(216%2C184%2C102%2C0.08)' stroke-width='0.6'/%3E%3C/svg%3E")`

export default function ProjectsPage() {
  const { isRTL, t } = useLanguage()

  return (
    <PublicLayout>
      <PageHero
        title={t(projectsContent.title)}
        subtitle={t(projectsContent.overview)}
        crumb={`${t(T.home)} / ${t(T.projects)}`}
      />

      <section className="bg-[var(--landing-cream)] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className={`mb-12 ${isRTL ? 'text-right' : ''}`}>
            <p className={`text-[var(--landing-green)]/50 text-[9px] uppercase tracking-[0.42em] mb-2 ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`}>
              {t(T.ourProjects)}
            </p>
            <h2
              className={`font-display text-[var(--landing-ink)] ${isRTL ? 'font-urdu' : ''}`}
              style={{ fontSize: 'clamp(1.7rem, 3vw, 2.6rem)', lineHeight: 1.15 }}
            >
              {t(T.welfare)}
            </h2>
            <div className={`mt-3 h-px w-12 bg-[var(--landing-gold)]/45 ${isRTL ? 'ms-auto' : ''}`} />
          </div>

          {/* Al Mahmood Social Welfare — featured card */}
          <div
            className="relative overflow-hidden rounded-2xl shadow-[0_24px_72px_rgba(11,31,23,0.12)]"
            style={{ backgroundImage: STAR_TILE, backgroundSize: '64px 64px' }}
          >
            {/* Dark green base */}
            <div className="absolute inset-0 bg-[var(--landing-green)]" />
            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(11,31,23,0.5),transparent)]" />

            {/* Gold top thread */}
            <div className="relative h-px bg-gradient-to-r from-transparent via-[var(--landing-gold)]/55 to-transparent" />

            <div className={`relative px-8 sm:px-12 py-12 ${isRTL ? 'text-right' : ''}`}>
              {/* Project label */}
              <p className={`text-[9px] uppercase tracking-[0.42em] text-[var(--landing-gold)]/60 mb-4 ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`}>
                {t(T.projects)} · 01
              </p>

              {/* Title */}
              <h2
                className={`font-display text-[var(--landing-cream)] leading-tight ${isRTL ? 'font-urdu' : ''}`}
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1 }}
              >
                {t(projectsContent.alMahmood.title)}
              </h2>

              {/* Gold ornament */}
              <div className={`my-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="h-px w-12 bg-[var(--landing-gold)]/40" />
                <div className="h-1.5 w-1.5 border border-[var(--landing-gold)]/50 rotate-45 flex-shrink-0" />
                <div className="h-px w-12 bg-[var(--landing-gold)]/40" />
              </div>

              {/* Summary */}
              <p
                className={`max-w-2xl leading-relaxed ${isRTL ? 'font-urdu text-lg leading-loose' : 'text-base'}`}
                style={{ color: 'rgba(247,240,221,0.82)', ...(isRTL ? { marginLeft: 'auto' } : {}) }}
              >
                {t(projectsContent.alMahmood.summary)}
              </p>

              {/* Coming soon notice */}
              <div className={`mt-8 inline-flex items-center gap-2.5 border border-[var(--landing-gold)]/25 rounded-full px-4 py-2 ${isRTL ? 'font-urdu text-sm' : ''}`}>
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--landing-gold)]/60 animate-pulse" />
                <span className={`text-[10px] ${isRTL ? '' : 'uppercase tracking-[0.22em]'}`} style={{ color: 'rgba(247,240,221,0.65)' }}>
                  {isRTL ? 'مزید تفصیل جلد دستیاب ہوگی' : 'More details coming soon'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </PublicLayout>
  )
}
