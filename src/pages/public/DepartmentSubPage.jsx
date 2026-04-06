import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { t as T } from '../../data/translations'
import { departmentSubpages } from '../../data/publicContent'
import PublicLayout from '../../components/public/PublicLayout'
import PageHero from '../../components/public/PageHero'

const bySlug = Object.fromEntries(
  Object.values(departmentSubpages).map(d => [d.slug, d])
)

export default function DepartmentSubPage() {
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
            <Link to="/departments" className={`inline-flex items-center gap-2 text-sm text-[var(--landing-green)] hover:underline `}>
              ← {t(T.departmentsOffices)}
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
        crumb={`${t(T.home)} / ${t(T.departmentsOffices)} / ${t(page.title)}`}
      />

      <section className="bg-[var(--landing-cream)] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <Link
            to="/departments"
            className={`inline-flex items-center gap-2 mb-10 text-[10px] uppercase tracking-[0.2em] text-[var(--landing-green)]/60 hover:text-[var(--landing-green)] transition-colors group ${isRTL ? 'font-urdu tracking-normal text-sm' : ''}`}
          >
            <ArrowLeft className={`h-3 w-3 transition-transform group-hover:-translate-x-0.5 ${isRTL ? 'rotate-180' : ''}`} />
            {t(T.departmentsOffices)}
          </Link>

          <article
            className={`bg-white border border-[var(--landing-ink)]/8 shadow-[0_8px_40px_rgba(11,31,23,0.06)] overflow-hidden ${isRTL ? 'text-right' : ''}`}
            style={{ borderRadius: '1.5rem' }}
          >
            <div className="h-0.5 bg-gradient-to-r from-transparent via-[var(--landing-gold)]/45 to-transparent" />

            <div className="p-8 sm:p-12">
              {/* Pull-quote style body */}
              <div className={`${isRTL ? 'border-e-[3px] border-e-[var(--landing-gold)]/35 pe-5' : 'border-l-[3px] border-l-[var(--landing-gold)]/35 pl-5'}`}>
                <p
                  className={`font-display italic text-[var(--landing-ink)]/72 leading-relaxed ${isRTL ? 'not-italic font-urdu text-xl leading-loose' : ''}`}
                  style={{ fontSize: 'clamp(1.05rem, 2vw, 1.3rem)', lineHeight: 1.75 }}
                >
                  {t(page.summary)}
                </p>
              </div>

              {/* Contact prompt */}
              <div className={`mt-10 pt-8 border-t border-[var(--landing-ink)]/8 flex items-center gap-4 `}>
                <div className="h-8 w-8 rounded-full border border-[var(--landing-gold)]/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-[var(--landing-gold)]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <Link
                  to="/contact"
                  className={`text-[10px] uppercase tracking-[0.18em] text-[var(--landing-green)]/60 hover:text-[var(--landing-green)] transition-colors ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`}
                >
                  {t(T.contactUs)}
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </PublicLayout>
  )
}
