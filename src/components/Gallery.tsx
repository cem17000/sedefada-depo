import { useState } from 'react';
import { Images, X } from 'lucide-react';
import { useLanguage } from '../lib/useLanguage';

interface GalleryProps {
  images: { url: string; title: string }[];
}

export function Gallery({ images }: GalleryProps) {
  const { t } = useLanguage();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Images className="w-12 h-12 text-sedef-accent/70 mb-4" />
        <h3 className="text-lg font-semibold text-sedef-primary mb-2">{t.galleryEmpty}</h3>
        <p className="text-sm text-sedef-secondary">{t.galleryEmptyDesc}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fade-in">
        {images.map((image, idx) => (
          <div
            key={idx}
            onClick={() => setLightboxImage(image.url)}
            className="aspect-square rounded-xl overflow-hidden cursor-pointer border border-sedef-border hover:border-sedef-accent hover:scale-[1.03] hover:shadow-2xl hover:shadow-sedef-accent/20 transition-all duration-300 group relative"
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sedef-bg/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <p className="text-xs text-sedef-primary truncate">{image.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-sedef-bg/95 backdrop-blur-sm flex items-center justify-center p-10 cursor-pointer"
        >
          <button
            className="absolute top-8 right-10 text-sedef-primary hover:text-sedef-accent transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightboxImage}
            alt="Tam boy görsel"
            className="max-w-full max-h-[85vh] rounded-xl shadow-2xl border border-sedef-border/50"
          />
        </div>
      )}
    </>
  );
}
