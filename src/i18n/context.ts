import { createContext } from 'react'
import type { Lang, MessageKey } from './messages'

export interface LanguageContextValue {
  lang: Lang
  toggle: () => void
  t: (key: MessageKey) => string
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)