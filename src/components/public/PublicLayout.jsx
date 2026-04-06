import { useEffect } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import PublicNavbar from './PublicNavbar'
import PublicFooter from './PublicFooter'

export default function PublicLayout({ children }) {
  const { isRTL } = useLanguage()

  // Apply dir to the layout wrapper only; portal routes are outside this component
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    return () => {
      document.documentElement.dir = 'ltr'
    }
  }, [isRTL])

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col bg-[var(--landing-cream)]"
    >
      <PublicNavbar />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
}
