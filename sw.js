// Goed Bezig – Service Worker
// Network-first strateji: önce internetten güncel dosyayı çekmeye çalışır,
// başarısız olursa (çevrimdışıysa) cache'den verir. Böylece ders/cümle
// güncellemeleri her zaman en güncel haliyle gelir, eski cache asılı kalmaz.

const CACHE_NAME = 'goed-bezig-v27'; // her güncellemede bu numarayı artır
const REMINDER_CACHE = 'gb-reminder';  // sayfa ile SW arasında hatırlatma ayarları
const ASSETS = [
  './index.html',
  './manifest.json',
  './favicon-16.png',
  './favicon-32.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
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
        keys.filter(function(key) { return key !== CACHE_NAME && key !== REMINDER_CACHE; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// ── GÜNLÜK HATIRLATMA ─────────────────────────────────────────────────────
// Ayarlar localStorage'da tutulamaz (SW erişemez); sayfa bunları
// REMINDER_CACHE içine yazıyor, SW buradan okuyor.
function dayKey(d) {
  d = d || new Date();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + m + '-' + day;
}

function readReminderPrefs() {
  return caches.open(REMINDER_CACHE)
    .then(function(cache) { return cache.match('reminder-prefs'); })
    .then(function(res) { return res ? res.json() : null; })
    .catch(function() { return null; });
}

function writeReminderState(patch) {
  return readReminderPrefs().then(function(prefs) {
    var next = Object.assign({}, prefs || {}, patch);
    return caches.open(REMINDER_CACHE).then(function(cache) {
      return cache.put('reminder-prefs', new Response(JSON.stringify(next), {
        headers: { 'Content-Type': 'application/json' }
      }));
    });
  }).catch(function() {});
}

function maybeSendReminder() {
  return readReminderPrefs().then(function(prefs) {
    if (!prefs || !prefs.enabled) return;

    var today = dayKey();
    if (prefs.lastNotified === today) return; // bugün zaten gönderildi

    // Hatırlatma saati henüz gelmediyse bekle
    var parts = String(prefs.time || '19:00').split(':');
    var target = new Date();
    target.setHours(parseInt(parts[0], 10) || 0, parseInt(parts[1], 10) || 0, 0, 0);
    if (Date.now() < target.getTime()) return;

    // "Sadece çalışmadıysam" modunda, bugün çalışıldıysa sus
    var studiedToday = Array.isArray(prefs.activeDates) && prefs.activeDates.indexOf(today) !== -1;
    if (prefs.mode === 'idle' && studiedToday) return;

    var body = studiedToday
      ? 'Bugün çalıştın. Birkaç cümle daha ekleyip seriyi güçlendir?'
      : 'Bugün henüz çalışmadın. Birkaç cümle için vakit var!';

    return self.registration.showNotification('Goed Bezig', {
      body: body,
      icon: 'icon-192.png',
      badge: 'icon-96.png',
      tag: 'gb-daily-reminder',
      renotify: true,
      lang: 'tr',
      data: { url: './index.html' }
    }).then(function() {
      return writeReminderState({ lastNotified: today });
    });
  });
}

self.addEventListener('periodicsync', function(event) {
  if (event.tag === 'gb-daily-reminder') {
    event.waitUntil(maybeSendReminder());
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || './index.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if ('focus' in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  // Dış API çağrıları (çeviri, TTS) — service worker hiç karışmasın, direkt ağa git
  var isExternalApi = url.indexOf('translate.googleapis.com') !== -1 ||
                       url.indexOf('mymemory.translated.net') !== -1 ||
                       url.indexOf('elevenlabs.io') !== -1 ||
                       url.indexOf('workers.dev') !== -1;
  if (isExternalApi) {
    return; // event.respondWith çağrılmazsa tarayıcı isteği normal şekilde kendi yönetir
  }

  // HTML ve JSON dosyaları için: önce ağdan dene (güncel veri için),
  // başarısız olursa cache'e düş. Resimler için cache-first kalır (değişmiyor).
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
