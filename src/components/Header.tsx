import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../lib/useLanguage';
import { LANGUAGES } from '../lib/i18n';
import type { Lang } from '../lib/i18n';
import { useLocation, useNavigate } from 'react-router-dom';

export function Header() {
  const { lang, setLang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l: { code: Lang; label: string; flag: string; dir?: 'rtl' | undefined; }) => l.code === lang)! as { code: Lang; label: string; flag: string; dir?: 'rtl' | undefined; };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Dil değiştiğinde URL'i güncelle
  const handleLanguageChange = (newLang: Lang) => {
    setLang(newLang);
    setOpen(false);
    
    // Mevcut pathname'i al ve normalize et (sondaki /'ları kaldır, sadece / ise bırak)
    let currentPath = location.pathname;
    
    // Eğer /en/ prefix'i varsa kaldır
    if (currentPath.startsWith('/en/')) {
      currentPath = currentPath.substring(4); // '/en/' kısmını kaldır
    } else if (currentPath === '/en') {
      currentPath = '/';
    }
    
    // Path'i normalize et (çift slash'ları kaldır)
    currentPath = currentPath.replace(/\/+/g, '/');
    if (currentPath !== '/' && currentPath.endsWith('/')) {
      currentPath = currentPath.slice(0, -1);
    }
    
    // Yeni dil için URL oluştur
    if (newLang === 'en') {
      // İngilizce için /en/ prefix'i ekle
      const newPath = currentPath === '/' ? '/en' : `/en${currentPath}`;
      navigate(newPath);
    } else {
      // Türkçe için prefix'siz URL
      navigate(currentPath);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[70px] bg-sedef-bg/85 backdrop-blur-lg border-b border-sedef-border z-50 flex justify-between items-center px-4 md:px-10 transition-all duration-300">
      <a href={lang === 'en' ? '/en' : '/'} className="flex items-center gap-3 no-underline text-sedef-primary">
        <div
          className="w-[140px] h-[58px] overflow-hidden flex items-center justify-center"
          style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)' }}
        >
          <img
            src="/sedef-adasi-marti.webp"
            alt="Martı"
            className="w-[160px] h-[120px] object-contain"
            style={{ transform: 'scaleX(-1) rotate(-15deg)' }}
          />
        </div>
        <span className="text-xl font-outfit font-bold tracking-wide">sedefada.com</span>
      </a>

      {/* Language switcher */}
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-sedef-border bg-sedef-bg/30 hover:border-sedef-accent/60 transition-all text-sm text-sedef-primary"
        >
          <span>{current.flag}</span>
          <span className="hidden sm:inline text-xs font-medium">{current.label}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-sedef-secondary transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-sedef-card-bg border border-sedef-border rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
            {LANGUAGES.map((l: { code: Lang; label: string; flag: string; dir?: 'rtl' | undefined; }) => (
              <button
                key={l.code}
                onClick={() => handleLanguageChange(l.code)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                  lang === l.code
                    ? 'bg-sedef-accent/10 text-sedef-accent font-semibold'
                    : 'text-sedef-primary hover:bg-sedef-border/20'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
                {lang === l.code && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sedef-accent" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}