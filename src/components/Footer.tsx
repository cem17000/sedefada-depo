import { useLanguage } from '../lib/useLanguage';
import { Link } from 'react-router-dom';

export function Footer() {
  const { t, lang } = useLanguage();

  // Internal linking için sayfa linkleri
  const footerLinks = lang === 'tr' ? [
    { href: '/sedef-adasi-ve-tarihi', label: 'Sedef Adası Tarihi' },
    { href: '/anilar', label: 'Anılar' },
    { href: '/videolar', label: 'Videolar' },
    { href: '/ulasim-tarifesi', label: 'Ulaşım Rehberi' },
    { href: '/kis-baskadir', label: 'Kış Manzaraları' },
  ] : [
    { href: '/sedef-adasi-ve-tarihi', label: 'History of Sedef Island' },
    { href: '/anilar', label: 'Island Memories' },
    { href: '/videolar', label: 'Videos' },
    { href: '/ulasim-tarifesi', label: 'Transportation Guide' },
    { href: '/kis-baskadir', label: 'Winter Scenes' },
  ];

  return (
    <footer className="bg-sedef-bg/80 border-t border-sedef-border py-10 px-6 md:px-16 mt-16">
      {/* Internal linking bölümü */}
      <div className="max-w-4xl mx-auto mb-8">
        <h3 className="text-sm font-semibold text-sedef-primary mb-4 text-center uppercase tracking-wider">
          {lang === 'tr' ? 'Sedef Adası\'nı Keşfedin' : 'Explore Sedef Island'}
        </h3>
        <nav className="flex flex-wrap justify-center gap-3 md:gap-x-6 md:gap-y-2" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm md:text-base text-sedef-secondary hover:text-sedef-accent transition-colors duration-200 px-3 py-2 -mx-3 -my-2 rounded-lg hover:bg-sedef-accent/5 min-h-[44px] flex items-center justify-center"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Telif hakkı ve lisans bilgisi */}
      <div className="border-t border-sedef-border pt-6">
        <p className="text-sm text-sedef-secondary text-center">
          &copy; 2026 <strong className="text-sedef-primary">sedefada.com</strong>{' '}
          {t.footerRights}
        </p>
        <p className="text-[11px] text-sedef-secondary/60 mt-2 text-center">
          {lang === 'tr' 
            ? 'İstanbul Prens Adaları\'nın en küçük ve en doğusundaki ada.' 
            : 'The smallest and easternmost island of Istanbul\'s Princes\' Islands.'}
        </p>
      </div>
    </footer>
  );
}
