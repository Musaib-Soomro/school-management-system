import { useLanguage } from '../../contexts/LanguageContext'
import { t as T } from '../../data/translations'
import { speechesLessons, founderName } from '../../data/publicContent'
import PublicLayout from '../../components/public/PublicLayout'
import PageHero from '../../components/public/PageHero'

const STAR_TILE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpolygon points='32%2C2 37%2C20 55%2C11 46%2C28 64%2C32 46%2C36 55%2C53 37%2C44 32%2C62 27%2C44 9%2C53 18%2C36 0%2C32 18%2C28 9%2C11 27%2C20' fill='none' stroke='rgba(216%2C184%2C102%2C0.07)' stroke-width='0.6'/%3E%3C/svg%3E")`

function GhostLectureCard({ index, isRTL, label }) {
  return (
    <div className="group relative bg-white border border-[var(--landing-ink)]/8 rounded-2xl overflow-hidden">
      {/* Decorative arch cap */}
      <div className="bg-[var(--landing-green)]/4 px-6 py-5" style={{ borderTopLeftRadius: '9999px', borderTopRightRadius: '9999px' }}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[var(--landing-gold)]/10 flex items-center justify-center flex-shrink-0">
            <span className="font-mono text-[9px] text-[var(--landing-gold)]/55 tracking-wider">{String(index + 1).padStart(2, '0')}</span>
          </div>
          <div className="flex-1">
            <div className="h-2 bg-[var(--landing-ink)]/8 rounded-full w-3/4" />
            <div className="h-1.5 bg-[var(--landing-ink)]/5 rounded-full w-1/2 mt-1.5" />
          </div>
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-1.5">
          <div className="h-2 bg-[var(--landing-ink)]/6 rounded-full" />
          <div className="h-2 bg-[var(--landing-ink)]/4 rounded-full w-4/5" />
          <div className="h-2 bg-[var(--landing-ink)]/4 rounded-full w-2/3" />
        </div>
        <p className={`mt-4 text-[9px] uppercase tracking-[0.28em] text-[var(--landing-ink)]/25 ${isRTL ? 'text-right font-urdu tracking-normal text-xs' : ''}`}>
          {label}
        </p>
      </div>
    </div>
  )
}

function SectionHeading({ children, isRTL }) {
  return (
    <div className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
      <h2
        className={`font-display text-[var(--landing-ink)] ${isRTL ? 'font-urdu' : ''}`}
        style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', lineHeight: 1.2 }}
      >
        {children}
      </h2>
      <div className="mt-2.5 h-px w-10 bg-[var(--landing-gold)]/40" style={isRTL ? { marginLeft: 'auto' } : {}} />
    </div>
  )
}

export default function SpeechesPage() {
  const { isRTL, t } = useLanguage()

  return (
    <PublicLayout>
      <PageHero
        title={t(speechesLessons.title)}
        subtitle={t(speechesLessons.overview)}
        crumb={`${t(T.home)} / ${t(T.speechesLessons)}`}
      />

      <section className="bg-[var(--landing-cream)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Founder lectures */}
          <div className="mb-16">
            <p className={`text-[9px] uppercase tracking-[0.38em] text-[var(--landing-green)]/45 mb-2 ${isRTL ? 'text-right font-urdu tracking-normal text-xs' : ''}`}>
              {t(T.founderLectures)}
            </p>
            <SectionHeading isRTL={isRTL}>
              {t(founderName)}
            </SectionHeading>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map(i => (
                <GhostLectureCard key={i} index={i} isRTL={isRTL} label={t(T.comingSoon)} />
              ))}
            </div>
          </div>

          {/* Guest scholars */}
          <div className="mb-16">
            <p className={`text-[9px] uppercase tracking-[0.38em] text-[var(--landing-green)]/45 mb-2 ${isRTL ? 'text-right font-urdu tracking-normal text-xs' : ''}`}>
              {t(T.recentLectures)}
            </p>
            <SectionHeading isRTL={isRTL}>{t(T.guestScholars)}</SectionHeading>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map(i => (
                <GhostLectureCard key={i} index={i + 3} isRTL={isRTL} label={t(T.comingSoon)} />
              ))}
            </div>
          </div>

          {/* Coming soon — atmospheric notice */}
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{ backgroundImage: STAR_TILE, backgroundSize: '64px 64px' }}
          >
            <div className="absolute inset-0 bg-[var(--landing-green)]" style={{ opacity: 0.97 }} />
            <div className="h-0.5 bg-gradient-to-r from-transparent via-[var(--landing-gold)]/45 to-transparent" />
            <div className={`relative px-8 py-10 ${isRTL ? 'text-right' : 'text-center'}`}>
              <div className="flex items-center gap-3 mb-5 justify-center">
                <div className="h-px w-10 bg-[var(--landing-gold)]/35" />
                <div className="h-1.5 w-1.5 border border-[var(--landing-gold)]/45 rotate-45 flex-shrink-0" />
                <div className="h-px w-10 bg-[var(--landing-gold)]/35" />
              </div>
              <p
                className={`font-display text-[var(--landing-cream)] ${isRTL ? 'font-urdu' : ''}`}
                style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.9rem)' }}
              >
                {isRTL
                  ? 'بیانات اور دروس جلد شامل کیے جائیں گے'
                  : 'Lectures and lessons will be added soon'
                }
              </p>
              <p className={`mt-3 text-sm ${isRTL ? 'font-urdu' : ''}`} style={{ color: 'rgba(247,240,221,0.50)' }}>
                {isRTL
                  ? 'اس صفحہ کو باقاعدگی سے اپ ڈیٹ کیا جائے گا'
                  : 'This section will be updated regularly as content is added'
                }
              </p>
            </div>
          </div>

        </div>
      </section>
    </PublicLayout>
  )
}
