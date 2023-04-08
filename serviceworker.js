const CACHE_NAME = 'mqlab-cache_v3';

// Add whichever assets you want to pre-cache here:
const PRECACHE_ASSETS = [
    'manifest.webmanifest',
    'ressources/icon.png',
    'scripts.js',
    'style.css',
    'index.html',
    'colors.html',
    'dimensions.html',
    'display.html',
    'interaction.html',
    'level5.html',
    'mediatypes.html',
    'others.html',
    'proprietary.html'
]

// Listener for the install event - pre-caches our assets list on service worker install.
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll(PRECACHE_ASSETS);
    })());
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        (async () => {
            const r = await caches.match(event.request);
            //console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
            if (r) {
                return r;
            }
            const response = await fetch(event.request);
            const cache = await caches.open(CACHE_NAME);
            //console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
            cache.put(event.request, response.clone());
            return response;
        })()
    )
})
    