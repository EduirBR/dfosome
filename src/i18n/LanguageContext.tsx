import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { messages, type Lang, type MessageKey } from './messages'
import { LanguageContext } from './context'

const STORAGE_KEY = 'dfosome-lang'

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'es') return stored
  } catch {
    // ignore storage errors
  }
  return 'es'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore storage errors
    }
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      toggle: () => setLang((prev) => (prev === 'es' ? 'en' : 'es')),
      t: (key: MessageKey) => messages[lang][key],
    }),
    [lang],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}