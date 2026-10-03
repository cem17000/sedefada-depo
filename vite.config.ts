import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { getPageSEO } from './src/lib/useSEO';

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
  titles: { tr: string };
  contents: { tr: string };
  publishedAt: string;
}

const staticContent = JSON.parse(
  readFileSync(new URL('./src/data/content.json', import.meta.url), 'utf8'),
) as { navItems: StaticNavItem[]; posts: StaticPost[] };

const STATIC_PAGES = [
  { route: 'sedef-adasi-ve-tarihi', itemId: 'sedefada_tarihi', heading: 'Sedef Adası ve Tarihi' },
  { route: 'guncel-gelismeler', itemId: 'guncel_gelismeler', heading: 'Güncel Gelişmeler' },
  { route: 'anilar', itemId: 'anilar', heading: 'Sedef Adası Anıları' },
  { route: 'ekoloji', itemId: 'ekoloji', heading: 'Sedef Adası Ekolojisi' },
  { route: 'kis-baskadir', itemId: 'kis_baskadir', heading: "Sedef Adası'nda Kış" },
  { route: 'ulasim-tarifesi', itemId: 'ulasim_tarife', heading: 'Sedef Adası Ulaşım Rehberi' },
  { route: 'videolar', itemId: 'videolar', heading: 'Sedef Adası Videoları' },
  { route: 'web-canli', itemId: 'web', heading: 'Canlı Marmara Görüntüsü' },
  { route: 'web-canli/kamera', itemId: 'web', heading: 'Canlı Marmara Görüntüsü' },
  { route: 'cesitli-iletisim-bilgisi', itemId: 'iletisim_bilgileri', heading: 'Faydalı Telefonlar' },
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

function renderStaticArticles(itemId: string) {
  return getStaticPosts(itemId).map((post) => {
    const content = post.id === 'ulasim_tarife'
      ? `${post.contents.tr.replace('/t1.png', '/t1.png?v=2026-09-07')}\n<div style="margin-top:2rem;"><img src="/ada_tarifesi_2027.png" alt="Şehir Hatları Büyükada - Sedef Adası akşam tarifesi" style="width:100%;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,0.10);" /></div>`
      : post.contents.tr;
    const title = HIDE_POST_TITLE_FOR.has(post.id)
      ? ''
      : `<h2>${post.titles.tr}</h2>`;
    const contentClass = post.id === 'anilar' ? ' memories-content' : '';

    return `<article class="blog-card seo-static-card">${title}<div class="blog-content${contentClass}">${content}</div></article>`;
  }).join('\n');
}

function renderStaticPage(
  route: string,
  itemId: string,
  heading: string,
  lang: 'tr' | 'en',
  stylesheet: string | undefined,
  entryScript: string | undefined,
) {
  const metadata = getPageSEO(itemId, lang);
  const canonicalUrl = metadata.canonicalUrl!;
  const stylesheetLink = stylesheet ? `<link rel="stylesheet" href="/${stylesheet}" />` : '';
  const script = entryScript ? `<script type="module" crossorigin src="/${entryScript}"></script>` : '';

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow" />
    <meta name="description" content="${metadata.description}" />
    <title>${metadata.title}</title>
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${metadata.title}" />
    <meta property="og:description" content="${metadata.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
    ${stylesheetLink}
    <style>
      #root { visibility: hidden; }
      .seo-static-page { max-width: 76rem; margin: 0 auto; padding: 6rem 1.5rem 3rem; }
      .seo-static-header { display: flex; justify-content: space-between; gap: 1rem; align-items: center; margin-bottom: 2rem; }
      .seo-static-header a { color: #00e5ff; }
      .seo-static-card { padding: 1.5rem; margin-bottom: 1.5rem; }
      .seo-static-card h2 { margin: 0 0 1rem; font-size: 1.5rem; }
      @media (max-width: 767px) { .seo-static-page { padding-top: 2rem; } .seo-static-header { align-items: flex-start; flex-direction: column; } }
    </style>
  </head>
  <body>
    <div id="root">
      <main class="seo-static-page">
        <header class="seo-static-header"><a href="/">sedefada.com</a><a href="/">Ana Sayfa</a></header>
        <h1>${heading}</h1>
        ${renderStaticArticles(itemId)}
      </main>
    </div>
    ${script}
  </body>
</html>`;
}

function staticSeoPages(): Plugin {
  return {
    name: 'static-turkish-seo-pages',
    apply: 'build',
    generateBundle(_, bundle) {
      const stylesheet = Object.values(bundle).find(
        (output) => output.type === 'asset' && output.fileName.endsWith('.css'),
      )?.fileName;
      const entryScript = Object.values(bundle).find(
        (output) => output.type === 'chunk' && output.isEntry,
      )?.fileName;

      for (const page of STATIC_PAGES) {
        for (const lang of ['tr', 'en'] as const) {
          const localizedRoute = lang === 'tr' ? page.route : `en/${page.route}`;
          this.emitFile({
            type: 'asset',
            fileName: `${localizedRoute}/index.html`,
            source: renderStaticPage(localizedRoute, page.itemId, page.heading, lang, stylesheet, entryScript),
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