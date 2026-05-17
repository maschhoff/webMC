/* ============================================================
   WebMC Service Worker – PWA offline-ready cache
   ============================================================ */

const CACHE = 'webmc-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/app.js',
        '/manifest.json',
        '/pwa-icon.svg',
        '/pwa-icon-192.png',
        '/pwa-icon-512.png',
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Nur same-origin Anfragen cachen
  if (url.origin !== location.origin) return;

  // API-Anfragen niemals cachen
  if (url.pathname.startsWith('/webmc-api/')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => {
      // Cache-Fallback: erst Netzwerk, bei Fehler aus dem Cache
      const fetched = fetch(e.request).then((res) => {
        // Nur HTTP 200 in den Cache übernehmen
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('/index.html'));

      return cached || fetched;
    })
  );
});
