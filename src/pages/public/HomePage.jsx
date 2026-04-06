import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, GraduationCap, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { t as T } from '../../data/translations'
import { home, founderName, educationSubpages, departmentSubpages } from '../../data/publicContent'
import PublicLayout from '../../components/public/PublicLayout'

const STAR_TILE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpolygon points='40%2C4 46%2C26 65%2C15 54%2C34 76%2C40 54%2C46 65%2C65 46%2C54 40%2C76 34%2C54 15%2C65 26%2C46 4%2C40 26%2C34 15%2C15 34%2C26' fill='none' stroke='rgba(216%2C184%2C102%2C0.07)' stroke-width='0.7'%2F%3E%3C%2Fsvg%3E")`

const archStyle = {
  borderTopLeftRadius: '9999px',
  borderTopRightRadius: '9999px',
  borderBottomLeftRadius: '1.25rem',
  borderBottomRightRadius: '1.25rem',
}

const EDU_HIGHLIGHTS = [
  { key: 'curriculum', slug: 'nisab-e-taleem' },
  { key: 'darsNizamiBoys', slug: 'dars-e-nizami-banin' },
  { key: 'girlsMadrasa', slug: 'madrasa-tul-banat' },
  { key: 'nazraHifz', slug: 'nazra-wa-tahfiz' },
  { key: 'darulIfta', slug: 'darul-ifta' },
  { key: 'specializationIfta', slug: 'takhassus-fil-ifta' },
]

const DEPT_HIGHLIGHTS = [
  { key: 'adminOffice', slug: 'daftar-e-ihtimam' },
  { key: 'library', slug: 'kutub-khana' },
  { key: 'hostel', slug: 'darul-iqama' },
  { key: 'mosque', slug: 'jamia-masjid' },
]

export default function HomePage() {
  const { isRTL, t } = useLanguage()

  return (
    <PublicLayout>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .lp-up { animation: fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .lp-in { animation: fadeIn 1.1s ease both; }
      `}</style>

      <div className="bg-[var(--landing-ink)] text-[var(--landing-cream)]">

        {/* ══════════════════════════════════════════════════════
            HERO — atmospheric full-viewport
        ══════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen overflow-hidden">

          <img
            src="/landing/courtyard.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: 'brightness(0.32) saturate(0.45)', objectPosition: 'center 40%' }}
          />
          <div className="absolute inset-0 bg-[var(--landing-green)]/60" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,31,23,0.65)_0%,transparent_35%,transparent_65%,rgba(11,31,23,0.95)_100%)]" />
          <div className="absolute inset-0 opacity-25" style={{ backgroundImage: STAR_TILE }} />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--landing-gold)]/55 to-transparent" />

          <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-20 sm:px-8 lg:px-12">

            {/* Centred hero content */}
            <div className={`flex flex-1 flex-col items-center justify-center py-16 text-center ${isRTL ? 'font-urdu' : ''}`}>

              <p className="lp-up text-[10px] uppercase tracking-[0.5em] text-[var(--landing-gold-soft)]" style={{ animationDelay: '0.06s' }}>
                {isRTL ? 'لاڑکانہ، سندھ · پاکستان' : 'Larkana, Sindh · Pakistan'}
              </p>

              <h1
                className="lp-up mt-6 font-display text-white"
                style={{ fontSize: 'clamp(3.2rem, 6.5vw, 6.5rem)', lineHeight: '1.02', animationDelay: '0.14s' }}
              >
                {isRTL
                  ? <>{t(home.heroTitle)}<br /><span className="text-[var(--landing-gold)]">لاڑکانہ</span></>
                  : <>Jamia Islamia<br /><span className="text-[var(--landing-gold)]">Larkana</span></>
                }
              </h1>

              <p
                className="lp-up mt-4 font-display italic text-white/65"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.75rem)', animationDelay: '0.22s' }}
              >
                {isRTL ? 'اشاعت القرآن والحدیث' : 'Ishat ul Quarn Wal Hadith'}
              </p>

              <div className="lp-up mt-8 h-px w-20 bg-[var(--landing-gold)]/40" style={{ animationDelay: '0.28s' }} />

              <p
                className="lp-up mt-8 max-w-xl text-base leading-[1.9] text-white/58 sm:text-lg"
                style={{ animationDelay: '0.34s' }}
              >
                {t(home.heroBody)}
              </p>

              <div className="lp-up mt-10 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: '0.42s' }}>
                <Link
                  to="/education"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--landing-gold)] px-7 py-3.5 text-sm font-semibold text-[var(--landing-ink)] shadow-[0_6px_28px_rgba(216,184,102,0.3)] transition-opacity hover:opacity-85"
                >
                  {t(T.educationalSystem)}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm text-white/70 transition-colors hover:border-white/38 hover:text-white"
                >
                  {t(T.contact)}
                </Link>
              </div>
            </div>

            {/* Scroll cue */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className="h-10 w-px bg-gradient-to-b from-transparent to-[var(--landing-gold)]/40" />
                <p className="text-[9px] uppercase tracking-[0.44em] text-white/25">
                  {isRTL ? 'نیچے' : 'Scroll'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FOUNDER
        ══════════════════════════════════════════════════════ */}
        <section className="border-b border-black/[0.07] bg-[var(--landing-cream)] text-[var(--landing-ink)]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
            <div className={`grid gap-14 lg:grid-cols-[0.4fr_0.6fr] lg:items-center ${isRTL ? 'lg:grid-cols-[0.6fr_0.4fr]' : ''}`}>

              {/* Portrait */}
              <div className={`aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-[0_20px_56px_rgba(0,0,0,0.13)] ${isRTL ? 'lg:order-2' : ''}`}>
                <img
                  src="/landing/founder-portrait.jpg"
                  alt={t(founderName)}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* Text */}
              <div className={`${isRTL ? 'lg:order-1 lg:pe-4 text-right' : 'lg:pl-4'}`}>
                <p className={`text-[10px] uppercase tracking-[0.46em] text-[var(--landing-green)]/60 ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`}>
                  {t(T.founderOfInstitute)}
                </p>

                <div className={`mt-3 h-px w-10 bg-[var(--landing-green)]/22 ${isRTL ? 'ms-auto' : ''}`} />

                <h2
                  className={`mt-5 font-display text-[var(--landing-ink)] ${isRTL ? 'font-urdu' : ''}`}
                  style={{ fontSize: 'clamp(1.9rem, 3.8vw, 3.5rem)', lineHeight: '1.1' }}
                >
                  {t(founderName)}
                </h2>

                <p className={`mt-6 text-base leading-[1.9] text-[var(--landing-ink)]/65 ${isRTL ? 'font-urdu text-base leading-loose' : ''}`}>
                  {t(home.founderBody)}
                </p>

                <blockquote className={`mt-8 ${isRTL ? 'border-e-[3px] border-s-0 border-[var(--landing-green)]/25 pe-5' : 'border-l-[3px] border-[var(--landing-green)]/25 pl-5'}`}>
                  <p className={`font-display text-xl italic leading-relaxed text-[var(--landing-green)] sm:text-2xl ${isRTL ? 'font-urdu not-italic text-right leading-loose' : ''}`}>
                    {isRTL
                      ? '"علم ایک امانت ہے۔ ہم اسے اٹھاتے، محفوظ رکھتے، اور آگے پہنچاتے ہیں۔"'
                      : '"Knowledge is a trust. We carry it, preserve it, and pass it on."'
                    }
                  </p>
                  <cite className={`mt-4 block text-[10px] not-italic uppercase tracking-[0.28em] text-[var(--landing-ink)]/38 ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`}>
                    {isRTL ? '— بانی جامعہ اسلامیہ لاڑکانہ' : '— Founder, Jamia Islamia Larkana'}
                  </cite>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            EDUCATION OVERVIEW
        ══════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[var(--landing-ink-soft)] border-b border-white/10" style={{ backgroundImage: STAR_TILE }}>
          <div className="absolute inset-0 bg-[var(--landing-ink-soft)]/90" />
          <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">

            <div className={`mb-12 ${isRTL ? 'text-right' : ''}`}>
              <p className={`text-[10px] uppercase tracking-[0.46em] text-[var(--landing-gold-soft)] ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`}>
                {t(T.ourPrograms)}
              </p>
              <h2
                className={`mt-3 font-display text-white ${isRTL ? 'font-urdu' : ''}`}
                style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)', lineHeight: '1.1' }}
              >
                {t(T.educationalSystem)}
              </h2>
              <p className={`mt-4 max-w-2xl text-base leading-[1.9] text-white/55 ${isRTL ? 'font-urdu leading-loose ms-auto' : ''}`}>
                {t(home.educationOverview)}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {EDU_HIGHLIGHTS.map(({ key, slug }) => (
                <Link
                  key={key}
                  to={`/education/${slug}`}
                  className={`group rounded-xl border border-white/[0.07] bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-[var(--landing-gold)]/22 hover:bg-white/[0.05] ${isRTL ? 'text-right' : ''}`}
                >
                  <h3 className={`font-display text-xl text-white group-hover:text-[var(--landing-gold)] transition-colors ${isRTL ? 'font-urdu text-lg' : ''}`}>
                    {t(T[key])}
                  </h3>
                  <div className={`mt-3 flex items-center gap-1.5 text-xs text-[var(--landing-gold)]/60 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{t(T.readMore)}</span>
                    <ArrowRight className={`h-3 w-3 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0' : ''}`} />
                  </div>
                </Link>
              ))}
            </div>

            <div className={`mt-8 ${isRTL ? 'text-right' : ''}`}>
              <Link
                to="/education"
                className={`inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm text-white/70 transition-colors hover:border-white/38 hover:text-white ${isRTL ? 'flex-row-reverse font-urdu' : ''}`}
              >
                {t(T.educationalSystem)}
                <ArrowRight className={`h-3.5 w-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            DEPARTMENTS OVERVIEW
        ══════════════════════════════════════════════════════ */}
        <section className="bg-[var(--landing-bark)] border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">

            <div className={`mb-12 ${isRTL ? 'text-right' : ''}`}>
              <p className={`text-[10px] uppercase tracking-[0.46em] text-[var(--landing-gold-soft)] ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`}>
                {t(T.ourDepts)}
              </p>
              <h2
                className={`mt-3 font-display text-white ${isRTL ? 'font-urdu' : ''}`}
                style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)', lineHeight: '1.1' }}
              >
                {t(T.departmentsOffices)}
              </h2>
              <p className={`mt-4 max-w-2xl text-base leading-[1.9] text-white/55 ${isRTL ? 'font-urdu leading-loose ms-auto' : ''}`}>
                {t(home.deptsOverview)}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DEPT_HIGHLIGHTS.map(({ key, slug }) => (
                <Link
                  key={key}
                  to={`/departments/${slug}`}
                  className={`group rounded-xl border border-white/[0.07] bg-white/[0.03] p-5 transition-all hover:-translate-y-1 hover:border-[var(--landing-gold)]/22 hover:bg-white/[0.05] ${isRTL ? 'text-right' : ''}`}
                >
                  <h3 className={`font-display text-lg text-white group-hover:text-[var(--landing-gold)] transition-colors ${isRTL ? 'font-urdu' : ''}`}>
                    {t(T[key])}
                  </h3>
                </Link>
              ))}
            </div>

            <div className={`mt-8 ${isRTL ? 'text-right' : ''}`}>
              <Link
                to="/departments"
                className={`inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm text-white/70 transition-colors hover:border-white/38 hover:text-white ${isRTL ? 'flex-row-reverse font-urdu' : ''}`}
              >
                {t(T.departmentsOffices)}
                <ArrowRight className={`h-3.5 w-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  )
}
