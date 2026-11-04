import type { Lang } from './i18n';

export const ROUTES = {
  home: { tr: '/', en: '/en/' },
  sedefada_tarihi: { tr: '/sedef-adasi-ve-tarihi/', en: '/en/history/' },
  guncel_gelismeler: { tr: '/guncel-gelismeler/', en: '/en/news/' },
  ulasim_tarife: { tr: '/ulasim-tarifesi/', en: '/en/transportation/' },
  anilar: { tr: '/anilar/', en: '/en/memories/' },
  videolar: { tr: '/videolar/', en: '/en/videos/' },
  kis_baskadir: { tr: '/kis-baskadir/', en: '/en/winter/' },
  web: { tr: '/web-canli/', en: '/en/live-camera/' },
  camera: { tr: '/web-canli/kamera/', en: '/en/live-camera/view/' },
  ekoloji: { tr: '/ekoloji/', en: '/en/ecology/' },
  iletisim_bilgileri: { tr: '/cesitli-iletisim-bilgisi/', en: '/en/useful-contacts/' },
  about: { tr: '/site-hakkinda-iletisim/', en: '/en/about-contact/' },
  privacy: { tr: '/gizlilik-cerezler/', en: '/en/privacy-cookies/' },
} as const;

export type RouteId = keyof typeof ROUTES;

function normalizedPath(path: string) {
  return path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}/`;
}

export function getRouteId(path: string): RouteId | undefined {
  const normalized = normalizedPath(path);
  return (Object.keys(ROUTES) as RouteId[]).find((id) => {
    const route = ROUTES[id];
    return normalized === route.tr || normalized === route.en ||
      (id !== 'home' && normalized === `/en${route.tr}`);
  });
}

export function localizedPath(path: string, lang: Lang): string | undefined {
  const id = getRouteId(path);
  return id ? ROUTES[id][lang] : undefined;
}

export function normalizeContentLinks(content: string | undefined): string | undefined {
  return content?.replace(/href=(["'])(\/[^"'?#]*)(\?[^"'#]*)?(#[^"']*)?\1/g,
    (original, quote: string, path: string, query: string | undefined, hash: string | undefined) => {
      const target = localizedPath(path, path.startsWith('/en/') ? 'en' : 'tr');
      return target ? `href=${quote}${target}${query ?? ''}${hash ?? ''}${quote}` : original;
    });
}
