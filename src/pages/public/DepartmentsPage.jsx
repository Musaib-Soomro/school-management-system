import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { t as T } from '../../data/translations'
import { departments, departmentSubpages } from '../../data/publicContent'
import PublicLayout from '../../components/public/PublicLayout'
import PageHero from '../../components/public/PageHero'

const deptList = Object.values(departmentSubpages)

// Each department gets a subtle category icon using unicode — simple, no extra library
const deptIcons = ['⚙', '📋', '📖', '🛒', '📚', '💰', '🏠', '🕌', '🗂', '🛡', '⚕', '🍽']

export default function DepartmentsPage() {
  const { isRTL, t } = useLanguage()

  return (
    <PublicLayout>
      <style>{`
        @keyframes deptCardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dept-card { animation: deptCardIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <PageHero
        title={t(departments.title)}
        subtitle={t(departments.overview)}
        crumb={`${t(T.home)} / ${t(T.departmentsOffices)}`}
      />

      <section className="bg-[var(--landing-cream)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className={`mb-12 ${isRTL ? 'text-right' : ''}`}>
            <p className={`text-[var(--landing-green)]/50 text-[9px] uppercase tracking-[0.42em] mb-2 ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`}>
              {t(T.ourDepts)}
            </p>
            <h2
              className={`font-display text-[var(--landing-ink)] ${isRTL ? 'font-urdu' : ''}`}
              style={{ fontSize: 'clamp(1.7rem, 3vw, 2.6rem)', lineHeight: 1.15 }}
            >
              {t(departments.title)}
            </h2>
            <div className="mt-3 h-px w-12 bg-[var(--landing-gold)]/45" style={isRTL ? { marginLeft: 'auto' } : {}} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {deptList.map((dept, i) => (
              <Link
                key={dept.slug}
                to={`/departments/${dept.slug}`}
                className="dept-card group relative bg-white border border-[var(--landing-ink)]/9 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(11,31,23,0.09)] hover:border-[var(--landing-green)]/22"
                style={{ animationDelay: `${i * 0.045}s` }}
              >
                {/* Top gold reveal line */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-[var(--landing-gold)]/0 to-transparent group-hover:via-[var(--landing-gold)]/40 transition-all duration-500" />

                <div className={`p-6 ${isRTL ? 'text-right' : ''}`}>
                  {/* Icon + Number row */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl opacity-60 group-hover:opacity-90 transition-opacity">
                      {deptIcons[i] || '◆'}
                    </span>
                    <span className="font-mono text-[9px] text-[var(--landing-gold)]/35 tracking-widest">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="h-px w-7 bg-[var(--landing-gold)]/35 mb-3" style={isRTL ? { marginLeft: 'auto' } : {}} />

                  <h3
                    className={`font-display text-[var(--landing-ink)] group-hover:text-[var(--landing-green)] transition-colors duration-200 leading-snug ${isRTL ? 'font-urdu text-xl' : 'text-lg'}`}
                  >
                    {t(dept.title)}
                  </h3>

                  <p className={`mt-2.5 text-sm leading-relaxed text-[var(--landing-ink)]/45 line-clamp-2 ${isRTL ? 'font-urdu text-sm leading-loose' : ''}`}>
                    {t(dept.summary)}
                  </p>

                  <div className={`mt-4 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[var(--landing-green)]/50 group-hover:text-[var(--landing-green)] transition-colors ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`}>
                    <span>{t(T.readMore)}</span>
                    <ArrowRight className={`h-3 w-3 transition-transform group-hover:translate-x-0.5 ${isRTL ? 'rotate-180' : ''}`} />
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
