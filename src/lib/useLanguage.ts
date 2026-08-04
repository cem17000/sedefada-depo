import { createContext, useContext } from 'react';
import { translations } from './i18n';
import type { Lang, Translations } from './i18n';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
  isRtl: boolean;
}

export const LanguageContext = createContext<LangCtx>({
  lang: 'tr',
  setLang: () => {},
  t: translations.tr,
  isRtl: false,
});

export function useLanguage() {
  return useContext(LanguageContext);
}
