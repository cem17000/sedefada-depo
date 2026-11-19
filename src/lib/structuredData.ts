export type StructuredLang = 'tr' | 'en';

export const HOME_DESCRIPTIONS: Record<StructuredLang, string> = {
  tr: 'Sedef Adası\'nın tarihi, doğal yaşamı, ulaşımı, mimarisi, anıları, eski fotoğrafları, haritaları ve güncel ada yaşamı hakkında kapsamlı bilgi ve arşiv.',
  en: 'A comprehensive guide and archive about Sedef Island, including its history, nature, transport, architecture, memories, historic photographs, maps and island life.',
};

export function generateHomeStructuredData(lang: StructuredLang) {
  const homeUrl = lang === 'tr' ? 'https://sedefada.com/' : 'https://sedefada.com/en/';
  const organizationId = `${homeUrl}#organization`;
  const websiteId = `${homeUrl}#website`;
  const webpageId = `${homeUrl}#webpage`;
  const inLanguage = lang === 'tr' ? 'tr-TR' : 'en-US';

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': websiteId,
      name: 'sedefada.com',
      url: homeUrl,
      publisher: { '@id': organizationId },
      inLanguage,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': webpageId,
      name: lang === 'tr' ? 'Sedef Adası' : 'Sedef Island',
      url: homeUrl,
      description: HOME_DESCRIPTIONS[lang],
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
      inLanguage,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': organizationId,
      name: 'sedefada.com',
      url: homeUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${homeUrl}favicon.png`,
      },
    },
  ];
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/&/g, '\\u0026')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
