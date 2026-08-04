import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  widths?: number[];
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * Optimize edilmiş resim bileşeni
 * - WebP/AVIF format desteği
 * - Lazy loading
 * - Responsive srcset
 * - Blur placeholder
 */
export function OptimizedImage({
  src,
  alt,
  className = '',
  style,
  loading = 'lazy',
  priority = false,
  widths = [320, 640, 750, 828, 1080, 1200, 1920, 2048],
  sizes,
  objectFit = 'cover',
  objectPosition = 'center',
  placeholder = 'blur',
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Priority resimler hemen görünsün
  const imgRef = useRef<HTMLImageElement>(null);

  // Lazy loading için Intersection Observer
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px', // Resim viewport'a 200px kala yüklemeye başla
        threshold: 0,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  // Srcset oluştur
  const srcSet = widths
    .map((width) => {
      // Orijinal src'den yola çıkarak farklı boyutlarda URL'ler oluştur
      // Vite plugin otomatik olarak farklı boyutlarda WebP/AVIF üretecek
      const ext = src.split('.').pop();
      const name = src.replace(`.${ext}`, '');
      return `${name}-${width}w.${ext} ${width}w`;
    })
    .join(', ');

  // Fallback src (eski tarayıcılar için)
  const fallbackSrc = src;

  if (!isInView) {
    // Henüz viewport'ta değil, placeholder göster
    return (
      <div
        ref={imgRef as React.RefObject<HTMLDivElement>}
        className={`relative overflow-hidden ${className}`}
        style={{
          ...style,
          backgroundColor: placeholder === 'blur' ? '#f0f0f0' : 'transparent',
        }}
      >
        {placeholder === 'blur' && blurDataURL && (
          <img
            src={blurDataURL}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50"
            aria-hidden="true"
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Blur placeholder */}
      {placeholder === 'blur' && !isLoaded && blurDataURL && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 transition-opacity duration-500"
          aria-hidden="true"
        />
      )}

      {/* Ana resim */}
      <img
        ref={imgRef}
        src={fallbackSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding="async"
        className={`w-full h-full transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          objectFit,
          objectPosition,
        }}
        onLoad={() => setIsLoaded(true)}
      />

      {/* Noscript fallback */}
      <noscript>
        <img
          src={fallbackSrc}
          alt={alt}
          className={className}
          style={{ ...style, objectFit, objectPosition }}
          loading={loading}
        />
      </noscript>
    </div>
  );
}

/**
 * Basit optimize edilmiş resim hook'u
 * Resim ön yükleme için kullanılır
 */
export function usePreloadImage(src: string) {
  useEffect(() => {
    const img = new Image();
    img.src = src;
    // Ön yükleme tamamlandı
  }, [src]);
}

/**
 * Resim boyutlarını hesapla
 */
export function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
    img.src = src;
  });
}