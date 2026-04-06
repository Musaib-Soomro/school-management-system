import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { t as T } from '../../data/translations'
import { educationalSystem, educationSubpages } from '../../data/publicContent'
import PublicLayout from '../../components/public/PublicLayout'
import PageHero from '../../components/public/PageHero'

const subpageList = [
  educationSubpages.curriculum,
  educationSubpages.ifta,
  educationSubpages.dawah,
  educationSubpages.nazraHifz,
  educationSubpages.darseNizamiBoys,
  educationSubpages.girlsMadrasa,
  educationSubpages.religiousStudiesBoys,
  educationSubpages.hadithEncyclopedia,
  educationSubpages.darulIfta,
]

// 80px arch: at pt-16 (64px), clip inset is only ~1.6px — well inside px-7 (28px) padding
const archCard = {
  borderTopLeftRadius: '80px',
  borderTopRightRadius: '80px',
  borderBottomLeftRadius: '1.25rem',
  borderBottomRightRadius: '1.25rem',
}

export default function EducationalSystemPage() {
  const { isRTL, t } = useLanguage()

  return (
    <PublicLayout>
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .edu-card { animation: cardIn 0.65s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <PageHero
        title={t(educationalSystem.title)}
        subtitle={t(educationalSystem.overview)}
        crumb={`${t(T.home)} / ${t(T.educationalSystem)}`}
      />

      {/* Content */}
      <section className="bg-[var(--landing-cream)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section label */}
          <div className={`mb-12 ${isRTL ? 'text-right' : ''}`}>
            <p className={`text-[var(--landing-green)]/50 text-[9px] uppercase tracking-[0.42em] mb-2 ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`}>
              {t(T.ourPrograms)}
            </p>
            <h2
              className={`font-display text-[var(--landing-ink)] ${isRTL ? 'font-urdu' : ''}`}
              style={{ fontSize: 'clamp(1.7rem, 3vw, 2.6rem)', lineHeight: 1.15 }}
            >
              {t(educationalSystem.title)}
            </h2>
            <div className="mt-3 h-px w-12 bg-[var(--landing-gold)]/45" style={isRTL ? { marginLeft: 'auto' } : {}} />
          </div>

          {/* Cards grid — arch shape for first row, standard for rest */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {subpageList.map((page, i) => (
              <Link
                key={page.slug}
                to={`/education/${page.slug}`}
                className="edu-card group relative overflow-hidden border border-[var(--landing-ink)]/10 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--landing-green)]/25 hover:shadow-[0_20px_56px_rgba(11,31,23,0.1)]"
                style={{
                  ...archCard,
                  animationDelay: `${i * 0.06}s`,
                }}
              >
                {/* Arch cap — subtle green tint fills the arch area at top */}
                <div
                  className="absolute top-0 inset-x-0 bg-[var(--landing-green)]/[0.06] group-hover:bg-[var(--landing-green)]/[0.1] transition-colors duration-300"
                  style={{ height: '80px', borderTopLeftRadius: '80px', borderTopRightRadius: '80px' }}
                />
                {/* Gold reveal line along the arch */}
                <div
                  className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--landing-gold)]/0 to-transparent group-hover:via-[var(--landing-gold)]/50 transition-all duration-500"
                  style={{ borderTopLeftRadius: '80px', borderTopRightRadius: '80px' }}
                />

                {/* Number badge — centered in the arch cap */}
                <div className="absolute top-7 inset-x-0 flex justify-center">
                  <span className="font-mono text-[9px] text-[var(--landing-gold)]/40 tracking-widest">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className={`px-7 pb-8 pt-16 ${isRTL ? 'text-right' : ''}`}>
                  <div className="mb-3 h-px w-8 bg-[var(--landing-gold)]/40" style={isRTL ? { marginLeft: 'auto' } : {}} />

                  <h3
                    className={`font-display text-[var(--landing-ink)] group-hover:text-[var(--landing-green)] transition-colors duration-200 leading-snug ${isRTL ? 'font-urdu text-xl' : 'text-xl'}`}
                  >
                    {t(page.title)}
                  </h3>

                  <p className={`mt-3 text-sm leading-relaxed text-[var(--landing-ink)]/50 line-clamp-3 ${isRTL ? 'font-urdu text-sm leading-loose' : ''}`}>
                    {t(page.summary)}
                  </p>

                  <div className={`mt-5 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold text-[var(--landing-green)]/55 group-hover:text-[var(--landing-green)] transition-colors duration-200 ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`}>
                    <span>{t(T.readMore)}</span>
                    <ArrowRight className={`h-3 w-3 transition-transform group-hover:translate-x-0.5 ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5 group-hover:translate-x-0' : ''}`} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
