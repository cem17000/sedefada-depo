import { useEffect, useState, type ReactNode } from 'react';
import { translations, LANGUAGES } from './i18n';
import type { Lang, Translations } from './i18n';
import { LanguageContext } from './useLanguage';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    window.location.pathname === '/en' || window.location.pathname.startsWith('/en/') ? 'en' : 'tr'
  );

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