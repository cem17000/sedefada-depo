import { useEffect } from 'react';

export interface SEOData {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string[];
  noIndex?: boolean;
}

const BASE_URL = 'https://sedefada.com';

export function useSEO(data: SEOData) {
  useEffect(() => {
    // Set document title
    const originalTitle = document.title;
    document.title = data.title;

    // Update or create meta description
    updateMetaTag('name', 'description', data.description);

    // Update keywords if provided
    if (data.keywords && data.keywords.length > 0) {
      updateMetaTag('name', 'keywords', data.keywords.join(', '));
    }

    // Set canonical URL
    const canonicalUrl = data.canonicalUrl || BASE_URL;
    updateCanonicalLink(canonicalUrl);

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', data.title);
    updateMetaTag('property', 'og:description', data.description);
    updateMetaTag('property', 'og:url', canonicalUrl);
    
    if (data.ogImage) {
      updateMetaTag('property', 'og:image', data.ogImage);
    }
    
    if (data.ogType) {
      updateMetaTag('property', 'og:type', data.ogType);
    }

    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:title', data.title);
    updateMetaTag('name', 'twitter:description', data.description);

    // Set robots meta tag
    const robotsContent = data.noIndex ? 'noindex, nofollow' : 'index, follow';
    updateMetaTag('name', 'robots', robotsContent);

    // Cleanup function to restore original title
    return () => {
      document.title = originalTitle;
    };
  }, [data.title, data.description, data.canonicalUrl, data.ogImage, data.ogType, data.keywords, data.noIndex]);
}

function updateMetaTag(attributeType: 'name' | 'property', attributeName: string, content: string) {
  const selector = `meta[${attributeType}="${attributeName}"]`;
  let metaTag = document.querySelector(selector) as HTMLMetaElement;
  
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attributeType, attributeName);
    document.head.appendChild(metaTag);
  }
  
  metaTag.content = content;
}

function updateCanonicalLink(url: string) {
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  
  canonicalLink.href = url;
}

// Helper function to generate page-specific SEO data with optimized titles and descriptions
export function getPageSEO(
  pageId: string, 
  lang: string = 'tr',
  customData?: Partial<SEOData>
): SEOData {
  const pages: Record<string, { title: string; description: string; keywords: string[] }> = {
    'sedefada_tarihi': {
      title: lang === 'tr' 
        ? 'Sedef Adası Tarihi - İstanbul\'un Gizli Cenneti | sedefada.com' 
        : 'Sedef Island History - Istanbul\'s Hidden Paradise | sedefada.com',
      description: lang === 'tr'
        ? 'Sedef Adası, İstanbul Prens Adaları\'nın en küçük ve en doğusundaki ada. Bizans döneminden günümüze tarihçesi, Terebinthos, manastır kalıntıları ve doğal güzellikleri keşfedin.'
        : 'Discover Sedef Island, the smallest of Istanbul\'s Princes\' Islands. Explore its history from Byzantine times, Terebinthos, monastery ruins, and natural beauties.',
      keywords: lang === 'tr'
        ? ['Sedef Adası', 'Prens Adaları', 'İstanbul adaları', 'Terebinthos', 'Bizans manastırı', 'ada tarihi', 'Sedef Adası gezisi']
        : ['Sedef Island', 'Princes Islands', 'Istanbul islands', 'Terebinthos', 'Byzantine monastery', 'island history', 'Sedef Island tour']
    },
    'anilar': {
      title: lang === 'tr'
        ? 'Sedef Adası Anıları - Ada Hayatı ve Hatıralar | sedefada.com'
        : 'Sedef Island Memories - Island Life & Stories | sedefada.com',
      description: lang === 'tr'
        ? 'Sedef Adası sakinlerinin anıları, Mahama lokantası, Suna Giritli\'nin Kafkas pilavı partileri ve ada yaşamının unutulmaz hikayeleri. Duygusal bir ada yolculuğu.'
        : 'Memories of Sedef Island residents, Mahama restaurant, Suna Giritli\'s Caucasian pilaf parties, and unforgettable island life stories. An emotional island journey.',
      keywords: lang === 'tr'
        ? ['Sedef Adası anıları', 'ada hayatı', 'Mahama', 'Suna Giritli', 'ada sakinleri', 'Sedef Adası hikayeleri']
        : ['Sedef Island memories', 'island life', 'Mahama', 'Suna Giritli', 'islanders', 'Sedef Island stories']
    },
    'ekoloji': {
      title: lang === 'tr'
        ? 'Sedef Adası Ekolojisi - Flora, Fauna ve Doğal Yaşam | sedefada.com'
        : 'Sedef Island Ecology - Flora, Fauna & Wildlife | sedefada.com',
      description: lang === 'tr'
        ? 'Sedef Adası\'nın doğal yapısı, florası, faunası, göçmen kuşları, deniz ekosistemi, koruma statüleri ve ekolojik geleceği hakkında kapsamlı bilgi.'
        : 'Explore the natural structure, flora, fauna, migratory birds, marine ecosystem, conservation status and ecological future of Sedef Island.',
      keywords: lang === 'tr'
        ? ['Sedef Adası ekolojisi', 'Sedef Adası flora', 'Sedef Adası fauna', 'göçmen kuşlar', 'Marmara Denizi ekosistemi']
        : ['Sedef Island ecology', 'Sedef Island flora', 'Sedef Island fauna', 'migratory birds', 'Marmara Sea ecosystem']
    },
    'videolar': {
      title: lang === 'tr'
        ? 'Sedef Adası Videoları - Belgesel ve Tarihi Görüntüler | sedefada.com'
        : 'Sedef Island Videos - Documentary & Historical Footage | sedefada.com',
      description: lang === 'tr'
        ? 'Sedef Adası belgeseli, tarihi videolar ve ada yaşamından görüntüler. Adamızın geçmişine, doğal güzelliklerine ve kültürüne video yolculuğu yapın.'
        : 'Sedef Island documentary, historical videos and footage from island life. Take a video journey through our island\'s past, natural beauties and culture.',
      keywords: lang === 'tr'
        ? ['Sedef Adası belgesel', 'ada videoları', 'Sedef Adası tarihi video', 'Sedef Adası film']
        : ['Sedef Island documentary', 'island videos', 'Sedef Island historical video', 'Sedef Island film']
    },
    'ulasim_tarife': {
      title: lang === 'tr'
        ? 'Sedef Adası Ulaşım Rehberi 2026 - Nasıl Gidilir? | sedefada.com'
        : 'How to Get to Sedef Island 2026 - Transportation Guide | sedefada.com',
      description: lang === 'tr'
        ? 'Sedef Adası\'na Kartal\'dan metro ile ulaşım, güncel tekne ve vapur tarifeleri, İBB Deniz Taksi bilgileri. İstanbul\'un her yerinden Kartal\'a metro rota rehberi.'
        : 'Getting to Sedef Island by metro from Kartal, current boat and ferry schedules, İBB Sea Taxi info. Metro route guide to Kartal from anywhere in Istanbul.',
      keywords: lang === 'tr'
        ? ['Sedef Adası ulaşım', 'Kartal Sedef motor', 'İBB Deniz Taksi', 'metro ile Sedef Adası', 'Sedef Adası vapur']
        : ['Sedef Island transportation', 'Kartal Sedef boat', 'İBB Sea Taxi', 'Sedef Island by metro', 'Sedef Island ferry']
    },
    'kis_baskadir': {
      title: lang === 'tr'
        ? 'Sedef Adası\'nda Kış - Lodos, Kar ve Sessizlik | sedefada.com'
        : 'Winter on Sedef Island - Lodos, Snow & Silence | sedefada.com',
      description: lang === 'tr'
        ? 'Sedef Adası\'nda kış mevsimi, lodos fırtınaları, kar manzaraları ve kışın adada kalmanın eşsiz deneyimi. Yaz kalabalıklarından uzak, sessiz ve huzurlu ada yaşamı.'
        : 'Winter on Sedef Island, lodos storms, snow landscapes and the unique experience of staying on the island in winter. Peaceful island life away from summer crowds.',
      keywords: lang === 'tr'
        ? ['Sedef Adası kış', 'lodos', 'ada kış manzarası', 'kışın Sedef Adası', 'Sedef Adası kar']
        : ['Sedef Island winter', 'lodos', 'island winter landscape', 'Sedef Island in winter', 'Sedef Island snow']
    },
    'web': {
      title: lang === 'tr'
        ? 'Sedef Adası Canlı Kamera - Marmara Deniz Manzarası | sedefada.com'
        : 'Sedef Island Live Camera - Marmara Sea View | sedefada.com',
      description: lang === 'tr'
        ? 'Dragos\'tan Sedef Adası canlı kamera görüntüleri. Kartal-Sedef Adası rotasındaki deniz ve hava koşullarını gerçek zamanlı izleyin. Marmara Denizi ve Prens Adaları manzarası.'
        : 'Live camera views of Sedef Island from Dragos. Watch real-time sea and weather conditions on the Kartal-Sedef Island route. Marmara Sea and Princes\' Islands panorama.',
      keywords: lang === 'tr'
        ? ['Sedef Adası canlı kamera', 'Dragos kamera', 'Marmara canlı görüntü', 'Sedef Adası webcam']
        : ['Sedef Island live camera', 'Dragos camera', 'Marmara live view', 'Sedef Island webcam']
    },
    'iletisim_bilgileri': {
      title: lang === 'tr'
        ? 'Faydalı Telefonlar - Sedef Adası Acil ve Önemli Numaralar | sedefada.com'
        : 'Useful Phone Numbers - Sedef Island Emergency & Important Contacts | sedefada.com',
      description: lang === 'tr'
        ? 'Sedef Adası ve çevresi için acil durum numaraları, sağlık, ulaşım, alışveriş ve kamu hizmetleri iletişim bilgileri. 112 acil, İSKİ, polis, itfaiye, hastane, belediye ve diğer önemli telefonlar.'
        : 'Emergency numbers, health, transportation, shopping and public service contacts for Sedef Island and surroundings. 112 emergency, ISKI, police, fire department, hospital, municipality and other important phone numbers.',
      keywords: lang === 'tr'
        ? ['Sedef Adası iletişim', 'acil numaralar', 'İSKİ Adalar', 'Büyükada polis', 'Adalar belediye', 'Sedef Adası telefon', 'acil durum', 'sağlık hizmetleri']
        : ['Sedef Island contact', 'emergency numbers', 'ISKI Adalar', 'Buyukada police', 'Adalar municipality', 'Sedef Island phone', 'emergency', 'health services']
    }
  };

  const page = pages[pageId];
  
  if (!page) {
    // Default SEO data for home page or unknown pages - optimized
    return {
      title: lang === 'tr' 
        ? 'Sedef Adası | Tarihi, Doğası, Ulaşım ve Ada Yaşamı' 
        : 'Sedef Island | History, Nature, Transport and Island Life',
      description: lang === 'tr'
        ? 'Sedef Adası\'nın tarihi, doğal yaşamı, ulaşımı, mimarisi, anıları, eski fotoğrafları, haritaları ve güncel ada yaşamı hakkında kapsamlı bilgi ve arşiv.'
        : 'A comprehensive guide and archive about Sedef Island, including its history, nature, transport, architecture, memories, historic photographs, maps and island life.',
      canonicalUrl: lang === 'tr' ? `${BASE_URL}/` : `${BASE_URL}/en/`,
      keywords: lang === 'tr'
        ? ['sedef adası', 'prens adaları', 'istanbul adaları', 'marmara denizi', 'Sedef Adası gezisi', 'İstanbul\'un adaları']
        : ['sedef island', 'princes islands', 'istanbul islands', 'sea of marmara', 'Sedef Island tour', 'Istanbul islands'],
      ...customData
    };
  }

  // URL mapping for canonical URLs
  const urlMap: Record<string, string> = {
    'sedefada_tarihi': 'sedef-adasi-ve-tarihi',
    'ulasim_tarife': 'ulasim-tarifesi',
    'kis_baskadir': 'kis-baskadir',
    'iletisim_bilgileri': 'cesitli-iletisim-bilgisi',
    'web': 'web-canli',
    'anilar': 'anilar',
    'ekoloji': 'ekoloji',
    'videolar': 'videolar'
  };

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    canonicalUrl: `${BASE_URL}/${urlMap[pageId] || pageId}`,
    ...customData
  };
}
