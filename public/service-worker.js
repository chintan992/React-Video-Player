/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

// Declare expected global for TypeScript
/// <reference lib="webworker" />

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// Ensure workbox is available
if (typeof workbox === 'undefined') {
  // eslint-disable-next-line no-console
  console.error('Workbox could not be loaded. Offline support is disabled.');
} else {
  workbox.core.setCacheNameDetails({
    prefix: 'letsstream',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime'
  });

  // Pre-cache important routes and assets
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1.0' },
    { url: '/index.html', revision: '1.0' },
    { url: '/manifest.json', revision: '1.0' },
    { url: '/favicon.ico', revision: '1.0' },
    { url: '/logo192.png', revision: '1.0' },
    { url: '/logo512.png', revision: '1.0' }
  ]);

  // Cache page navigations
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        })
      ]
    })
  );

  // Cache TMDB API responses
  workbox.routing.registerRoute(
    /^https:\/\/api\.themoviedb\.org\/3\//,
    new workbox.strategies.NetworkFirst({
      cacheName: 'tmdb-api-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 // 1 hour
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  );

  // Cache TMDB images
  workbox.routing.registerRoute(
    /^https:\/\/image\.tmdb\.org\//,
    new workbox.strategies.CacheFirst({
      cacheName: 'tmdb-images-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  );

  // Cache static assets (JS, CSS, etc)
  workbox.routing.registerRoute(
    /\.(?:js|css|woff2?)$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources'
    })
  );

  // Handle offline fallback
  workbox.routing.setCatchHandler(({ event }) => {
    switch (event.request.destination) {
      case 'document':
        return workbox.precaching.matchPrecache('/offline.html');
      case 'image':
        return new Response(
          `<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <title id="offline-title">Offline</title>
            <rect width="100%" height="100%" fill="#f5f6f7"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui">
              Offline
            </text>
          </svg>`,
          { headers: { 'Content-Type': 'image/svg+xml' } }
        );
      default:
        return Response.error();
    }
  });
}

// Skip waiting and claim clients
addEventListener('install', (event) => {
  event.waitUntil(skipWaiting());
});

addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
