self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // Skip unsupported schemes (e.g., chrome-extension)
  if (!event.request.url.startsWith('http')) return;
  event.respondWith(
    caches.open('fleet-asphalt-nexus-cache').then(cache => {
      return cache.match(event.request).then(response => {
        if (response) return response;
        return fetch(event.request)
          .then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          .catch(() => {
            // Return a generic fallback response for failed requests
            return new Response('Network error occurred', {
              status: 408,
              statusText: 'Network Error',
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      });
    })
  );
}); 