import { StrictMode, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './lib/LanguageContext';
import './index.css';

document.body.classList.remove('light-mode');
localStorage.removeItem('sedefada-theme');

function AppRoot() {
  useLayoutEffect(() => {
    const root = document.getElementById('root');
    if (root) root.style.visibility = 'visible';
  }, []);

  return (
    <StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(
  <AppRoot />
);
