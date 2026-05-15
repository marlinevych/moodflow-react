import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/moodflow-react/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.svg', 'icons/*.png'],
      manifest: {
        "short_name": "MoodFlow",
        "name": "MoodFlow — Дізнайся свій настрій",
        "icons": [
          {
            "src": "/icons/pwa-192.png",
            "type": "image/png",
            "sizes": "192x192"
          },
          {
            "src": "/icons/pwa-512.png",
            "type": "image/png",
            "sizes": "512x512"
          }
        ],
        "start_url": "/",
        "background_color": "#ffffff",
        "display": "standalone",
        "theme_color": "#4d00ed"
      },
      workbox: {
        // КРИТИЧНО: Віддавати index.html для будь-якого шляху в офлайні
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/api\.anthropic\.com/,
            handler: 'NetworkOnly',
          },
        ],
      },
      includeAssets: ['favicon.svg', 'locales/*.json', 'icons/*.png'],
      devOptions: {
        enabled: true, // Дозволяє тестувати в dev-режимі
      },
    }),
  ],
})