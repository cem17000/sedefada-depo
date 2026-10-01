import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const DRAGOS_STREAM_URL = 'https://kamerayayin.ibb.istanbul/turistikcam/dragos.stream/playlist.m3u8';

export function LiveCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);

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
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="h-dvh w-full object-cover"
      aria-label="Dragos canlı kamera görüntüsü"
    />
  );
}