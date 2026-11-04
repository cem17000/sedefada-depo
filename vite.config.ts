import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { getPageSEO } from './src/lib/useSEO';
import { parseEcologyText } from './src/lib/ecology';
import { INFORMATION_PAGES } from './src/lib/information';
import { englishNewspaperClipping } from './src/data/englishNewspaperClipping';
import { getRouteId, localizedPath, normalizeContentLinks, ROUTES, type RouteId } from './src/lib/routes';

interface StaticNavItem {
  id: string;
  type: 'blog' | 'post';
  blogSlug: string;
  postId?: string;
  excludeIds?: string[];
}

interface StaticPost {
  id: string;
  blogSlug: string;
  titles: { tr: string; en?: string };
  contents: { tr: string; en?: string };
  publishedAt: string;
}

const staticContent = JSON.parse(
  readFileSync(new URL('./src/data/content.json', import.meta.url), 'utf8'),
) as { navItems: StaticNavItem[]; posts: StaticPost[] };

const STATIC_PAGES = [
  { route: 'sedef-adasi-ve-tarihi', itemId: 'sedefada_tarihi', heading: ['Sedef Adası ve Tarihi', 'Sedef Island and Its History'] },
  { route: 'guncel-gelismeler', itemId: 'guncel_gelismeler', heading: ['Güncel Gelişmeler', 'Current Developments'] },
  { route: 'anilar', itemId: 'anilar', heading: ['Sedef Adası Anıları', 'Sedef Island Memories'] },
  { route: 'ekoloji', itemId: 'ekoloji', heading: ['Sedef Adası Ekolojisi', 'Ecology of Sedef Island'] },
  { route: 'kis-baskadir', itemId: 'kis_baskadir', heading: ["Sedef Adası'nda Kış", 'Winter on Sedef Island'] },
  { route: 'ulasim-tarifesi', itemId: 'ulasim_tarife', heading: ['Sedef Adası Ulaşım Rehberi', 'Transportation Guide to Sedef Island'] },
  { route: 'videolar', itemId: 'videolar', heading: ['Sedef Adası Videoları', 'Sedef Island Videos'] },
  { route: 'web-canli', itemId: 'web', heading: ['Canlı Marmara Görüntüsü', 'Live Marmara View'] },
  { route: 'web-canli/kamera', itemId: 'web', heading: ['Canlı Marmara Görüntüsü', 'Live Marmara View'] },
  { route: 'cesitli-iletisim-bilgisi', itemId: 'iletisim_bilgileri', heading: ['Faydalı Telefonlar', 'Various Contact Information'] },
] as const;

const HIDE_POST_TITLE_FOR = new Set(['sedefada_tarihi', 'videolar', 'kis_baskadir', 'ulasim_tarife']);

function getStaticPosts(itemId: string) {
  const item = staticContent.navItems.find((navItem) => navItem.id === itemId);
  if (!item) return [];

  return staticContent.posts
    .filter((post) => post.blogSlug === item.blogSlug)
    .filter((post) => !item.excludeIds?.includes(post.id))
    .filter((post) => item.type !== 'post' || post.id === item.postId)
    .sort((firstPost, secondPost) => Date.parse(secondPost.publishedAt) - Date.parse(firstPost.publishedAt));
}

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderEcology(lang: 'tr' | 'en') {
  const filename = lang === 'tr' ? 'sedefada ekoloji 01' : 'sedefada ecology 01';
  const text = readFileSync(new URL(`./public/${filename}`, import.meta.url), 'utf8');
  return `<article class="blog-card seo-static-card"><div class="prose ecology-content">${parseEcologyText(text).map((block) => {
    const tag = block.type === 'section' ? 'h2' : block.type === 'subsection' ? 'h3' : 'p';
    const content = escapeHtml(block.content).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return `<${tag}>${content}</${tag}>`;
  }).join('\n')}</div></article>`;
}

function renderStaticArticles(itemId: string, lang: 'tr' | 'en') {
  if (itemId === 'ekoloji') return renderEcology(lang);
  return getStaticPosts(itemId).map((post) => {
    if (lang === 'en' && (!post.contents.en || post.contents.en === post.contents.tr || !post.titles.en)) {
      throw new Error(`Missing English translation for ${post.id}`);
    }
    const localizedContent = post.contents[lang]!;
    const content = post.id === 'ulasim_tarife'
      ? `${localizedContent.replace('/t1.png', '/t1.png?v=2026-09-07')}\n<div style="margin-top:2rem;"><img src="/ada_tarifesi_2027.png" alt="${lang === 'tr' ? 'Şehir Hatları Büyükada - Sedef Adası akşam tarifesi' : 'City Lines Buyukada - Sedef Island evening timetable'}" style="width:100%;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,0.10);" /></div>`
      : `${post.id === 'anilar' && lang === 'en' ? englishNewspaperClipping : ''}${localizedContent}`;
    const normalizedContent = normalizeContentLinks(content);
    const title = HIDE_POST_TITLE_FOR.has(post.id)
      ? ''
      : `<h2>${escapeHtml(post.titles[lang]!)}</h2>`;
    const contentClass = post.id === 'anilar' ? ' memories-content' : '';

    return `<article class="blog-card seo-static-card">${title}<div class="blog-content${contentClass}">${normalizedContent}</div></article>`;
  }).join('\n');
}

function renderHome(lang: 'tr' | 'en') {
  return `<main class="seo-static-page">
    <h1>${lang === 'tr' ? 'Sedef Adası' : 'Sedef Island'}</h1>
    <p>${lang === 'tr' ? "İstanbul Prens Adaları'nın en küçük ve en doğusundaki ada. Tarih, doğa ve huzurun buluştuğu nokta." : "The smallest and easternmost of Istanbul's Princes' Islands. Where history, nature and tranquility meet."}</p>
    <nav aria-label="${lang === 'tr' ? 'Sedef Adası sayfaları' : 'Sedef Island pages'}"><ul>${STATIC_PAGES.filter((page) => page.route !== 'web-canli/kamera').map((page) => `<li><a href="${localizedPath(`/${page.route}/`, lang)}">${escapeHtml(page.heading[lang === 'tr' ? 0 : 1])}</a></li>`).join('')}</ul></nav>
  </main>`;
}

function renderStaticPage(
  route: string,
  itemId: string,
  heading: string,
  lang: 'tr' | 'en',
  stylesheet: string | undefined,
  entryScript: string | undefined,
  content?: string,
  customMetadata?: { title: string; description: string },
) {
  const routeId = getRouteId(`/${route}`);
  if (!routeId) throw new Error(`Missing static route for ${route}`);
  const trUrl = `https://sedefada.com${ROUTES[routeId].tr}`;
  const enUrl = `https://sedefada.com${ROUTES[routeId].en}`;
  const metadata = getPageSEO(itemId, lang, {
    ...customMetadata,
    canonicalUrl: lang === 'tr' ? trUrl : enUrl,
    alternateUrls: {
      tr: trUrl,
      en: enUrl,
      default: trUrl,
    },
  });
  const canonicalUrl = metadata.canonicalUrl!;
  const stylesheetLink = stylesheet ? `<link rel="stylesheet" href="/${stylesheet}" />` : '';
  const script = entryScript ? `<script type="module" crossorigin src="/${entryScript}"></script>` : '';

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow" />
    <meta name="description" content="${escapeHtml(metadata.description)}" />
    <title>${escapeHtml(metadata.title)}</title>
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="alternate" hreflang="tr" href="${metadata.alternateUrls!.tr}" />
    <link rel="alternate" hreflang="en" href="${metadata.alternateUrls!.en}" />
    <link rel="alternate" hreflang="x-default" href="${metadata.alternateUrls!.default}" />
    <meta property="og:title" content="${escapeHtml(metadata.title)}" />
    <meta property="og:description" content="${escapeHtml(metadata.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
    ${stylesheetLink}
    <style>
      .seo-static-page { max-width: 76rem; margin: 0 auto; padding: 6rem 1.5rem 3rem; }
      .seo-static-page h1 { font-size: 2rem; }
      .seo-static-page p { margin: 1rem 0; }
      .seo-static-page a { color: #00e5ff; }
      .seo-static-header { display: flex; justify-content: space-between; gap: 1rem; align-items: center; margin-bottom: 2rem; }
      .seo-static-header a { color: #00e5ff; }
      .seo-static-card { padding: 1.5rem; margin-bottom: 1.5rem; }
      .seo-static-card h2 { margin: 0 0 1rem; font-size: 1.5rem; }
      @media (max-width: 767px) { .seo-static-page { padding-top: 2rem; } .seo-static-header { align-items: flex-start; flex-direction: column; } }
    </style>
  </head>
  <body>
    <div id="root">
      ${content ?? `<main class="seo-static-page">
        <header class="seo-static-header"><a href="${lang === 'tr' ? '/' : '/en/'}">sedefada.com</a><a href="${lang === 'tr' ? '/' : '/en/'}">${lang === 'tr' ? 'Ana Sayfa' : 'Home'}</a></header>
        <h1>${escapeHtml(heading)}</h1>
        ${renderStaticArticles(itemId, lang)}
      </main>`}
    </div>
    ${script}
  </body>
</html>`;
}

function staticSeoPages(): Plugin {
  return {
    name: 'static-localized-seo-pages',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(/<div id="root"[^>]*>[\s\S]*?<\/div>/, `<div id="root">${renderHome('tr')}</div>`);
    },
    generateBundle(_, bundle) {
      const stylesheet = Object.values(bundle).find(
        (output) => output.type === 'asset' && output.fileName.endsWith('.css'),
      )?.fileName;
      const entryScript = Object.values(bundle).find(
        (output) => output.type === 'chunk' && output.isEntry,
      )?.fileName;

      for (const page of STATIC_PAGES) {
        for (const lang of ['tr', 'en'] as const) {
          const localizedRoute = localizedPath(`/${page.route}/`, lang)!.replace(/^\/|\/$/g, '');
          this.emitFile({
            type: 'asset',
            fileName: `${localizedRoute}/index.html`,
            source: renderStaticPage(localizedRoute, page.itemId, page.heading[lang === 'tr' ? 0 : 1], lang, stylesheet, entryScript),
          });
        }
      }
      this.emitFile({
        type: 'asset',
        fileName: 'en/index.html',
        source: renderStaticPage('en', '', '', 'en', stylesheet, entryScript, renderHome('en')),
      });
      for (const [id, page] of Object.entries(INFORMATION_PAGES)) {
        for (const lang of ['tr', 'en'] as const) {
          const route = ROUTES[id as RouteId][lang].replace(/^\/|\/$/g, '');
          const body = `<main class="seo-static-page"><a href="${lang === 'tr' ? '/' : '/en/'}">${lang === 'tr' ? 'Ana Sayfa' : 'Home'}</a><h1>${escapeHtml(page.title[lang])}</h1><article class="seo-static-card">${page.content[lang]}</article></main>`;
          this.emitFile({
            type: 'asset',
            fileName: `${route}/index.html`,
            source: renderStaticPage(route, '', page.title[lang], lang, stylesheet, entryScript, body, {
              title: `${page.title[lang]} | Sedefada.com`, description: page.description[lang],
            }),
          });
        }
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    staticSeoPages(),
    // Image optimizasyonu: WebP/AVIF formatlarına dönüştürme ve sıkıştırma
    ViteImageOptimizer({
      // PNG optimizasyonu
      png: {
        quality: 80,
        compressionLevel: 9,
      },
      // JPEG optimizasyonu
      jpeg: {
        quality: 80,
        progressive: true,
      },
      // JPG optimizasyonu
      jpg: {
        quality: 80,
        progressive: true,
      },
      // WebP optimizasyonu (varsayılan çıktı formatı)
      webp: {
        quality: 75,
        lossless: false,
      },
      // AVIF optimizasyonu (daha iyi sıkıştırma)
      avif: {
        quality: 65,
        lossless: false,
      },
      // SVG optimizasyonu
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
                removeComments: true,
                removeUnusedNS: true,
                collapseGroups: true,
              },
            },
          },
        ],
      },
      // Cache
      cache: false,
      cacheLocation: './node_modules/.vite/image-optimizer',
      // Log
      logStats: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Resimleri ayrı bir klasöre topla
        assetFileNames: (assetInfo) => {
          const extType = (assetInfo.name ?? '').split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(extType ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/js/i.test(extType ?? '')) {
            return 'assets/js/[name]-[hash][extname]';
          }
          if (/css/i.test(extType ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // Source map production (production'da kapatılabilir)
    sourcemap: false,
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Development server configuration
  server: {
    port: 5173,
    strictPort: true,
  },
  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: true,
  },
});