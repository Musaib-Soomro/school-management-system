import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('public_lang') || 'ur'
  })

  const isRTL = lang === 'ur'

  function switchLang(newLang) {
    setLang(newLang)
    localStorage.setItem('public_lang', newLang)
  }

  function t(obj) {
    if (!obj) return ''
    if (typeof obj === 'string') return obj
    return obj[lang] || obj['en'] || ''
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, isRTL, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
