const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [ '/wasm/plink.js', 
                      '/wasm/plink.wasm',
                      '/sql-wasm.js',
                    '/Annotations.db',
                  'cropLocations.json',
                'worldgeo.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
