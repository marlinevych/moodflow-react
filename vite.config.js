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
      includeAssets: ['favicon.svg', 'icons/*.svg', 'icons/*.png', 'locales/*.json'],
      manifest: {
        "short_name": "MoodFlow",
        "name": "MoodFlow – Дізнайся свій настрій",
        "icons": [
          {
            "src": "icons/pwa-192.png",
            "type": "image/png",
            "sizes": "192x192"
          },
          {
            "src": "icons/pwa-512.png",
            "type": "image/png",
            "sizes": "512x512"
          }
        ],
        "screenshots": [
          {
            "src": "icons/screenshot-desktop.png",
            "sizes": "1280x720",
            "type": "image/png",
            "form_factor": "wide"
          },
          {
            "src": "icons/screenshot-mobile.png",
            "sizes": "720x1280",
            "type": "image/png"
          }
        ],
        "start_url": "/moodflow-react/",
        "background_color": "#ffffff",
        "display": "standalone",
        "theme_color": "#4d00ed"
      },
      workbox: {
        navigateFallback: '/moodflow-react/index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        
        maximumFileSizeToCacheInBytes: 7340032,

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
      devOptions: {
        enabled: true, 
      },
    }),
  ],
})