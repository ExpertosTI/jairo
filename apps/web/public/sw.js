const CACHE_NAME = 'jairoapp-v2';
const urlsToCache = ['/', '/login', '/registro', '/directorio'];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Never intercept API calls, auth routes, or non-GET requests
    if (
        event.request.method !== 'GET' ||
        url.pathname.startsWith('/api') ||
        url.pathname.startsWith('/auth') ||
        url.pathname.startsWith('/recepcion')
    ) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                }
                return response;
            })
            .catch(() => caches.match(event.request).then((cached) => cached || Response.error()))
    );
});
