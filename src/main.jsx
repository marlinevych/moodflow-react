import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register' // Імпорт ТУТ (на початку)
import App from './App.jsx'
import './i18n/index.js'
import './index.css'

// Реєструємо Service Worker для офлайну
registerSW({ immediate: true });

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);