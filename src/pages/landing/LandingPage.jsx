import { ArrowRight, BookOpen, GraduationCap, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

// ─── Islamic 8-pointed star tile ──────────────────────────────────────────
const STAR_TILE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpolygon points='40%2C4 46%2C26 65%2C15 54%2C34 76%2C40 54%2C46 65%2C65 46%2C54 40%2C76 34%2C54 15%2C65 26%2C46 4%2C40 26%2C34 15%2C15 34%2C26' fill='none' stroke='rgba(216%2C184%2C102%2C0.07)' stroke-width='0.7'%2F%3E%3C%2Fsvg%3E")`

// ─── Arch shape — used only on pillar cards ────────────────────────────────
const archStyle = {
  borderTopLeftRadius: '9999px',
  borderTopRightRadius: '9999px',
  borderBottomLeftRadius: '1.25rem',
  borderBottomRightRadius: '1.25rem',
}

const pillars = [
  {
    icon: BookOpen,
    title: 'Quranic Foundation',
    body: "Memorisation, recitation, and Tajweed form the spiritual core. Every student's journey begins with the Quran and is sustained by it.",
  },
  {
    icon: GraduationCap,
    title: 'Classical Sciences',
    body: 'Fiqh, Hadith, Tafsir, and Arabic are taught with the rigour of traditional scholarship and the clarity of structured, graduated teaching.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent Portal',
    body: 'Parents, teachers, and administrators share one secure portal — attendance, fees, and student progress kept clear and current.',
  },
]

// ─── Component ────────────────────────────────────────────────────────────
function LandingPage() {
  const { user } = useAuth()

  return (
    <>
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

      <div id="top" className="min-h-screen bg-[var(--landing-ink)] text-[var(--landing-cream)]">

        {/* ══════════════════════════════════════════════════════
            HERO — courtyard as full atmosphere
        ══════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen overflow-hidden">

          {/* Courtyard background — filtered to harmonise with the dark green palette */}
          <img
            src="/landing/courtyard.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: 'brightness(0.32) saturate(0.45)', objectPosition: 'center 40%' }}
          />

          {/* Layer 1: deep green atmosphere overlay */}
          <div className="absolute inset-0 bg-[var(--landing-green)]/60" />

          {/* Layer 2: vignette — dark at top and bottom, open in the middle */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,31,23,0.65)_0%,transparent_35%,transparent_65%,rgba(11,31,23,0.95)_100%)]" />

          {/* Layer 3: subtle star tile */}
          <div className="absolute inset-0 opacity-25" style={{ backgroundImage: STAR_TILE }} />

          {/* Gold hairline at top */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--landing-gold)]/55 to-transparent" />

          <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-8 lg:px-12">

            {/* ── Nav ── */}
            <header className="lp-in flex items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-white/20 bg-white shadow-[0_0_24px_rgba(216,184,102,0.22)]">
                  <img
                    src="/landing/institute-logo.jpg"
                    alt="Jamia Islamia Larkana"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.36em] text-[var(--landing-gold-soft)]">
                    Jamia Islamia Larkana
                  </p>
                  <p className="font-display text-lg leading-tight text-white">
                    Ishat ul Quran Wal Hadith
                  </p>
                </div>
              </div>

              <nav className="flex items-center gap-3">
                <a
                  href="#founder"
                  className="hidden rounded-full border border-white/15 px-5 py-2 text-sm text-white/60 transition-colors duration-200 hover:border-[var(--landing-gold)]/40 hover:text-white lg:inline-flex"
                >
                  Our Founder
                </a>
                <a
                  href="#pillars"
                  className="hidden rounded-full border border-white/15 px-5 py-2 text-sm text-white/60 transition-colors duration-200 hover:border-[var(--landing-gold)]/40 hover:text-white lg:inline-flex"
                >
                  Our Values
                </a>
                <Link
                  to={user ? '/dashboard' : '/login'}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--landing-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--landing-ink)] shadow-[0_4px_20px_rgba(216,184,102,0.3)] transition-opacity duration-200 hover:opacity-85"
                >
                  {user ? 'Dashboard' : 'School Portal'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </nav>
            </header>

            {/* ── Centred hero content ── */}
            <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">

              <p
                className="lp-up text-[10px] uppercase tracking-[0.5em] text-[var(--landing-gold-soft)]"
                style={{ animationDelay: '0.06s' }}
              >
                Larkana, Sindh · Pakistan
              </p>

              {/* Institute name — the primary identity */}
              <h1
                className="lp-up mt-6 font-display text-white"
                style={{
                  fontSize: 'clamp(3.2rem, 6.5vw, 6.5rem)',
                  lineHeight: '1.02',
                  animationDelay: '0.14s',
                }}
              >
                Jamia Islamia
                <br />
                <span className="text-[var(--landing-gold)]">Larkana</span>
              </h1>

              {/* Full name as subtitle */}
              <p
                className="lp-up mt-4 font-display italic text-white/65"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.75rem)', animationDelay: '0.22s' }}
              >
                Ishat ul Quaran Wal Hadith
              </p>

              {/* Thin gold rule */}
              <div
                className="lp-up mt-8 h-px w-20 bg-[var(--landing-gold)]/40"
                style={{ animationDelay: '0.28s' }}
              />

              <p
                className="lp-up mt-8 max-w-lg text-base leading-[1.9] text-white/58 sm:text-lg"
                style={{ animationDelay: '0.34s' }}
              >
                An institution of Quranic and Hadith sciences — serving students
                from Larkana, Sindh, and across Pakistan in the tradition of
                classical Islamic scholarship.
              </p>

              <div
                className="lp-up mt-10 flex flex-wrap items-center justify-center gap-4"
                style={{ animationDelay: '0.42s' }}
              >
                <Link
                  to={user ? '/dashboard' : '/login'}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--landing-gold)] px-7 py-3.5 text-sm font-semibold text-[var(--landing-ink)] shadow-[0_6px_28px_rgba(216,184,102,0.3)] transition-opacity duration-200 hover:opacity-85"
                >
                  {user ? 'Open Dashboard' : 'Enter School Portal'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#founder"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm text-white/70 transition-colors duration-200 hover:border-white/38 hover:text-white"
                >
                  Meet the Founder
                </a>
              </div>
            </div>

            {/* Scroll cue */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className="h-10 w-px bg-gradient-to-b from-transparent to-[var(--landing-gold)]/40" />
                <p className="text-[9px] uppercase tracking-[0.44em] text-white/25">Scroll</p>
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FOUNDER — one portrait, dignified composition
        ══════════════════════════════════════════════════════ */}
        <section
          id="founder"
          className="border-b border-black/[0.07] bg-[var(--landing-cream)] text-[var(--landing-ink)]"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
            <div className="grid gap-14 lg:grid-cols-[0.4fr_0.6fr] lg:items-center">

              {/* Portrait — single, clean */}
              <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-[0_20px_56px_rgba(0,0,0,0.13)]">
                <img
                  src="/landing/founder-portrait.jpg"
                  alt="Founder of Jamia Islamia Larkana"
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* Text */}
              <div className="lg:pl-4">
                <p className="text-[10px] uppercase tracking-[0.46em] text-[var(--landing-green)]/60">
                  Founder &amp; Muhtamim
                </p>

                <div className="mt-3 h-px w-10 bg-[var(--landing-green)]/22" />

                <h2
                  className="mt-5 font-display text-[var(--landing-ink)]"
                  style={{ fontSize: 'clamp(1.9rem, 3.8vw, 3.5rem)', lineHeight: '1.1' }}
                >
                  The founding vision
                  <br />
                  <span className="text-[var(--landing-green)]">of the Jamia.</span>
                </h2>

                <p className="mt-6 text-base leading-[1.9] text-[var(--landing-ink)]/65">
                  The Jamia was established on a single conviction — that the Quran
                  and Hadith must be transmitted to every new generation with the same
                  sincerity and care as every generation before. Under the founder's
                  guidance, it has grown into a place of learning, discipline, and
                  spiritual formation for students across Sindh.
                </p>

                <blockquote className="mt-8 border-l-[3px] border-[var(--landing-green)]/25 pl-5">
                  <p className="font-display text-xl italic leading-relaxed text-[var(--landing-green)] sm:text-2xl">
                    "Knowledge is a trust. We carry it,
                    <br />
                    preserve it, and pass it on."
                  </p>
                  <cite className="mt-4 block text-[10px] not-italic uppercase tracking-[0.28em] text-[var(--landing-ink)]/38">
                    — Founder, Jamia Islamia Larkana
                  </cite>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            PILLARS — arch cards, dark green
        ══════════════════════════════════════════════════════ */}
        <section
          id="pillars"
          className="relative overflow-hidden border-b border-white/10 bg-[var(--landing-ink-soft)]"
          style={{ backgroundImage: STAR_TILE }}
        >
          <div className="absolute inset-0 bg-[var(--landing-ink-soft)]/90" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
            <div className="mb-12">
              <p className="text-[10px] uppercase tracking-[0.46em] text-[var(--landing-gold-soft)]">
                What we stand on
              </p>
              <h2
                className="mt-3 font-display text-white"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)', lineHeight: '1.1' }}
              >
                Three pillars of the Jamia.
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {pillars.map(({ icon: Icon, title, body }) => (
                <article
                  key={title}
                  className="group relative flex flex-col items-center px-7 pb-9 pt-16 border border-white/[0.07] bg-white/[0.03] transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--landing-gold)]/22 hover:bg-white/[0.05] hover:shadow-[0_24px_64px_rgba(0,0,0,0.3)]"
                  style={archStyle}
                >
                  <div className="absolute top-7 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--landing-gold)]/10 text-[var(--landing-gold)] transition-colors duration-200 group-hover:bg-[var(--landing-gold)]/18">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-center font-display text-2xl text-white">{title}</h3>
                  <div className="mt-2.5 h-px w-8 bg-[var(--landing-gold)]/28" />
                  <p className="mt-4 text-center text-sm leading-[1.85] text-white/52">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            PORTAL CTA
        ══════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[var(--landing-cream)] text-[var(--landing-ink)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_100%_100%,rgba(23,71,55,0.06),transparent_55%)]" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.78fr] lg:items-center">

              <div>
                <p className="text-[10px] uppercase tracking-[0.46em] text-[var(--landing-green)]/55">
                  School Portal
                </p>
                <h2
                  className="mt-3 font-display text-[var(--landing-ink)]"
                  style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4.2rem)', lineHeight: '1.08' }}
                >
                  The Jamia, inside
                  <br />
                  <span className="text-[var(--landing-green)]">and out.</span>
                </h2>
                <p className="mt-5 max-w-lg text-base leading-[1.9] text-[var(--landing-ink)]/60">
                  Behind the public identity sits a working school system.
                  Administrators manage enrolment. Teachers record attendance.
                  Parents stay informed — all in one secure, role-based portal.
                </p>
                <div className="mt-9 flex flex-wrap gap-4">
                  <Link
                    to={user ? '/dashboard' : '/login'}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--landing-green)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_6px_28px_rgba(23,71,55,0.2)] transition-opacity duration-200 hover:opacity-85"
                  >
                    {user ? 'Go to Dashboard' : 'Sign In to Portal'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#top"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--landing-ink)]/16 px-7 py-3.5 text-sm text-[var(--landing-ink)]/55 transition-colors duration-200 hover:border-[var(--landing-ink)]/32 hover:text-[var(--landing-ink)]"
                  >
                    Back to Top
                  </a>
                </div>
              </div>

              {/* Who it's for */}
              <div className="rounded-2xl border border-[var(--landing-green)]/14 bg-[#0f3224] p-8 text-white shadow-[0_28px_72px_rgba(19,58,46,0.14)]">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--landing-gold-soft)]">
                  Who it's for
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    ['Admin',   'Enrolment, class management, and fee records'],
                    ['Teacher', 'Attendance marking and daily class oversight'],
                    ['Parent',  'Child progress, fee status, and school calendar'],
                  ].map(([role, desc]) => (
                    <div
                      key={role}
                      className="flex items-start gap-4 border-b border-white/[0.07] pb-4 last:border-0 last:pb-0"
                    >
                      <span className="mt-0.5 shrink-0 rounded-full bg-[var(--landing-gold)]/13 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--landing-gold-soft)]">
                        {role}
                      </span>
                      <p className="text-sm leading-[1.75] text-white/58">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════ */}
        <footer className="border-t border-white/10 bg-[var(--landing-ink)]">
          <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
            <div className="flex flex-col gap-4 text-sm text-white/32 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 text-[var(--landing-gold-soft)]/50" />
                <span>Jamia Islamia Larkana · Larkana, Sindh, Pakistan</span>
              </div>
              <span>School Management System · Phase 1</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}

export default LandingPage
