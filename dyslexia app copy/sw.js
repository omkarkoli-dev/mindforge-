/**
 * MINDFORGE - Progressive Web App (PWA) Service Worker
 * Version: mindforge-v1.0.0
 * Provides offline caching, resilient fallbacks, and instantaneous app loading.
 */

const CACHE_NAME = 'mindforge-v1';

// Essential offline app assets
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './styles/dyslexia-theme.css',
  './scripts/storage.js',
  './scripts/demo-data.js',
  './scripts/gemini-service.js',
  './scripts/speech-engine.js',
  './scripts/reader-tools.js',
  './scripts/creative-studio.js',
  './scripts/brain-gym.js',
  './scripts/app.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon.svg'
];

// Optional CDN assets to pre-cache if online
const CDN_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic-regular.min.css',
  'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js'
];

/**
 * Service Worker Install Event
 * Pre-caches core app shell for 100% offline access
 */
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[ServiceWorker] Pre-caching MindForge core shell...');

      // Cache core assets safely
      for (const url of CORE_ASSETS) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn(`[ServiceWorker] Could not pre-cache core asset: ${url}`, err);
        }
      }

      // Try caching CDN assets if online (fail silently if offline)
      for (const url of CDN_ASSETS) {
        try {
          const response = await fetch(url, { mode: 'cors' });
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (e) {
          // Ignore offline CDN pre-cache errors
        }
      }
    })
  );
});

/**
 * Service Worker Activate Event
 * Cleans up old outdated caches and claims active clients immediately
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`[ServiceWorker] Removing stale cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

/**
 * Service Worker Fetch Event
 * Implements Cache-First strategy with Network Fallback
 */
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Bypass Gemini AI calls (handled client-side by demo-data.js fallback)
  if (url.hostname.includes('generativelanguage.googleapis.com')) {
    return;
  }

  // 2. Only cache GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset immediately
        return cachedResponse;
      }

      // Not in cache: fetch from network and cache for next time
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback for navigation requests when totally offline
        if (request.mode === 'navigate' || request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
