import { createContext, useContext } from 'react'

import { getUiText, type AppLanguage } from './i18n'

interface UiLanguageValue {
  language: AppLanguage
  setLanguage: (language: AppLanguage) => void
}

const defaultValue: UiLanguageValue = {
  language: 'en',
  setLanguage: () => {},
}

export const UiLanguageContext = createContext<UiLanguageValue>(defaultValue)

export function useUiLanguage() {
  const value = useContext(UiLanguageContext)

  return {
    ...value,
    text: getUiText(value.language),
  }
}
