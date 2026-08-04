import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
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
      cache: true,
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