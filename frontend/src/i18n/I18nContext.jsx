import { createContext, useContext, useState, useEffect } from 'react';
import translations from './translations';

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('opaloliva_lang') || 'hu';
    } catch {
      return 'hu';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('opaloliva_lang', lang);
    } catch {}
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang] || translations.hu;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
