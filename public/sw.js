// CACHE VERSION: Bump this number to force all clients to update immediately
const CACHE_NAME = 'lovspeak-cache-v11';

// App version — must match APP_VERSION in App.tsx
const APP_VERSION = '2.1.0';

// Only cache truly static, rarely-changing assets
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/logo.svg',
];

self.addEventListener('install', (event) => {
  // Force the new SW to activate immediately (don't wait for old tabs to close)
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => console.log('SW Cache error:', err))
  );
});

self.addEventListener('activate', (event) => {
  // Delete ALL old caches when new SW activates
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all open clients immediately
      return self.clients.claim();
    })
  );
});

// Listen for messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    // Respond with the current SW version so the app can detect stale installs
    event.source.postMessage({ type: 'SW_VERSION', version: APP_VERSION, cache: CACHE_NAME });
  }
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // NEVER cache HTML, JS, or TSX files - always fetch from network
  // This ensures UI changes are always reflected immediately
  if (
    event.request.method !== 'GET' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.jsx') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.tsx') ||
    url.pathname.endsWith('.css') ||
    url.pathname === '/'
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For static assets (images, fonts, icons), use cache-first
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        // Only cache same-origin static assets
        if (url.origin === self.location.origin && (
          url.pathname.includes('/logo') ||
          url.pathname.includes('/icons') ||
          url.pathname.includes('/manifest')
        )) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback: return nothing gracefully
        return new Response('', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
