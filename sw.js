const CACHE_NAME='woordenschat-v17';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(['./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-maskable-192.png','./icon-maskable-512.png','./apple-touch-icon.png','./favicon-16.png','./favicon-32.png'])));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));});
self.addEventListener('fetch',e=>{if(e.request.url.includes('supabase.co')||e.request.url.includes('workers.dev'))return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
