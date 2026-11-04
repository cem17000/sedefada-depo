import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { useLanguage } from '../lib/useLanguage';

const DRAGOS_STREAM_URL = 'https://kamerayayin.ibb.istanbul/turistikcam/dragos.stream/playlist.m3u8';

interface LiveCameraProps {
  onClose: () => void;
}

export function LiveCamera({ onClose }: LiveCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { lang } = useLanguage();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = DRAGOS_STREAM_URL;
      void video.play().catch(() => undefined);
      return;
    }

    if (!Hls.isSupported()) return;

    const hls = new Hls();
    hls.loadSource(DRAGOS_STREAM_URL);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      void video.play().catch(() => undefined);
    });

    return () => hls.destroy();
  }, []);

  return (
    <div className="relative h-dvh w-full bg-black">
      <h1 className="sr-only">{lang === 'tr' ? 'Canlı Marmara Görüntüsü' : 'Live Marmara View'}</h1>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="h-full w-full object-cover"
        aria-label={lang === 'tr' ? 'Dragos canlı kamera görüntüsü' : 'Live camera view from Dragos'}
      />
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label={lang === 'tr' ? 'Canlı kamera görüntüsünü kapat' : 'Close live camera view'}
      >
        <X className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  );
}