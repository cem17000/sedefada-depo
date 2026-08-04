import { useState, useEffect } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { useLanguage } from '../lib/useLanguage';

const IMAGES = [
  {
    src: '/sedefflower.jpg',
    alt: 'Sedef Adası çiçeği - Lunaria',
    objectPosition: 'center center',
  },
  {
    src: '/sedef-adasi-all.jpg',
    alt: 'Sedef Adası havadan görünüm',
    objectPosition: 'center 40%',
  },
];

const INTERVAL = 20000; // 20 saniye
const FADE_DURATION = 1500; // ms

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % IMAGES.length);
        setVisible(true);
      }, FADE_DURATION);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const heroSubtitle = lang === 'tr'
    ? 'İstanbul Prens Adaları\'nın en küçük ve en doğusundaki ada. Tarih, doğa ve huzurun buluştuğu nokta.'
    : 'The smallest and easternmost of Istanbul\'s Princes\' Islands. Where history, nature and tranquility meet.';

  return (
    <div className="relative w-full h-40 md:h-64 overflow-hidden bg-sedef-bg flex items-center mt-24 md:mt-24">
      {/* Resim Alanı (Mobil için daha yoğun degrade maskesi) */}
      <div
        className="absolute right-0 top-0 h-full w-full md:w-3/4 z-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to right, transparent 20%, black 90%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 20%, black 90%)',
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
          priority={current === 0} // İlk resim öncelikli yüklensin
          loading={current === 0 ? 'eager' : 'lazy'}
          placeholder="blur"
        />
      </div>

      {/* Metin Alanı */}
      <div className="relative z-10 px-6 md:px-16 w-full md:w-2/3 flex flex-col justify-center">
        <h1 className="leading-tight drop-shadow-md">
          <span className="block text-lg md:text-2xl font-semibold text-teal-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {lang === 'tr' ? "Marmara'nın İncisi" : 'The Pearl of Marmara'}
          </span>
          <span className="block text-3xl md:text-6xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {lang === 'tr' ? 'Sedef Adası' : 'Sedef Island'}
          </span>
        </h1>
        <p className="mt-3 text-xs md:text-base text-white font-medium italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] max-w-[220px] md:max-w-none">
          {heroSubtitle}
        </p>
      </div>
    </div>
  );
}