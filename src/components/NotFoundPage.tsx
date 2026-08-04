import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/useLanguage';

export function NotFoundPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sedef-bg flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Arkaplan gradient ve dekoratif elementler */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Deniz gradient efekti */}
        <div className="absolute inset-0 bg-gradient-to-b from-sedef-bg via-sedef-card-bg/30 to-sedef-accent/5" />
        
        {/* Dalga efekti - alt kısımda */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-32 text-sedef-accent/10" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,30 1440,60 L1440,120 L0,120 Z" opacity="0.3"/>
            <path fill="currentColor" d="M0,80 C360,40 720,100 1080,80 C1260,60 1380,100 1440,80 L1440,120 L0,120 Z" opacity="0.2"/>
          </svg>
        </div>

        {/* Yüzen martı silüetleri */}
        <div className="absolute top-16 left-[10%] animate-float" style={{ animationDuration: '8s' }}>
          <Seagull className="w-8 h-6 text-sedef-accent/25" />
        </div>
        <div className="absolute top-24 right-[15%] animate-float" style={{ animationDuration: '10s', animationDelay: '2s' }}>
          <Seagull className="w-10 h-8 text-sedef-accent/20" />
        </div>
        <div className="absolute top-40 left-[25%] animate-float" style={{ animationDuration: '12s', animationDelay: '4s' }}>
          <Seagull className="w-6 h-5 text-sedef-accent/15" />
        </div>
        <div className="absolute top-32 right-[30%] animate-float" style={{ animationDuration: '9s', animationDelay: '1s' }}>
          <Seagull className="w-7 h-6 text-sedef-accent/18" />
        </div>

        {/* Su damlacıkları / köpük efekti */}
        <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-3 opacity-15">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-sedef-accent animate-bubble"
              style={{ 
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }} 
            />
          ))}
        </div>
      </div>

      {/* Ana içerik kartı */}
      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Dekoratif çerçeve */}
        <div className="absolute inset-0 bg-gradient-to-br from-sedef-accent/10 to-transparent rounded-3xl blur-xl" />
        
        <div className="relative bg-sedef-card-bg/80 backdrop-blur-sm border border-sedef-accent/20 rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* 404 Numarası - büyük ve belirgin */}
          <div className="mb-6 relative">
            <span className="text-8xl md:text-9xl font-bold bg-gradient-to-br from-sedef-accent to-sedef-accent/50 bg-clip-text text-transparent drop-shadow-lg">
              {t.notFoundCode}
            </span>
            {/* Alt çizgi efekti */}
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-sedef-accent/40 to-transparent mx-auto mt-4" />
          </div>

          {/* Martı ikonu */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <Seagull className="w-20 h-16 text-sedef-accent/50" />
              {/* Kanat çırpma animasyonu */}
              <style>{`
                @keyframes wingFlap {
                  0%, 100% { transform: scaleY(1); }
                  50% { transform: scaleY(0.7); }
                }
                .wing-flap {
                  animation: wingFlap 2s ease-in-out infinite;
                  transform-origin: center;
                }
              `}</style>
            </div>
          </div>

          {/* Başlık */}
          <h1 className="text-2xl md:text-3xl font-bold text-sedef-primary mb-4">
            {t.notFoundTitle}
          </h1>

          {/* Açıklama */}
          <p className="text-base md:text-lg text-sedef-secondary mb-4 leading-relaxed">
            {t.notFoundDesc}
          </p>

          {/* İpucu */}
          <p className="text-sm text-sedef-secondary/60 mb-8 italic">
            {t.notFoundHint}
          </p>

          {/* Ana buton */}
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sedef-accent to-sedef-accent/90 text-white rounded-full font-medium 
                       hover:from-sedef-accent/90 hover:to-sedef-accent transition-all duration-300 
                       shadow-lg hover:shadow-xl hover:-translate-y-1
                       flex items-center justify-center gap-3 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t.notFoundBack}
          </button>

          {/* Alternatif navigasyon linkleri */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-sedef-secondary/70">
            <button 
              onClick={() => navigate('/sedef-adasi-ve-tarihi')}
              className="hover:text-sedef-accent transition-colors underline underline-offset-4"
            >
              {t.navHakkinda}
            </button>
            <span className="text-sedef-accent/30">•</span>
            <button 
              onClick={() => navigate('/ulasim-tarifesi')}
              className="hover:text-sedef-accent transition-colors underline underline-offset-4"
            >
              {t.navUlasim}
            </button>
          </div>
        </div>

        {/* Dekoratif ayırıcı */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-sedef-accent/30" />
          <Seagull className="w-5 h-4 text-sedef-accent/30" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-sedef-accent/30" />
        </div>
      </div>

      {/* Alt bilgi */}
      <div className="absolute bottom-4 text-xs text-sedef-secondary/30">
        sedefada.com
      </div>

      {/* Global animasyon stilleri */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
          }
          25% { 
            transform: translateY(-10px) translateX(5px); 
          }
          50% { 
            transform: translateY(-5px) translateX(-5px); 
          }
          75% { 
            transform: translateY(-15px) translateX(3px); 
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes bubble {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-40px) scale(0.8);
            opacity: 0;
          }
        }
        .animate-bubble {
          animation: bubble 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Martı SVG bileşeni
function Seagull({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {/* Sol kanat */}
      <path d="M50 35 Q25 15 10 25 Q20 30 30 28 Q40 33 50 35" />
      <path d="M15 27 Q22 22 28 25" strokeWidth="1.5" />
      
      {/* Sağ kanat */}
      <path d="M50 35 Q75 15 90 25 Q80 30 70 28 Q60 33 50 35" />
      <path d="M72 27 Q80 22 85 25" strokeWidth="1.5" />
      
      {/* Vücut */}
      <ellipse cx="50" cy="38" rx="8" ry="12" fill="currentColor" fillOpacity="0.3" />
      
      {/* Baş */}
      <circle cx="50" cy="28" r="5" fill="currentColor" fillOpacity="0.4" />
      
      {/* Gaga */}
      <path d="M54 26 L60 24 L54 29 Z" fill="currentColor" />
      
      {/* Göz */}
      <circle cx="48" cy="27" r="1" fill="currentColor" />
    </svg>
  );
}