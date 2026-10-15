// Nexora High-Performance Service Worker & CacheStorage Manager
const CACHE_NAME = 'nexora-v1-static';
const ASSET_CACHE = 'nexora-v1-assets';

// Priority static resources to cache immediately on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== ASSET_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Stale-While-Revalidate & Cache-First Strategy for Images and Static Assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache static assets (images, webp, png, jpg, js, css, fonts, svg)
  if (
    request.method === 'GET' &&
    (request.destination === 'image' ||
      url.pathname.match(/\.(webp|jpg|jpeg|png|svg|css|js|woff2|mp3|mp4)$/i))
  ) {
    event.respondWith(
      caches.open(ASSET_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);

          // Return cached response instantly if available, otherwise wait for network
          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});
