import { useEffect, useState, type ReactNode } from 'react';
import { translations, LANGUAGES } from './i18n';
import type { Lang, Translations } from './i18n';
import { LanguageContext } from './useLanguage';

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Site her zaman Türkçe açılsın - localStorage'daki kaydedilmiş dili yoksay
  const [lang, setLangState] = useState<Lang>('tr');

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('sedefada-lang', l);
  };

  const isRtl = LANGUAGES.find((l) => l.code === lang)?.dir === 'rtl';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] as Translations, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}