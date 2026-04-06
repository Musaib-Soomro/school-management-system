import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { t as T } from '../../data/translations'
import { instituteName, instituteFullName } from '../../data/publicContent'

const STAR_TILE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cpolygon points='36%2C3 42%2C24 60%2C13 49%2C31 70%2C36 49%2C41 60%2C59 42%2C48 36%2C69 30%2C48 12%2C59 23%2C41 2%2C36 23%2C31 12%2C13 30%2C24' fill='none' stroke='rgba(216%2C184%2C102%2C0.055)' stroke-width='0.6'/%3E%3C/svg%3E")`

const importantPages = [
  { key: 'home',               to: '/' },
  { key: 'educationalSystem',  to: '/education' },
  { key: 'departmentsOffices', to: '/departments' },
  { key: 'speechesLessons',    to: '/speeches' },
  { key: 'projects',           to: '/projects' },
  { key: 'contact',            to: '/contact' },
]

const educationalLinks = [
  { key: 'curriculum',    to: '/education/nisab-e-taleem' },
  { key: 'darsNizamiBoys', to: '/education/dars-e-nizami-banin' },
  { key: 'girlsMadrasa',  to: '/education/madrasa-tul-banat' },
  { key: 'nazraHifz',     to: '/education/nazra-wa-tahfiz' },
  { key: 'darulIfta',     to: '/education/darul-ifta' },
  { key: 'specializationIfta', to: '/education/takhassus-fil-ifta' },
]

const deptLinks = [
  { key: 'adminOffice',   to: '/departments/daftar-e-ihtimam' },
  { key: 'academicOffice', to: '/departments/daftar-e-taleemat' },
  { key: 'library',       to: '/departments/kutub-khana' },
  { key: 'hostel',        to: '/departments/darul-iqama' },
  { key: 'clinic',        to: '/departments/shifa-khana' },
  { key: 'kitchen',       to: '/departments/matbakh' },
]

function ColHeading({ children, isRTL }) {
  return (
    <div className={`mb-5 ${isRTL ? 'text-right' : ''}`}>
      <h4 className={`text-[var(--landing-gold)] text-[9px] uppercase tracking-[0.38em] ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`}>
        {children}
      </h4>
      <div className="mt-2 h-px w-6 bg-[var(--landing-gold)]/30" style={isRTL ? { marginLeft: 'auto' } : {}} />
    </div>
  )
}

function FooterLink({ to, children, isRTL }) {
  if (isRTL) {
    return (
      <li>
        <Link
          to={to}
          className="group block font-urdu text-sm text-[#ccc0a0] hover:text-[var(--landing-cream)] transition-colors duration-200 leading-relaxed py-0.5"
        >
          {children}
        </Link>
      </li>
    )
  }
  return (
    <li>
      <Link
        to={to}
        className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[#ccc0a0] hover:text-[var(--landing-cream)] transition-colors duration-200 leading-relaxed"
      >
        <span className="h-px w-3 bg-[var(--landing-gold)]/30 flex-shrink-0 group-hover:w-5 group-hover:bg-[var(--landing-gold)]/60 transition-all duration-300" />
        {children}
      </Link>
    </li>
  )
}

// Islamic diamond ornament
function Ornament({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--landing-gold)]/20" />
      <div className="h-2 w-2 border border-[var(--landing-gold)]/40 rotate-45 flex-shrink-0" />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--landing-gold)]/20" />
    </div>
  )
}

export default function PublicFooter() {
  const { isRTL, t } = useLanguage()

  return (
    <footer
      className="relative bg-[var(--landing-ink)] text-[var(--landing-cream)]/60 overflow-hidden"
      style={{ backgroundImage: STAR_TILE, backgroundSize: '72px 72px' }}
    >
      {/* Overlay to tint the star tile */}
      <div className="absolute inset-0 bg-[var(--landing-ink)]/92 pointer-events-none" />

      {/* Gold gradient rule at top */}
      <div className="relative">
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--landing-gold)]/55 to-transparent" />
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--landing-gold)]/15 to-transparent mt-px" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Identity block ── */}
        <div className={`pt-14 pb-10 border-b border-white/[0.07] ${isRTL ? 'text-right' : ''}`}>
          <div className="flex items-center gap-4 mb-5">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full border border-[var(--landing-gold)]/20 scale-125" />
              <img
                src="/landing/institute-logo.jpg"
                alt=""
                className="h-14 w-14 rounded-full object-cover border border-[var(--landing-gold)]/25 relative z-10"
              />
            </div>
            <div>
              <p
                className={`text-[var(--landing-cream)] font-display leading-tight ${isRTL ? 'font-urdu text-xl' : ''}`}
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}
              >
                {t(instituteName)}
              </p>
              <p className={`mt-0.5 text-[10px] ${isRTL ? 'font-urdu text-sm' : 'uppercase tracking-[0.24em]'}`} style={{ color: 'rgba(247,240,221,0.55)' }}>
                {t(instituteFullName)}
              </p>
            </div>
          </div>

        </div>

        {/* ── Link columns ── */}
        <div className={`py-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 border-b border-white/[0.07]`}>

          <div>
            <ColHeading isRTL={isRTL}>{t(T.footerImportantPages)}</ColHeading>
            <ul className={`space-y-2.5 ${isRTL ? 'text-right' : ''}`}>
              {importantPages.map(pg => (
                <FooterLink key={pg.key} to={pg.to} isRTL={isRTL}>{t(T[pg.key])}</FooterLink>
              ))}
            </ul>
          </div>

          <div>
            <ColHeading isRTL={isRTL}>{t(T.footerEducational)}</ColHeading>
            <ul className={`space-y-2.5 ${isRTL ? 'text-right' : ''}`}>
              {educationalLinks.map(pg => (
                <FooterLink key={pg.key} to={pg.to} isRTL={isRTL}>{t(T[pg.key])}</FooterLink>
              ))}
            </ul>
          </div>

          <div>
            <ColHeading isRTL={isRTL}>{t(T.footerDepartments)}</ColHeading>
            <ul className={`space-y-2.5 ${isRTL ? 'text-right' : ''}`}>
              {deptLinks.map(pg => (
                <FooterLink key={pg.key} to={pg.to} isRTL={isRTL}>{t(T[pg.key])}</FooterLink>
              ))}
            </ul>
          </div>

          <div>
            <ColHeading isRTL={isRTL}>{t(T.footerContact)}</ColHeading>
            <ul className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
              <li>
                <p className={`text-[9px] uppercase tracking-[0.3em] mb-0.5 ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`} style={{ color: 'rgba(247,240,221,0.5)' }}>{t(T.phone)}</p>
                <a href="tel:+923000000000" className="text-[11px] hover:text-[var(--landing-gold)] transition-colors" style={{ color: 'rgba(247,240,221,0.78)' }} dir="ltr">
                  +92-300-0000000
                </a>
              </li>
              <li>
                <p className={`text-[9px] uppercase tracking-[0.3em] mb-0.5 ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`} style={{ color: 'rgba(247,240,221,0.5)' }}>{t(T.email)}</p>
                <a href="mailto:info@jamiaislamilarkana.edu.pk" className="text-[10px] hover:text-[var(--landing-gold)] transition-colors break-all leading-relaxed" style={{ color: 'rgba(247,240,221,0.78)' }} dir="ltr">
                  info@jamiaislamilarkana.edu.pk
                </a>
              </li>
              <li>
                <p className={`text-[9px] uppercase tracking-[0.3em] mb-0.5 ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`} style={{ color: 'rgba(247,240,221,0.5)' }}>{t(T.address)}</p>
                <span className={`text-[11px] ${isRTL ? 'font-urdu text-sm' : ''}`} style={{ color: 'rgba(247,240,221,0.72)' }}>
                  {isRTL ? 'لاڑکانہ، سندھ، پاکستان' : 'Larkana, Sindh, Pakistan'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="py-6">
          <Ornament className="mb-5" />
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-[9px] ${isRTL ? 'sm:flex-row-reverse' : ''}`} style={{ color: 'rgba(247,240,221,0.42)' }}>
            <span className={`${isRTL ? 'font-urdu text-xs tracking-normal' : 'uppercase tracking-[0.24em]'}`}>
              © {new Date().getFullYear()} {t(instituteName)}. {t(T.footerRights)}.
            </span>
            <span className="uppercase tracking-[0.24em] hidden sm:block">
              {isRTL ? 'لاڑکانہ · سندھ · پاکستان' : 'Larkana · Sindh · Pakistan'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
