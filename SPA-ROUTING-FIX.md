# SPA Routing 404 Hatası Çözümü

## Sorun
Production'da sayfalar arasında geçiş yaparken veya sayfayı yenilerken 404 hataları oluşuyordu.

## Kök Neden
Vite yapılandırmasında `base: './'` ayarı, React Router ile uyumsuzluk yaratıyordu. Bu ayar, Single Page Application (SPA) routing'inin düzgün çalışmasını engelliyordu.

## Uygulanan Çözüm

### 1. Vite Config Güncellendi ✅
`vite.config.ts` dosyasında:
```diff
- base: './',
+ base: '/',
```

Bu değişiklik, tüm asset'lerin root'tan yüklenmesini sağlar ve React Router'ın düzgün çalışmasına izin verir.

### 2. Build Sonrası Yeniden Dağıtım
Değişikliğin etkili olması için:
```bash
npm run build
```
Sonra build dosyalarını production sunucunuza yeniden yükleyin.

## Sunucu Tarafı Yapılandırması (ÖNEMLİ)

SPA'lar için sunucu yapılandırması kritik önem taşır. Tüm isteklerin `index.html`'e yönlendirilmesi gerekir.

### Apache (.htaccess)
Eğer Apache kullanıyorsanız, `.htaccess` dosyanıza şunu ekleyin:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/assets/
  RewriteRule . /index.html [L]
</IfModule>
```

### Nginx
Eğer Nginx kullanıyorsanız, sunucu yapılandırmanıza şunu ekleyin:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Netlify
Eğer Netlify kullanıyorsanız, `public/_redirects` dosyası oluşturun:
```
/*    /index.html   200
```

### Vercel
Vercel otomatik olarak SPA routing'i destekler, ancak emin olmak için `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### GitHub Pages
GitHub Pages kullanıyorsanız:
1. `vite.config.ts`'de `base` ayarını GitHub repo adınıza göre ayarlayın:
   ```typescript
   base: '/repo-adınız/',
   ```
2. React Router'da `basename` kullanın:
   ```typescript
   <BrowserRouter basename="/repo-adınız">
   ```

## Test Adımları

1. **Build yapın:**
   ```bash
   npm run build
   ```

2. **Yerel test:**
   ```bash
   npm run preview
   ```
   Ardından `http://localhost:4173` adresinde farklı sayfalara gidin ve sayfayı yenileyin.

3. **Production'da test:**
   - Build dosyalarını sunucuya yükleyin
   - Farklı sayfalara doğrudan URL ile gidin (ör: `https://sedefada.com/anilar`)
   - Sayfayı yenileyin (F5)
   - Tarayıcı geri/ileri butonlarını test edin

## Ek Notlar

- `base: '/'` ayarı, domain root'unda çalışan siteler için idealdir
- Eğer alt dizinde çalışıyorsa (ör: `example.com/sedefada/`), `base` ayarını buna göre yapın
- React Router'ın `BrowserRouter` kullanımı, sunucu tarafı yönlendirme gerektirir
- Hash Router (`HashRouter`) alternatif olabilir ama SEO için önerilmez

## Sorun Devam Ederse

1. Sunucu yapılandırmanızı kontrol edin
2. Tarayıcı önbelleğini temizleyin (Ctrl+Shift+Delete)
3. CDN kullanıyorsanız, CDN önbelleğini temizleyin
4. Build sürecini temizden başlatın:
   ```bash
   rm -rf dist
   npm run build
   ```

## Başarı Kriterleri

✅ Tüm sayfalara doğrudan URL ile erişilebiliyor
✅ Sayfa yenileme (F5) sonrası 404 hatası alınmıyor
✅ Tarayıcı geri/ileri butonları düzgün çalışıyor
✅ Mobil ve masaüstü tarayıcılarda tutarlı davranış

Bu çözümler uygulandıktan sonra 404 hatalarının tamamen ortadan kalkması gerekir.