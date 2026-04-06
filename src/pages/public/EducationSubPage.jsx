import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { t as T } from '../../data/translations'
import { educationSubpages } from '../../data/publicContent'
import PublicLayout from '../../components/public/PublicLayout'
import PageHero from '../../components/public/PageHero'

const bySlug = Object.fromEntries(
  Object.values(educationSubpages).map(s => [s.slug, s])
)

export default function EducationSubPage() {
  const { slug } = useParams()
  const { isRTL, t } = useLanguage()
  const page = bySlug[slug]

  if (!page) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center bg-[var(--landing-cream)]">
          <div className={`text-center px-6 ${isRTL ? 'font-urdu' : ''}`}>
            <p className="font-display text-[var(--landing-ink)] text-5xl mb-3">٤٠٤</p>
            <p className="text-[var(--landing-ink)]/45 text-sm mb-6">{isRTL ? 'صفحہ نہیں ملا' : 'Page not found'}</p>
            <Link to="/education" className={`inline-flex items-center gap-2 text-sm text-[var(--landing-green)] hover:underline `}>
              ← {t(T.educationalSystem)}
            </Link>
          </div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <PageHero
        title={t(page.title)}
        crumb={`${t(T.home)} / ${t(T.educationalSystem)} / ${t(page.title)}`}
      />

      <section className="bg-[var(--landing-cream)] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back link */}
          <Link
            to="/education"
            className={`inline-flex items-center gap-2 mb-10 text-[10px] uppercase tracking-[0.2em] text-[var(--landing-green)]/60 hover:text-[var(--landing-green)] transition-colors group ${isRTL ? 'font-urdu tracking-normal text-sm' : ''}`}
          >
            <ArrowLeft className={`h-3 w-3 transition-transform group-hover:-translate-x-0.5 ${isRTL ? 'rotate-180' : ''}`} />
            {t(T.educationalSystem)}
          </Link>

          {/* Main content card */}
          <article className={`bg-white border border-[var(--landing-ink)]/8 shadow-[0_8px_40px_rgba(11,31,23,0.06)] overflow-hidden ${isRTL ? 'text-right' : ''}`}
            style={{ borderRadius: '1.5rem' }}
          >
            {/* Gold top edge */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-[var(--landing-gold)]/45 to-transparent" />

            <div className="p-8 sm:p-12">
              {/* Pull-quote style summary */}
              <div className={`mb-8 pb-8 border-b border-[var(--landing-ink)]/8 ${isRTL ? 'border-e-[3px] border-e-[var(--landing-gold)]/35 border-b pe-5' : 'border-l-[3px] border-l-[var(--landing-gold)]/35 pl-5'}`}>
                <p
                  className={`font-display italic text-[var(--landing-ink)]/75 leading-relaxed ${isRTL ? 'not-italic font-urdu text-xl leading-loose' : ''}`}
                  style={{ fontSize: 'clamp(1.05rem, 2vw, 1.3rem)', lineHeight: 1.75 }}
                >
                  {t(page.summary)}
                </p>
              </div>

              {/* Curriculum stages — only for curriculum subpage */}
              {page.stages && (
                <div>
                  <h3
                    className={`font-display text-[var(--landing-ink)] mb-8 ${isRTL ? 'font-urdu text-xl' : 'text-xl'}`}
                  >
                    {t(T.curriculumStages)}
                  </h3>

                  <div className="space-y-0 relative">
                    {/* Vertical timeline line */}
                    <div className={`absolute top-0 bottom-0 w-px bg-[var(--landing-gold)]/15 ${isRTL ? 'end-[1.6rem]' : 'start-[1.6rem]'}`} />

                    {page.stages.map((stage, i) => (
                      <div
                        key={i}
                        className={`relative flex items-start gap-5 pb-7 last:pb-0 `}
                      >
                        {/* Stage number circle */}
                        <div className="relative z-10 flex-shrink-0 h-8 w-8 rounded-full border border-[var(--landing-gold)]/35 bg-white flex items-center justify-center">
                          <span className="font-mono text-[10px] text-[var(--landing-gold)] tracking-wider">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>

                        <div className={`flex-1 pt-0.5 ${isRTL ? 'text-right' : ''}`}>
                          <p className={`font-semibold text-[var(--landing-ink)] mb-1 ${isRTL ? 'font-urdu text-base' : 'text-sm'}`}>
                            {t(stage.label)}
                          </p>
                          <p className={`text-[var(--landing-ink)]/55 ${isRTL ? 'font-urdu text-sm leading-loose' : 'text-sm leading-relaxed'}`}>
                            {t(stage.body)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

        </div>
      </section>
    </PublicLayout>
  )
}
