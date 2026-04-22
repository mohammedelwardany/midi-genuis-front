import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationAR from './locales/ar.json';
import siteConfig from './config/site.config.json';

const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
      defaultVariables: {
        appName: siteConfig.clinic.name
      }
    }
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = i18n.dir();
});

export default i18n;
