// Goed Bezig – Service Worker
// Network-first strateji: önce internetten güncel dosyayı çekmeye çalışır,
// başarısız olursa (çevrimdışıysa) cache'den verir. Böylece ders/cümle
// güncellemeleri her zaman en güncel haliyle gelir, eski cache asılı kalmaz.

const CACHE_NAME = 'goed-bezig-v5'; // her güncellemede bu numarayı artır
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon-72.png',
  './icon-96.png',
  './icon-128.png',
  './icon-144.png',
  './icon-152.png',
  './icon-192.png',
  './icon-384.png',
  './icon-512.png'
];

self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // HTML ve JSON dosyaları için: önce ağdan dene (güncel veri için),
  // başarısız olursa cache'e düş. Resimler için cache-first kalır (değişmiyor).
  var url = event.request.url;
  var isAppShell = url.indexOf('.html') !== -1 || url.indexOf('.json') !== -1 || event.request.mode === 'navigate';

  if (isAppShell) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function() {
        return caches.match(event.request).then(function(cached) {
          return cached || caches.match('./index.html');
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        return fetch(event.request).then(function(response) {
          if (event.request.method === 'GET' && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, clone);
            });
          }
          return response;
        });
      })
    );
  }
});
