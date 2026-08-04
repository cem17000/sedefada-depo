/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sedef: {
          bg: '#080f1d',
          'card-bg': 'rgba(15, 23, 42, 0.6)',
          border: 'rgba(255, 255, 255, 0.08)',
          primary: '#f8fafc',
          secondary: '#94a3b8',
          accent: '#00e5ff',
          'accent-hover': '#00b8d4',
        },
        light: {
          bg: '#f1f5f9',
          'card-bg': 'rgba(255, 255, 255, 0.7)',
          border: 'rgba(0, 0, 0, 0.08)',
          primary: '#0f172a',
          secondary: '#64748b',
          accent: '#0284c7',
          'accent-hover': '#0369a1',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        // Header'daki `animate-fade-in` sınıfının çalışması için ismi 'fade-in' olarak güncelledik
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          // Menünün sadece görünür olmakla kalmayıp hafifçe yukarıdan aşağı inmesi için transform ekledik
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};