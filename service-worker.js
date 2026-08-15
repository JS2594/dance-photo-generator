const CACHE='popshot-v10.3.0-local-face';
const CORE=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./popshot-config.json','./public/icons/icon-192.png','./public/icons/icon-512.png','./public/vendor/pico.js','./public/vendor/facefinder'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.url.includes('version.json')){e.respondWith(fetch(e.request));return}e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)))});
