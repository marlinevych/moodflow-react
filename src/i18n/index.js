import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend' 
const isProd = import.meta.env.PROD;
const basePrefix = '/moodflow-react';
i18n
  .use(Backend) 
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `${basePrefix}/locales/{{lng}}.json`,
    },
    lng: localStorage.getItem('moodflow-lang') || 'uk',
    fallbackLng: 'uk',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n