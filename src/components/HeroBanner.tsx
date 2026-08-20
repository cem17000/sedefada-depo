import { useState, useEffect } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { useLanguage } from '../lib/useLanguage';
import { useLocation } from 'react-router-dom';

const IMAGES = [
  {
    src: '/sedeffoto.jpg',
    alt: 'Sedef Adası havadan görünüm',
    objectPosition: 'center center',
  },
  {
    src: '/sedefflower.webp',
    alt: 'Sedef Adası çiçeği - Lunaria',
    objectPosition: 'center center',
  },
];

const INTERVAL = 15000;
const FADE_DURATION = 1200;

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const { lang } = useLanguage();
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/en' || location.pathname === '/en/';
  const isTurkishHome = lang === 'tr' && location.pathname === '/';

  useEffect(() => {
    let fadeTimer: ReturnType<typeof setTimeout>;
    let swapTimer: ReturnType<typeof setTimeout>;

    const scheduleTransition = () => {
      fadeTimer = setTimeout(() => {
        setVisible(false);
      }, INTERVAL - FADE_DURATION);

      swapTimer = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % IMAGES.length);
        setVisible(true);
        scheduleTransition();
      }, INTERVAL);
    };

    scheduleTransition();

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(swapTimer);
    };
  }, []);

  const heroSubtitle = lang === 'tr'
    ? 'İstanbul Prens Adaları\'nın en küçük ve en doğusundaki ada. Tarih, doğa ve huzurun buluştuğu nokta.'
    : 'The smallest and easternmost of Istanbul\'s Princes\' Islands. Where history, nature and tranquility meet.';

  return (
    <div className="relative w-full h-56 md:h-96 overflow-hidden bg-sedef-bg flex items-center mt-24 md:mt-24">
      {/* İki görsel de ada fotoğrafının oranındaki aynı çerçeveyi kullanır. */}
      <div
        className="absolute right-0 top-1/2 z-0 aspect-[880/487] w-full -translate-y-1/2 pointer-events-none md:h-full md:w-auto"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 45%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 45%, black 100%)',
        }}
      >
        <OptimizedImage
          src={IMAGES[current].src}
          alt={IMAGES[current].alt}
          className="w-full h-full"
          style={{
            opacity: visible ? 0.8 : 0,
            transition: `opacity ${FADE_DURATION}ms ease-in-out`,
            objectPosition: IMAGES[current].objectPosition,
          }}
          objectFit="cover"
          objectPosition={IMAGES[current].objectPosition}
          widths={[]}
          priority={current === 0} // İlk resim öncelikli yüklensin
          loading={current === 0 ? 'eager' : 'lazy'}
          placeholder="blur"
        />
      </div>

      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-sedef-bg/45 via-transparent to-sedef-bg/10 md:from-sedef-bg/25" />

      {/* Metin Alanı */}
      <div className="relative z-10 px-6 md:px-16 w-full md:w-2/3 flex flex-col justify-center">
        <h1 className="leading-tight drop-shadow-md">
          {(!isHome || isTurkishHome) && (
            <span className="block text-lg md:text-2xl font-semibold text-teal-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {lang === 'tr' ? "Marmara'nın İncisi" : 'The Pearl of Marmara'}
            </span>
          )}
          <span className="block text-3xl md:text-6xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {lang === 'tr' ? 'Sedef Adası' : 'Sedef Island'}
          </span>
        </h1>
        {(!isHome || isTurkishHome) && (
          <p className="mt-3 text-xs md:text-base text-white font-medium italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] max-w-[220px] md:max-w-none">
            {heroSubtitle}
          </p>
        )}
      </div>
    </div>
  );
}