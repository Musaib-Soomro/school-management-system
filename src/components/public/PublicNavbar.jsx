import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { t as T } from '../../data/translations'
import { instituteName } from '../../data/publicContent'

const eduSubpages = [
  { key: 'curriculum',           slug: 'nisab-e-taleem' },
  { key: 'specializationIfta',   slug: 'takhassus-fil-ifta' },
  { key: 'specializationDawah',  slug: 'takhassus-fil-dawah' },
  { key: 'nazraHifz',            slug: 'nazra-wa-tahfiz' },
  { key: 'darsNizamiBoys',       slug: 'dars-e-nizami-banin' },
  { key: 'girlsMadrasa',         slug: 'madrasa-tul-banat' },
  { key: 'religiousStudiesBoys', slug: 'dirasaat-e-diniya-banin' },
  { key: 'hadithEncyclopedia',   slug: 'mawsuat-al-hadith' },
  { key: 'darulIfta',            slug: 'darul-ifta' },
]

const deptSubpages = [
  { key: 'adminOffice',    slug: 'daftar-e-ihtimam' },
  { key: 'academicOffice', slug: 'daftar-e-taleemat' },
  { key: 'publications',   slug: 'darul-tasnif' },
  { key: 'bookshop',       slug: 'maktaba-jamia' },
  { key: 'library',        slug: 'kutub-khana' },
  { key: 'accounts',       slug: 'shoba-hisabat' },
  { key: 'hostel',         slug: 'darul-iqama' },
  { key: 'mosque',         slug: 'jamia-masjid' },
  { key: 'reception',      slug: 'istiqbaliya' },
  { key: 'security',       slug: 'shoba-muhafizeen' },
  { key: 'clinic',         slug: 'shifa-khana' },
  { key: 'kitchen',        slug: 'matbakh' },
]

function NavDropdown({ label, items, isRTL, to }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isParentActive = pathname === to || pathname.startsWith(to + '/')
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Split: Link navigates to overview, chevron is purely visual */}
      <div className="flex items-center gap-1">
        <Link
          to={to}
          className={`nav-indicator py-2 text-[11px] uppercase tracking-[0.18em] transition-all duration-200 ${isParentActive ? 'text-[var(--landing-gold)] active' : 'text-[#e8dfc8] hover:text-[var(--landing-gold)]'} ${isRTL ? 'font-urdu tracking-normal text-sm' : ''}`}
        >
          {label}
        </Link>
        <svg
          className={`w-2.5 h-2.5 mt-0.5 transition-transform duration-200 flex-shrink-0 text-[var(--landing-gold)]/45 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div
        className={`absolute top-full z-50 transition-all duration-200 ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'} ${isRTL ? 'right-0' : 'left-0'}`}
        style={{ paddingTop: '4px' }}
      >
        <div className="bg-[var(--landing-ink)] border border-white/10 rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden min-w-[230px]">
          {/* Gold accent at top */}
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--landing-gold)]/40 to-transparent" />
          <div className="py-2">
            {items.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className={`flex items-center gap-3 px-5 py-2.5 text-[11px] text-[#d4c9ab] hover:text-[var(--landing-gold)] hover:bg-white/[0.05] transition-colors duration-150 ${isRTL ? 'font-urdu text-sm' : 'uppercase tracking-[0.12em]'}`}
                onClick={() => setOpen(false)}
              >
                <span className="text-[var(--landing-gold)]/25 text-[8px] font-mono">{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PublicNavbar() {
  const { lang, isRTL, switchLang, t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileEduOpen, setMobileEduOpen] = useState(false)
  const [mobileDeptOpen, setMobileDeptOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const eduItems = eduSubpages.map(s => ({ to: `/education/${s.slug}`, label: t(T[s.key]) }))
  const deptItems = deptSubpages.map(s => ({ to: `/departments/${s.slug}`, label: t(T[s.key]) }))
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')
  const navLinkClass = (active) =>
    `text-[11px] uppercase tracking-[0.18em] transition-all duration-200 py-2 relative group ${
      active ? 'text-[var(--landing-gold)]' : 'text-[#e8dfc8] hover:text-[var(--landing-gold)]'
    }`

  return (
    <>
      <style>{`
        .nav-indicator::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0; right: 0;
          height: 1px;
          background: var(--landing-gold);
          transform: scaleX(0);
          transition: transform 0.25s ease;
          transform-origin: ${isRTL ? 'right' : 'left'};
        }
        .nav-indicator.active::after,
        .nav-indicator:hover::after { transform: scaleX(1); }
      `}</style>

      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--landing-ink)] border-b border-white/10 shadow-[0_4px_32px_rgba(0,0,0,0.4)]'
            : 'bg-[var(--landing-ink)]/90 backdrop-blur-md border-b border-white/[0.06]'
        }`}
      >
        {/* Gold thread at very top */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--landing-gold)]/50 to-transparent" />

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[4.25rem] flex items-center justify-between gap-6">

          {/* ── Logo ── */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full border border-[var(--landing-gold)]/30 scale-110 group-hover:scale-125 transition-transform duration-500" />
              <img
                src="/landing/institute-logo.jpg"
                alt={t(instituteName)}
                className="h-9 w-9 rounded-full object-cover border border-[var(--landing-gold)]/20"
              />
            </div>
            <div className={`hidden sm:block leading-tight ${isRTL ? 'text-right' : ''}`}>
              <p className={`text-[var(--landing-gold-soft)] font-display font-semibold leading-none text-sm ${isRTL ? 'font-urdu' : ''}`}>
                {t(instituteName)}
              </p>
              <p className={`mt-0.5 hidden lg:block ${isRTL ? 'font-urdu text-xs' : 'text-[9px] uppercase tracking-[0.3em]'}`} style={{ color: 'rgba(247,240,221,0.55)' }}>
                {isRTL ? 'اشاعت القرآن والحدیث' : 'Ishat ul Quran Wal Hadith'}
              </p>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className={`${navLinkClass(location.pathname === '/')} nav-indicator ${location.pathname === '/' ? 'active' : ''} ${isRTL ? 'font-urdu tracking-normal text-sm' : ''}`}>
              {t(T.home)}
            </Link>

            <NavDropdown label={<span className={isRTL ? 'font-urdu tracking-normal text-sm' : ''}>{t(T.educationalSystem)}</span>} items={eduItems} isRTL={isRTL} to="/education" />

            <NavDropdown label={<span className={isRTL ? 'font-urdu tracking-normal text-sm' : ''}>{t(T.departmentsOffices)}</span>} items={deptItems} isRTL={isRTL} to="/departments" />

            <Link to="/speeches" className={`${navLinkClass(isActive('/speeches'))} nav-indicator ${isActive('/speeches') ? 'active' : ''} ${isRTL ? 'font-urdu tracking-normal text-sm' : ''}`}>
              {t(T.speechesLessons)}
            </Link>
            <Link to="/projects" className={`${navLinkClass(isActive('/projects'))} nav-indicator ${isActive('/projects') ? 'active' : ''} ${isRTL ? 'font-urdu tracking-normal text-sm' : ''}`}>
              {t(T.projects)}
            </Link>
            <Link to="/contact" className={`${navLinkClass(isActive('/contact'))} nav-indicator ${isActive('/contact') ? 'active' : ''} ${isRTL ? 'font-urdu tracking-normal text-sm' : ''}`}>
              {t(T.contact)}
            </Link>
          </div>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Language toggle */}
            <button
              onClick={() => switchLang(lang === 'ur' ? 'en' : 'ur')}
              className="relative h-7 rounded-full border border-[var(--landing-gold)]/30 text-[var(--landing-gold)] hover:border-[var(--landing-gold)]/55 hover:bg-[var(--landing-gold)]/8 transition-all duration-200 px-3 text-[10px] font-semibold tracking-widest"
            >
              {lang === 'ur' ? 'EN' : 'اردو'}
            </button>


            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-[var(--landing-cream)]/55 hover:text-[var(--landing-cream)] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </nav>

        {/* ── Mobile menu ── */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 border-t border-white/8 ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="bg-[var(--landing-ink)] px-4 py-4">
            <div className={`flex flex-col gap-0.5 ${isRTL ? 'items-end' : ''}`}>
              <Link to="/" className={`py-3 px-3 text-xs uppercase tracking-[0.18em] text-[var(--landing-cream)]/70 hover:text-[var(--landing-gold)] border-b border-white/5 ${isRTL ? 'font-urdu tracking-normal text-sm w-full text-right' : ''}`} onClick={() => setMobileOpen(false)}>{t(T.home)}</Link>

              <div className="flex items-center justify-between border-b border-white/5">
                <Link to="/education" className={`flex-1 py-3 px-3 text-xs uppercase tracking-[0.18em] text-[var(--landing-cream)]/85 hover:text-[var(--landing-gold)] ${isRTL ? 'font-urdu tracking-normal text-sm text-right' : ''}`} onClick={() => setMobileOpen(false)}>
                  {t(T.educationalSystem)}
                </Link>
                <button className="px-3 py-3 text-[var(--landing-cream)]/50 hover:text-[var(--landing-gold)]" onClick={() => setMobileEduOpen(!mobileEduOpen)}>
                  <svg className={`w-3 h-3 transition-transform ${mobileEduOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {mobileEduOpen && (
                <div className={`pb-1 ${isRTL ? 'w-full' : ''}`}>
                  {eduItems.map((item, i) => (
                    <Link key={i} to={item.to} className={`flex items-center gap-2.5 py-2 ps-6 pe-3 text-[10px] text-[var(--landing-cream)]/50 hover:text-[var(--landing-gold)] ${isRTL ? 'font-urdu tracking-normal text-sm' : 'uppercase tracking-[0.12em]'}`} onClick={() => setMobileOpen(false)}>
                      <span className="text-[var(--landing-gold)]/30 font-mono text-[8px]">{String(i + 1).padStart(2, '0')}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between border-b border-white/5">
                <Link to="/departments" className={`flex-1 py-3 px-3 text-xs uppercase tracking-[0.18em] text-[var(--landing-cream)]/85 hover:text-[var(--landing-gold)] ${isRTL ? 'font-urdu tracking-normal text-sm text-right' : ''}`} onClick={() => setMobileOpen(false)}>
                  {t(T.departmentsOffices)}
                </Link>
                <button className="px-3 py-3 text-[var(--landing-cream)]/50 hover:text-[var(--landing-gold)]" onClick={() => setMobileDeptOpen(!mobileDeptOpen)}>
                  <svg className={`w-3 h-3 transition-transform ${mobileDeptOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {mobileDeptOpen && (
                <div className={`pb-1 ${isRTL ? 'w-full' : ''}`}>
                  {deptItems.map((item, i) => (
                    <Link key={i} to={item.to} className={`flex items-center gap-2.5 py-2 ps-6 pe-3 text-[10px] text-[var(--landing-cream)]/50 hover:text-[var(--landing-gold)] ${isRTL ? 'font-urdu tracking-normal text-sm' : 'uppercase tracking-[0.12em]'}`} onClick={() => setMobileOpen(false)}>
                      <span className="text-[var(--landing-gold)]/30 font-mono text-[8px]">{String(i + 1).padStart(2, '0')}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              {[
                { to: '/speeches', key: 'speechesLessons' },
                { to: '/projects', key: 'projects' },
                { to: '/contact', key: 'contact' },
              ].map(({ to, key }) => (
                <Link key={to} to={to} className={`py-3 px-3 text-xs uppercase tracking-[0.18em] text-[var(--landing-cream)]/70 hover:text-[var(--landing-gold)] border-b border-white/5 ${isRTL ? 'font-urdu tracking-normal text-sm w-full text-right' : ''}`} onClick={() => setMobileOpen(false)}>
                  {t(T[key])}
                </Link>
              ))}

            </div>
          </div>
        </div>
      </header>
    </>
  )
}
