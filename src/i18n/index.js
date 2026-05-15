import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend' // Це треба додати (див. нижче)
const isProd = import.meta.env.PROD;
const basePrefix = '/moodflow-react';
i18n
  .use(Backend) // Це дозволяє вантажити файли з папки public
  .use(initReactI18next)
  .init({
    backend: {
      // Шлях до твоїх перенесених файлів
      loadPath: `${basePrefix}/locales/{{lng}}.json`,
    },
    lng: localStorage.getItem('moodflow-lang') || 'uk',
    fallbackLng: 'uk',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n