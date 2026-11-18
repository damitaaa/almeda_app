const CACHE_NAME = "almeda-v1";

const APP_FILES = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/manifest.json"
];

// Cache the main app files
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(APP_FILES);
        })
    );
    self.skipWaiting();
});

// Remove old caches
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );

    self.clients.claim();
});

// Serve cached app files when offline
self.addEventListener("fetch", event => {
    const request = event.request;

    if (request.method !== "GET") return;

    // Keep API requests live
    if (new URL(request.url).pathname.startsWith("/api/")) {
        return;
    }

    // Only handle requests from Almeda's own origin
    if (new URL(request.url).origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(request).then(cachedResponse => {
            return cachedResponse || fetch(request);
        })
    );
});