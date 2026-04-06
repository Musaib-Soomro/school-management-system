import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { t as T } from '../../data/translations'
import { contactContent } from '../../data/publicContent'
import PublicLayout from '../../components/public/PublicLayout'
import PageHero from '../../components/public/PageHero'

const STAR_TILE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpolygon points='32%2C2 37%2C20 55%2C11 46%2C28 64%2C32 46%2C36 55%2C53 37%2C44 32%2C62 27%2C44 9%2C53 18%2C36 0%2C32 18%2C28 9%2C11 27%2C20' fill='none' stroke='rgba(216%2C184%2C102%2C0.07)' stroke-width='0.6'/%3E%3C/svg%3E")`

// SVG icon map — no emoji, no color rendering issues on dark backgrounds
const ICONS = {
  pin: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z" />
      <circle cx="12" cy="8" r="2" strokeWidth={1.8} />
    </svg>
  ),
  phone: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.5C3 14.06 9.94 21 18.5 21c.386 0 .77-.014 1.148-.042.435-.032.653-.048.845-.152a1.5 1.5 0 00.556-.556c.104-.192.12-.41.152-.845L21.5 17.5a1.5 1.5 0 00-1.11-1.46l-3.5-.875a1.5 1.5 0 00-1.55.535l-.875 1.166A12.03 12.03 0 018.034 9.534l1.166-.875a1.5 1.5 0 00.535-1.55L8.86 3.61A1.5 1.5 0 007.4 2.5L5.545 2.3c-.435-.032-.653-.048-.845.152a1.5 1.5 0 00-.556.556C4.04 3.2 4.025 3.418 3.993 3.853 3.964 4.23 3.95 4.614 3.95 5 3.95 5.167 3.95 5.333 3.95 5.5H3z" />
    </svg>
  ),
  mail: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
}

function InfoRow({ iconKey, label, children, isRTL }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-white/[0.07] last:border-0">
      <div className="flex-shrink-0 h-8 w-8 rounded-full border flex items-center justify-center mt-0.5" style={{ background: 'rgba(216,184,102,0.10)', borderColor: 'rgba(216,184,102,0.20)', color: 'rgba(216,184,102,0.70)' }}>
        {ICONS[iconKey]}
      </div>
      <div className={isRTL ? 'text-right' : ''}>
        <p className={`text-[9px] uppercase tracking-[0.32em] mb-1 ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`} style={{ color: 'rgba(247,240,221,0.40)' }}>
          {label}
        </p>
        {children}
      </div>
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-[9px] uppercase tracking-[0.28em] text-[var(--landing-ink)]/45 mb-2">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass = (isRTL) =>
  `w-full rounded-xl border border-[var(--landing-ink)]/14 bg-[var(--landing-cream)]/60 px-4 py-3 text-sm text-[var(--landing-ink)] placeholder:text-[var(--landing-ink)]/25 focus:outline-none focus:border-[var(--landing-green)]/45 focus:ring-1 focus:ring-[var(--landing-green)]/20 transition-all duration-200 ${isRTL ? 'text-right font-urdu' : ''}`

export default function ContactPage() {
  const { isRTL, t } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <PublicLayout>
      <PageHero
        title={t(contactContent.title)}
        crumb={`${t(T.home)} / ${t(T.contact)}`}
      />

      <section className="bg-[var(--landing-cream)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-start ${isRTL ? 'lg:grid-cols-[1fr_0.85fr]' : ''}`}>

            {/* ── Left: Contact info ── */}
            <div className={isRTL ? 'lg:order-2' : ''}>

              {/* Main contact — atmospheric dark card */}
              <div
                className="relative overflow-hidden rounded-2xl mb-6"
                style={{ backgroundImage: STAR_TILE, backgroundSize: '64px 64px' }}
              >
                <div className="absolute inset-0 bg-[var(--landing-green)]" style={{ opacity: 0.97 }} />
                <div className="h-px bg-gradient-to-r from-transparent via-[var(--landing-gold)]/50 to-transparent relative" />

                <div className={`relative px-7 py-8 ${isRTL ? 'text-right' : ''}`}>
                  <p className={`text-[9px] uppercase tracking-[0.36em] text-[var(--landing-gold)]/55 mb-3 ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`}>
                    {t(T.contact)}
                  </p>
                  <h2
                    className={`font-display text-[var(--landing-cream)] mb-6 ${isRTL ? 'font-urdu' : ''}`}
                    style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)', lineHeight: isRTL ? 1.95 : 1.2 }}
                  >
                    {isRTL ? 'جامعہ سے رابطہ کریں' : 'Reach the Jamia'}
                  </h2>

                  <InfoRow iconKey="pin" label={t(T.address)} isRTL={isRTL}>
                    <span className={`text-sm ${isRTL ? 'font-urdu text-base' : ''}`} style={{ color: 'rgba(247,240,221,0.72)' }}>
                      {t(contactContent.address)}
                    </span>
                  </InfoRow>
                  <InfoRow iconKey="phone" label={t(T.phone)} isRTL={isRTL}>
                    <a href={`tel:${contactContent.phone}`} className="text-sm hover:text-[var(--landing-gold)] transition-colors" style={{ color: 'rgba(247,240,221,0.72)' }} dir="ltr">
                      {contactContent.phone}
                    </a>
                  </InfoRow>
                  <InfoRow iconKey="mail" label={t(T.email)} isRTL={isRTL}>
                    <a href={`mailto:${contactContent.email}`} className="text-[11px] hover:text-[var(--landing-gold)] transition-colors break-all" style={{ color: 'rgba(247,240,221,0.72)' }} dir="ltr">
                      {contactContent.email}
                    </a>
                  </InfoRow>
                </div>
              </div>

              {/* Department contact cards */}
              <div className={`mb-3 ${isRTL ? 'text-right' : ''}`}>
                <p className={`text-[9px] uppercase tracking-[0.36em] text-[var(--landing-green)]/50 mb-3 ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`}>
                  {t(T.departmentContacts)}
                </p>
              </div>
              <div className="space-y-2">
                {contactContent.departments.map((dept, i) => (
                  <div
                    key={i}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--landing-ink)]/9 bg-white px-5 py-3.5 hover:border-[var(--landing-green)]/20 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[var(--landing-gold)]/45 flex-shrink-0" />
                      <span className={`text-sm text-[var(--landing-ink)]/70 group-hover:text-[var(--landing-ink)] transition-colors ${isRTL ? 'font-urdu text-base' : ''}`}>
                        {t(dept.label)}
                      </span>
                    </div>
                    <span className="text-[10px] text-[var(--landing-ink)]/30 font-mono" dir="ltr">
                      {contactContent.phone}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Inquiry form ── */}
            <div
              className={`bg-white border border-[var(--landing-ink)]/9 shadow-[0_12px_48px_rgba(11,31,23,0.07)] overflow-hidden ${isRTL ? 'lg:order-1' : ''}`}
              style={{ borderRadius: '1.5rem' }}
            >
              <div className="h-0.5 bg-gradient-to-r from-transparent via-[var(--landing-gold)]/45 to-transparent" />

              <div className={`p-8 sm:p-10 ${isRTL ? 'text-right' : ''}`}>
                <p className={`text-[9px] uppercase tracking-[0.36em] text-[var(--landing-green)]/45 mb-2 ${isRTL ? 'font-urdu tracking-normal text-xs' : ''}`}>
                  {t(T.contact)}
                </p>
                <h2
                  className={`font-display text-[var(--landing-ink)] mb-7 ${isRTL ? 'font-urdu' : ''}`}
                  style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', lineHeight: 1.2 }}
                >
                  {t(T.inquiryForm)}
                </h2>

                {sent ? (
                  <div className={`py-14 ${isRTL ? 'text-right' : 'text-center'}`}>
                    {/* Ornament */}
                    <div className="flex items-center gap-3 mb-6 justify-center">
                      <div className="h-px w-8 bg-[var(--landing-gold)]/35" />
                      <div className="h-2 w-2 border border-[var(--landing-gold)]/45 rotate-45" />
                      <div className="h-px w-8 bg-[var(--landing-gold)]/35" />
                    </div>
                    <p className={`font-display text-[var(--landing-green)] mb-2 ${isRTL ? 'font-urdu' : ''}`} style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)' }}>
                      {isRTL ? 'پیغام موصول ہوگیا' : 'Message received'}
                    </p>
                    <p className={`text-sm text-[var(--landing-ink)]/45 ${isRTL ? 'font-urdu' : ''}`}>
                      {isRTL ? 'ہم جلد رابطہ کریں گے' : 'We will be in touch soon'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <FormField label={isRTL ? 'آپ کا نام' : t(T.yourName)}>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className={inputClass(isRTL)}
                        placeholder={isRTL ? 'نام درج کریں' : 'Enter your name'}
                      />
                    </FormField>

                    <FormField label={isRTL ? 'آپ کا ای میل' : t(T.yourEmail)}>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full rounded-xl border border-[var(--landing-ink)]/14 bg-[var(--landing-cream)]/60 px-4 py-3 text-sm text-[var(--landing-ink)] placeholder:text-[var(--landing-ink)]/25 focus:outline-none focus:border-[var(--landing-green)]/45 focus:ring-1 focus:ring-[var(--landing-green)]/20 transition-all duration-200"
                        placeholder="email@example.com"
                        dir="ltr"
                      />
                    </FormField>

                    <FormField label={isRTL ? 'پیغام' : t(T.yourMessage)}>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        className={inputClass(isRTL)}
                        style={{ resize: 'none' }}
                        placeholder={isRTL ? 'اپنا پیغام یہاں لکھیں' : 'Write your message here'}
                      />
                    </FormField>

                    <button
                      type="submit"
                      className={`w-full rounded-xl bg-[var(--landing-green)] py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_4px_20px_rgba(23,71,55,0.2)] hover:bg-[var(--landing-ink-soft)] active:scale-[0.99] transition-all duration-200 ${isRTL ? 'font-urdu tracking-normal text-sm' : ''}`}
                    >
                      {t(T.sendMessage)}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
