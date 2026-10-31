import { createContext, useContext, useEffect, useState } from 'react';
import { translate } from '@/lib/i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('janasahey.language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('janasahey.language', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key, vars) => translate(lang, key, vars);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}