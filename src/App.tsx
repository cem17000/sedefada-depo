import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, useLocation, useNavigate, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { NotFoundPage } from './components/NotFoundPage';
import { HeroBanner } from './components/HeroBanner';
import { Navigation, type NavItem } from './components/NavigationItem';
import { BlogCard } from './components/BlogCard';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';
import { MarmarayWidget } from './components/MarmarayWidget';
import { MetroRouteFinder } from './components/MetroRouteFinder';
import { FAQSection } from './components/FAQSection';
import { useLanguage } from './lib/useLanguage';
import { useSEO, getPageSEO } from './lib/useSEO';
import content from './data/content.json';

// Route mapping for clean URLs
const ROUTE_MAP: Record<string, string> = {
  'sedef-adasi-ve-tarihi': 'sedefada_tarihi',
  'anilar': 'anilar',
  'videolar': 'videolar',
  'kis-baskadir': 'kis_baskadir',
  'ulasim-tarifesi': 'ulasim_tarife',
  'web-canli': 'web',
  'cesitli-iletisim-bilgisi': 'iletisim_bilgileri',
  // English routes
  'en/sedef-adasi-ve-tarihi': 'sedefada_tarihi',
  'en/anilar': 'anilar',
  'en/videolar': 'videolar',
  'en/kis-baskadir': 'kis_baskadir',
  'en/ulasim-tarifesi': 'ulasim_tarife',
  'en/web-canli': 'web',
  'en/cesitli-iletisim-bilgisi': 'iletisim_bilgileri',
};

// Reverse mapping for URL generation
const REVERSE_ROUTE_MAP: Record<string, string> = {
  'sedefada_tarihi': 'sedef-adasi-ve-tarihi',
  'anilar': 'anilar',
  'videolar': 'videolar',
  'kis_baskadir': 'kis-baskadir',
  'ulasim_tarife': 'ulasim-tarifesi',
  'web': 'web-canli',
  'iletisim_bilgileri': 'cesitli-iletisim-bilgisi',
};

// Page metadata for SEO
const PAGE_METADATA: Record<string, { title: string; description: string; schemaType: string; keywords?: string[] }> = {
  'sedefada_tarihi': {
    title: 'Sedef Adası ve Tarihi - İstanbul\'un Gizli Cenneti',
    description: 'Sedef Adası, İstanbul Prens Adaları\'nın en küçük ve en doğusundaki ada. Bizans döneminden günümüze tarihçesi, doğal güzellikleri ve coğrafi özellikleri hakkında kapsamlı bilgi.',
    schemaType: 'Place',
    keywords: ['Sedef Adası', 'Prens Adaları', 'İstanbul adaları', 'Terebinthos', 'Bizans manastırı', 'ada tarihi']
  },
  'anilar': {
    title: 'Anılar - Sedef Adası Hatıraları ve Ada Hayatı',
    description: 'Sedef Adası\'nda yaşayanların anıları, ada yaşamının güzel hatıraları, Mahama\'dan Suna\'nın Kafkas Pilavı partilerine, ada sakinlerinin duygusal hikayeleri.',
    schemaType: 'Blog',
    keywords: ['Sedef Adası anıları', 'ada hayatı', 'Mahama', 'Suna Giritli', 'ada sakinleri']
  },
  'videolar': {
    title: 'Videolar - Sedef Adası Belgeseli ve Tarihi Video Arşivi',
    description: 'Sedef Adası hakkında belgeseller, tarihi videolar ve ada yaşamından görüntüler. Adamızın geçmişine, doğal güzelliklerine ve kültürüne video yolculuğu.',
    schemaType: 'VideoObject',
    keywords: ['Sedef Adası belgesel', 'ada videoları', 'Sedef Adası tarihi video']
  },
  'ulasim_tarife': {
    title: 'Ulaşım ve Tarife - Sedef Adası\'na Nasıl Gidilir? 2026',
    description: 'Sedef Adası\'na Kartal\'dan metro ile ulaşım, İstanbul\'un her yerinden Kartal\'a metro rota rehberi, güncel tekne ve vapur tarifeleri, İBB Deniz Taksi bilgileri.',
    schemaType: 'FAQPage',
    keywords: ['Sedef Adası ulaşım', 'Kartal Sedef motor', 'İBB Deniz Taksi', 'metro ile Sedef Adası']
  },
  'kis_baskadir': {
    title: 'Sedef Adası\'nda Kış Başkadır - Lodosun ve Sessizliğin Günlüğü',
    description: 'Sedef Adası\'nda kış mevsimi, lodos fırtınaları, kar manzaraları ve kışın adada kalmanın eşsiz deneyimi. Yaz kalabalıklarından uzak, sessiz ve huzurlu ada yaşamı.',
    schemaType: 'BlogPosting',
    keywords: ['Sedef Adası kış', 'lodos', 'ada kış manzarası', 'kışın Sedef Adası']
  },
  'web': {
    title: 'Web ve Marmara Canlı Görüntüsü - Dragos Kamera',
    description: 'Dragos\'tan Sedef Adası canlı kamera görüntüleri, Kartal-Sedef Adası rotasındaki deniz ve hava koşullarını gerçek zamanlı izleyin, Marmara Denizi ve Prens Adaları manzarası.',
    schemaType: 'WebApplication',
    keywords: ['Sedef Adası canlı kamera', 'Dragos kamera', 'Marmara canlı görüntü']
  },
  'iletisim_bilgileri': {
    title: 'Faydalı Telefonlar - Sedef Adası Acil ve Önemli Numaralar',
    description: 'Sedef Adası ve çevresi için acil durum numaraları, İSKİ, polis, itfaiye, hastane, belediye ve diğer önemli iletişim bilgileri.',
    schemaType: 'FAQPage',
    keywords: ['Sedef Adası iletişim', 'acil numaralar', 'İSKİ Adalar', 'Büyükada polis', 'Adalar belediye']
  }
};

// Generate JSON-LD structured data for a page
function generateStructuredData(itemId: string, lang: string) {
  const metadata = PAGE_METADATA[itemId];
  if (!metadata) return null;

  const baseUrl = 'https://sedefada.com';
  const pageUrl = `${baseUrl}/${REVERSE_ROUTE_MAP[itemId] || ''}`;
  const currentYear = new Date().getFullYear();

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": lang === 'tr' ? 'Ana Sayfa' : 'Home',
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": metadata.title.split(' - ')[0],
        "item": pageUrl
      }
    ]
  };

  // WebSite schema (always included)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": lang === 'tr' ? 'Sedef Adası' : 'Sedef Island',
    "alternateName": lang === 'tr' ? ['Sedefadası', 'Sedef Adası'] : ['Sedef Island', 'Mother-of-Pearl Island'],
    "url": baseUrl,
    "description": lang === 'tr' 
      ? 'İstanbul Prens Adaları\'nın en küçük ve en doğusundaki ada. Tarih, doğa ve huzurun buluştuğu nokta.'
      : 'The smallest and easternmost island of Istanbul\'s Princes\' Islands. Where history, nature and tranquility meet.',
    "inLanguage": lang,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/?s={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // Organization schema for the website owner
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": lang === 'tr' ? 'Sedef Adası' : 'Sedef Island',
    "alternateName": lang === 'tr' ? ['Sedefadası', 'Terebinthos'] : ['Sedef Island', 'Terebinthos'],
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/favicon.png`,
      "width": 32,
      "height": 32
    },
    "description": lang === 'tr'
      ? 'Sedef Adası resmi web sitesi. Ada tarihi, anılar, videolar, ulaşım bilgileri ve canlı Marmara görüntüleri.'
      : 'Official website of Sedef Island. Island history, memories, videos, transportation info and live Marmara views.',
    "address": {
      "@type": "PostalAddress",
      "addressLocality": lang === 'tr' ? 'Adalar' : 'Adalar',
      "addressRegion": 'Istanbul',
      "addressCountry": 'TR',
      "postalCode": '34977'
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.8542",
      "longitude": "29.1247"
    },
    "sameAs": [
      "https://www.facebook.com/sedefada",
      "https://www.instagram.com/sedefada",
      "https://twitter.com/sedefada"
    ]
  };

  // Place schema for Sedef Island (extended with TouristAttraction)
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": ["Place", "TouristAttraction"],
    "name": lang === 'tr' ? 'Sedef Adası' : 'Sedef Island',
    "alternateName": lang === 'tr' ? ['Terebinthos', 'Tavşanadası'] : ['Terebinthos', 'Rabbit Island', 'Mother-of-Pearl Island'],
    "description": metadata.description,
    "url": pageUrl,
    "image": `${baseUrl}/sedef-adasi-all.jpg`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": lang === 'tr' ? 'Büyükada, Adalar' : 'Buyukada, Adalar',
      "addressRegion": 'Istanbul',
      "addressCountry": 'TR',
      "postalCode": '34977'
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.8542",
      "longitude": "29.1247"
    },
    "containedInPlace": {
      "@type": "AdministrativeArea",
      "name": lang === 'tr' ? 'Prens Adaları' : 'Princes\' Islands',
      "containedInPlace": {
        "@type": "City",
        "name": 'Istanbul',
        "containedInPlace": {
          "@type": "Country",
          "name": 'Turkey'
        }
      }
    },
    "touristType": [
      lang === 'tr' ? 'Doğa severler' : 'Nature lovers',
      lang === 'tr' ? 'Tarih meraklıları' : 'History enthusiasts',
      lang === 'tr' ? 'Fotoğrafçılar' : 'Photographers'
    ],
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": lang === 'tr' ? 'Plaj' : 'Beach', "value": true },
      { "@type": "LocationFeatureSpecification", "name": lang === 'tr' ? 'Tarihi kalıntılar' : 'Historical ruins', "value": true },
      { "@type": "LocationFeatureSpecification", "name": lang === 'tr' ? 'Doğa yürüyüşü' : 'Nature trails', "value": true }
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "publicAccess": true,
    "isAccessibleForFree": true
  };

  // Island-specific schema with more details
  const islandSchema = {
    "@context": "https://schema.org",
    "@type": "Island",
    "name": lang === 'tr' ? 'Sedef Adası' : 'Sedef Island',
    "alternateName": lang === 'tr' ? ['Terebinthos', 'Tavşanadası'] : ['Terebinthos', 'Rabbit Island'],
    "description": lang === 'tr'
      ? 'Sedef Adası, İstanbul Prens Adaları\'nın en küçük ve en doğusundaki ada. Bizans döneminden günümüze uzanan tarihi, doğal güzellikleri ve huzurlu ortamıyla bilinir.'
      : 'Sedef Island, the smallest and easternmost of Istanbul\'s Princes\' Islands. Known for its history dating back to Byzantine times, natural beauties, and peaceful atmosphere.',
    "url": pageUrl,
    "image": `${baseUrl}/sedef-adasi-all.jpg`,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.8542",
      "longitude": "29.1247"
    },
    "containedInPlace": {
      "@type": "Archipelago",
      "name": lang === 'tr' ? 'Prens Adaları' : 'Princes\' Islands',
      "containedInPlace": {
        "@type": "City",
        "name": 'Istanbul',
        "address": {
          "@type": "PostalAddress",
          "addressCountry": 'TR'
        }
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": lang === 'tr' ? 'Alan' : 'Area',
        "value": "0.157",
        "unitCode": "KMT"
      },
      {
        "@type": "PropertyValue",
        "name": lang === 'tr' ? 'En Yüksek Nokta' : 'Highest Point',
        "value": "105",
        "unitCode": "MTR"
      }
    ]
  };

  // Specific schema based on page type
  let specificSchema = null;
  switch (metadata.schemaType) {
    case 'Place':
      specificSchema = placeSchema;
      break;
    case 'Blog':
    case 'BlogPosting':
      specificSchema = {
        "@context": "https://schema.org",
        "@type": metadata.schemaType,
        "headline": metadata.title,
        "description": metadata.description,
        "url": pageUrl,
        "inLanguage": lang,
        "datePublished": "2026-05-01",
        "dateModified": `${currentYear}-07-01`,
        "author": {
          "@type": "Organization",
          "name": 'Sedef Adası',
          "url": baseUrl
        },
        "publisher": {
          "@type": "Organization",
          "name": 'sedefada.com',
          "url": baseUrl,
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/favicon.png`
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": pageUrl
        },
        "keywords": (metadata.keywords || []).join(', ')
      };
      break;
    case 'VideoObject':
      specificSchema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": metadata.title,
        "description": metadata.description,
        "url": pageUrl,
        "inLanguage": lang,
        "contentUrl": "https://www.youtube.com/embed/8ag8qLfzCNQ",
        "embedUrl": "https://www.youtube.com/embed/8ag8qLfzCNQ",
        "thumbnailUrl": `${baseUrl}/sedef-adasi-all.jpg`,
        "uploadDate": "2026-05-01",
        "duration": "PT5M",
        "interactionCount": "1000"
      };
      break;
    case 'FAQPage':
      specificSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": lang === 'tr' ? [
          {
            "@type": "Question",
            "name": "Sedef Adası'na nasıl gidilir?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sedef Adası'na Kartal'dan ve Büyükada'dan özel motorlarla veya Bostancı'dan şehir hatları vapurlarıyla ulaşabilirsiniz. Sabiha Gökçen Havalimanı bağlantısı M4 Metro hattı ile sağlanır; taksi ile iskeleye yaklaşık 10 dakikada ulaşabilirsiniz. Marmaray Metro hattı ise iskeleye sadece 250 metre mesafededir; Web sitemizden İstanbul'un her hangi bir metro istasyonundan Kartal'a Marmaray metro istasyonu rota ve hesaplanan yaklaşık seyahat sürelerine ulaşabilirsiniz."
            }
          },
          {
            "@type": "Question",
            "name": "Sedef Adası vapur saatleri nelerdir?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Bostacı ve Büyükada bağlantılı güncel vapur seferleri saatleri şehir hatlarından takip edilebilir. Büyükada'dan Sedef Adası'na çok sınırlı sayıda şehir hatları seferi vardır. Ancak, Kartal ve Büyükadadan motorlar sabit sefer saati olmaksızın doldukça kalkmaktadır; özellikle Yaz sezonunda haftasonları ulaşım saatleri sıklaşmaktadır. Ayrıca, Sedefadalılar Derneği üyelerine özel tekne seferleri saatleri için sayfamızdaki tarife tablolarını inceleyebilirsiniz. Seferler mevsim içinde de değişiklik göstermektedir."
            }
          },
          {
            "@type": "Question",
            "name": "Sedef Adası'na metro ile nasıl gidilir?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "İstanbul'un her yerinden Kartal Marmaray istasyonu'na gelip, buradan yürüyerek 5-10 dakika içinde iskeleye ulaşabilirsiniz. Sabiha Gökçen Havalimanı bağlantısı M4 Kartal metro istasyonundadır; taksi ile yaklaşık 10 dakikada iskeleye ulaşabilirsiniz. Web sitemizden İstanbul'un her hangi bir metro istasyonundan Kartal'a Marmaray metro istasyonu rota ve hesaplanan yaklaşık seyahat sürelerine ulaşabilirsiniz."
            }
          },
          {
            "@type": "Question",
            "name": "Sedef Adası giriş ücretli mi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sedef Adası'na giriş ücretsizdir. Ancak adanın bir bölümü özel mülkiyette olduğu için ziyaretçi kabul politikaları hakkında bilgi almanız önerilir. Adada plaj ve lokanta hizmeti veren işletmeler mevcuttur.Bir ek bilgi verelim, adada bakkal yoktur; tedarikli olmanız gerekebilir."
            }
          }
        ] : [
          {
            "@type": "Question",
            "name": "How to get to Sedef Island?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can reach Sedef Island by private motorboats from Kartal and Büyükada, or by City Lines ferries from Bostancı. Sabiha Gökçen Airport is connected via the M4 Metro Line, and the Kartal pier can be reached by taxi in approximately 10 minutes from the metro station. The Marmaray rail line is located only 250 metres from the pier. On our website, you can also find routes and estimated travel times from any metro station in Istanbul to Kartal."
            }
          },
          {
            "@type": "Question",
            "name": "What are the ferry schedules to Sedef Island?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Up-to-date ferry timetables for services from Bostancı and Büyükada are available from City Lines. There are only a limited number of City Lines ferry services between Büyükada and Sedef Island. However, private motorboats from Kartal and Büyükada do not operate on fixed schedules; they depart as they fill with passengers. During the summer season, especially on weekends, departures become much more frequent. Members of the Sedef Islanders Association can also refer to the timetable tables on our website for information about the association's dedicated boat services. Please note that all schedules are subject to seasonal changes."
            }
          },
          {
            "@type": "Question",
            "name": "How to get to Sedef Island by metro?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "From anywhere in Istanbul, you can travel to Kartal Marmaray Station and reach the ferry pier with a 5–10 minute walk. Sabiha Gökçen Airport is connected to the M4 Metro Line, which serves Kartal Metro Station. From there, the ferry pier is approximately a 10-minute taxi ride away."
            }
          },
          {
            "@type": "Question",
            "name": "Is there an entrance fee for Sedef Island?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Entry to Sedef Island is free of charge. However, as part of the island is privately owned, it is advisable to check the current visitor access policy before your visit. The island has businesses offering beach facilities and restaurants. One additional note: there are no shops or supermarkets on the island, so you may wish to bring any essentials you might need."
            }
          }
        ]
      };
      break;
    case 'WebApplication':
      specificSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": metadata.title,
        "description": metadata.description,
        "url": pageUrl,
        "inLanguage": lang,
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "TRY"
        }
      };
      break;
  }

  // Combine all schemas
  const schemas: any[] = [websiteSchema, breadcrumbSchema, organizationSchema];
  
  // Add island-specific schema for Place pages
  if (metadata.schemaType === 'Place') {
    schemas.push(islandSchema);
  }
  
  if (specificSchema) schemas.push(specificSchema);

  return schemas;
}

// Inject structured data into the page
function injectStructuredData(schemas: any[] | null) {
  // Remove existing structured data
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingScripts.forEach(script => script.remove());

  if (!schemas || schemas.length === 0) return;

  // Create new structured data script
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schemas);
  document.head.appendChild(script);
}

function AppContent() {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Array<{ id: string; blogSlug: string; title: string; content: string; publishedAt: string; categories: string[]; type: string; isSimulated: boolean }>>([]);
  const [images, setImages] = useState<{ url: string; title: string }[]>([]);
  const [viewMode, setViewMode] = useState<'posts' | 'gallery'>('posts');
  const [loading, setLoading] = useState(false);
  const [activeTitle, setActiveTitle] = useState('');
  const [activeItem, setActiveItem] = useState<NavItem | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  const getLocalizedPost = (post: any, currentLang: string) => {
    const localizedContent =
      currentLang === 'tr'
        ? post.contents?.tr
        : post.contents?.[currentLang] && post.contents?.[currentLang] !== post.contents?.tr
        ? post.contents?.[currentLang]
        : post.contents?.en ?? post.contents?.tr;

    return {
      ...post,
      title: post.titles?.[currentLang] ?? post.titles?.en ?? post.titles?.tr ?? post.title,
      content: localizedContent ?? post.content,
      categories: post.categories?.[currentLang] ?? post.categories?.en ?? post.categories?.tr ?? post.categories ?? [],
    };
  };

  // activeItem ref — useEffect içinden güncel değere erişmek için
  const activeItemRef = useRef<NavItem | null>(null);
  activeItemRef.current = activeItem;

  const loadPostsForItem = useCallback((item: NavItem, currentLang: string) => {
    if (!item || !item.id || !item.blogSlug) return;

    if (item.type === 'blog') {
      const selectedPosts = content.posts
        .filter((post) => post.blogSlug === item.blogSlug)
        .filter((post) => !item.excludeIds?.includes(post.id))
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      setPosts(selectedPosts.map((post) => getLocalizedPost(post, currentLang)));
      setImages(content.galleries[item.blogSlug as keyof typeof content.galleries] ?? []);
    } else {
      setImages([]);
      const selectedPost = content.posts.find(
        (post) => post.blogSlug === item.blogSlug && post.id === item.postId,
      );
      setPosts(selectedPost ? [getLocalizedPost(selectedPost, currentLang)] : []);
    }
  // getLocalizedPost saf bir fonksiyon, bağımlılık gerektirmez
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dil değiştiğinde aktif sayfayı yeni dile çevir
  useEffect(() => {
    const item = activeItemRef.current;
    if (item) {
      loadPostsForItem(item, lang);
    }
  }, [lang, loadPostsForItem]);

  // Route değiştiğinde sayfayı en üste kaydır (mobil uyumlu)
  useEffect(() => {
    // Önce hemen kaydır
    window.scrollTo(0, 0);
    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = 0;
    }
    // İçerik yüklendikten sonra tekrar kaydır (mobilde güvenilir olması için)
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = 0;
      }
    });
  }, [location]);

  // Route değiştiğinde içeriği yükle
  useEffect(() => {
    // Path'i al ve normalize et
    let path = location.pathname;
    
    // Başındaki ve sonundaki slash'ları temizle
    path = path.replace(/^\/+|\/+$/g, '');
    
    // Ana sayfa (hem Türkçe hem İngilizce)
    if (path === '' || path === '/' || path === 'en') {
      setActiveItem(null);
      setActiveTitle('');
      setPosts([]);
      setImages([]);
      return;
    }

    // Route'u çöz - önce direkt eşleşme, sonra /en/ prefix'li eşleşme
    let itemId = ROUTE_MAP[path];
    if (!itemId) {
      // /en/ prefix'li versiyonu dene
      itemId = ROUTE_MAP[`en/${path}`];
    }
    if (!itemId) {
      // Belki path zaten en/ ile başlıyordur
      if (path.startsWith('en/')) {
        itemId = ROUTE_MAP[path];
      }
    }
    
    if (!itemId) {
      // 404 - bilinmeyen route
      setIsNotFound(true);
      setActiveItem(null);
      setActiveTitle('');
      setPosts([]);
      setImages([]);
      return;
    }

    // Geçerli route bulundu - 404 durumunu temizle
    setIsNotFound(false);

    const navItemConfig = content.navItems.find(item => item.id === itemId);
    if (!navItemConfig) return;

    const navItem: NavItem = {
      id: navItemConfig.id,
      type: navItemConfig.type as 'blog' | 'post',
      displayName: navItemConfig.id,
      icon: null as any,
      blogSlug: navItemConfig.blogSlug,
      postId: navItemConfig.type === 'post' ? navItemConfig.postId : undefined,
      excludeIds: navItemConfig.excludeIds,
    };

    setLoading(true);
    setViewMode('posts');
    setActiveTitle(navItemConfig.id);
    setActiveItem(navItem);
    loadPostsForItem(navItem, lang);
    setLoading(false);

    // Sayfa başlığını güncelle
    const metadata = PAGE_METADATA[itemId];
    if (metadata) {
      document.title = `${metadata.title} | sedefada.com`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', metadata.description);
      }
      
      // Structured data'yı enjekte et
      const schemas = generateStructuredData(itemId, lang);
      injectStructuredData(schemas);
    }
  }, [location, lang, loadPostsForItem]);

  // Ana sayfada structured data'yı temizle
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '' || location.pathname === '/en') {
      injectStructuredData(null);
    }
  }, [location]);

    const handleNavigation = (item: NavItem) => {
    if (!item || !item.id) {
      setActiveItem(null);
      setActiveTitle('');
      setPosts([]);
      setImages([]);
      navigate('/');
      return;
    }

    const routePath = REVERSE_ROUTE_MAP[item.id];
    if (routePath) {
      navigate(`/${routePath}`);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-sedef-border/20 rounded-xl" />
            </div>
          ))}
        </div>
      );
    }
    if (viewMode === 'gallery') return <Gallery images={images} />;
    if (posts.length === 0 && activeTitle) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-sedef-card-bg border border-dashed border-sedef-border rounded-xl">
          <div className="text-4xl text-sedef-accent/70 mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2">{t.noPostsTitle}</h3>
          <p className="text-sm text-sedef-secondary">{t.noPostsDesc}</p>
        </div>
      );
    }
    return (
      <div className="space-y-6 w-full">
        {activeItem?.id === 'ulasim_tarife' && <MetroRouteFinder />}
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            title={post.title}
            content={post.content}
            publishedAt={post.publishedAt}
            categories={post.categories}
            type={post.type as 'POST' | 'PAGE'}
            isSimulated={post.isSimulated}
            hideTitle={['ulasim_tarife', 'sedefada_tarihi', 'videolar', 'kis_baskadir'].includes(post.id)}
          />
        ))}
        {activeItem?.id === 'ulasim_tarife' && (
          <div className="rounded-xl border border-sedef-accent/30 bg-sedef-accent/5 px-5 py-4">
            <p className="text-sm text-sedef-primary leading-relaxed">{t.ulasimInfoText}</p>
          </div>
        )}
        {activeItem?.id === 'ulasim_tarife' && <MarmarayWidget />}
        {activeItem?.id === 'ulasim_tarife' && <FAQSection />}
      </div>
    );
  };

  // 404 sayfası göster
  if (isNotFound) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-sedef-bg text-sedef-primary font-inter transition-colors duration-300">
      <Header />
      <div className="-mt-8 md:-mt-12">
        <HeroBanner />
      </div>

      <div className="flex flex-col md:flex-row gap-10 px-6 pb-6 pt-2 md:px-16 md:pb-16 md:pt-4 max-w-7xl mx-auto">
        <Navigation 
          onNavigate={handleNavigation} 
          activeItem={activeItem} 
          renderMobileContent={renderContent} 
        />

        <main className="hidden md:flex flex-1 flex-col gap-8 min-w-0">
          {/* Sayfa başlığı - h1 (sadece iç sayfalarda, ana sayfada HeroBanner h1 olarak kullanılıyor) */}
          {activeTitle && (
            <header className="mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-sedef-primary">
                {activeTitle === 'sedefada_tarihi' && (lang === 'tr' ? '🐚 Sedef Adası ve Tarihi' : '🐚 Sedef Island and Its History')}
                {activeTitle === 'anilar' && (lang === 'tr' ? 'Sedef Adası Anıları' : 'Sedef Island Memories')}
                {activeTitle === 'videolar' && (lang === 'tr' ? 'Sedef Adası Videoları' : 'Sedef Island Videos')}
                {activeTitle === 'ulasim_tarife' && (lang === 'tr' ? 'Sedef Adası Ulaşım Rehberi' : 'Transportation Guide to Sedef Island')}
                {activeTitle === 'kis_baskadir' && (lang === 'tr' ? 'Sedef Adası\'nda Kış' : 'Winter on Sedef Island')}
                {activeTitle === 'web' && (lang === 'tr' ? 'Canlı Marmara Görüntüsü' : 'Live Marmara View')}
                {activeTitle === 'iletisim_bilgileri' && (lang === 'tr' ? 'Faydalı Telefonlar' : 'Various Contact Information')}
              </h1>
              {/* Breadcrumb */}
              <nav className="mt-2 text-sm text-sedef-secondary" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2">
                  <li>
                    <a href="/" className="hover:text-sedef-accent transition-colors">
                      {lang === 'tr' ? 'Ana Sayfa' : 'Home'}
                    </a>
                  </li>
                  <li className="text-sedef-accent/40">/</li>
                  <li className="text-sedef-primary font-medium">
                    {activeTitle === 'sedefada_tarihi' && (lang === 'tr' ? 'Tarihçe' : 'History')}
                    {activeTitle === 'anilar' && (lang === 'tr' ? 'Anılar' : 'Memories')}
                    {activeTitle === 'videolar' && (lang === 'tr' ? 'Videolar' : 'Videos')}
                    {activeTitle === 'ulasim_tarife' && (lang === 'tr' ? 'Ulaşım' : 'Transportation')}
                    {activeTitle === 'kis_baskadir' && (lang === 'tr' ? 'Kış' : 'Winter')}
                    {activeTitle === 'web' && (lang === 'tr' ? 'Canlı Görüntü' : 'Live View')}
                    {activeTitle === 'iletisim_bilgileri' && (lang === 'tr' ? 'İletişim Bilgisi' : 'Contact Info')}
                  </li>
                </ol>
              </nav>
            </header>
          )}
          {renderContent()}
          
          {/* Internal linking - İlgili içerikler */}
          {activeTitle && (
            <aside className="mt-4 pt-6 border-t border-sedef-border" aria-label="İlgili içerikler">
              <h3 className="text-sm font-semibold text-sedef-secondary mb-3 uppercase tracking-wider">
                {lang === 'tr' ? 'İlgili İçerikler' : 'Related Content'}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {activeTitle !== 'sedefada_tarihi' && (
                  <li>
                    <Link to="/sedef-adasi-ve-tarihi" className="text-sm text-sedef-accent hover:underline transition-colors">
                      {lang === 'tr' ? 'Sedef Adası Tarihi' : 'History of Sedef Island'}
                    </Link>
                  </li>
                )}
                {activeTitle !== 'ulasim_tarife' && (
                  <li>
                    <Link to="/ulasim-tarifesi" className="text-sm text-sedef-accent hover:underline transition-colors">
                      {lang === 'tr' ? 'Ulaşım Rehberi' : 'Transportation Guide'}
                    </Link>
                  </li>
                )}
                {activeTitle !== 'anilar' && (
                  <li>
                    <Link to="/anilar" className="text-sm text-sedef-accent hover:underline transition-colors">
                      {lang === 'tr' ? 'Ada Anıları' : 'Island Memories'}
                    </Link>
                  </li>
                )}
                {activeTitle !== 'kis_baskadir' && (
                  <li>
                    <Link to="/kis-baskadir" className="text-sm text-sedef-accent hover:underline transition-colors">
                      {lang === 'tr' ? 'Kış Manzaraları' : 'Winter Scenes'}
                    </Link>
                  </li>
                )}
              </ul>
            </aside>
          )}
        </main>

        {/* Mobil görünüm */}
        <div className="md:hidden w-full px-2" />
      </div>

      <Footer />
    </div>
  );
}

// Ana App bileşeni - Router ile sarmalanmış
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

// SEO hook'unu kullanmak için wrapper bileşen
function AppWrapper() {
  const location = useLocation();
  const { lang } = useLanguage();
  
  // URL'den aktif sayfa ID'sini hesapla
  const getActiveItemId = (): string => {
    let path = location.pathname.slice(1);
    // /en/ prefix'ini kaldır
    if (path.startsWith('en/')) {
      path = path.substring(3);
    }
    // /en ana sayfası için boş döndür
    if (path === 'en') {
      return '';
    }
    if (path === '' || path === '/') {
      return '';
    }
    return ROUTE_MAP[path] || ROUTE_MAP[`en/${path}`] || '';
  };

  // 404 sayfası için noindex SEO verisi
  const isNotFoundPage = !getActiveItemId() && 
    location.pathname !== '/' && 
    location.pathname !== '' && 
    location.pathname !== '/en' &&
    location.pathname !== 'en';

  // SEO hook'unu kullan - her sayfa değiştiğinde meta tag'ler güncellenecek
  // 404 sayfalarında noindex gönder
  useSEO(isNotFoundPage ? {
    title: lang === 'tr' ? 'Sayfa Bulunamadı - 404 | sedefada.com' : 'Page Not Found - 404 | sedefada.com',
    description: lang === 'tr' ? 'Aradığınız sayfa bulunamadı.' : 'The page you are looking for could not be found.',
    noIndex: true
  } : getPageSEO(getActiveItemId(), lang));

  return <AppContent />;
}

export default App;