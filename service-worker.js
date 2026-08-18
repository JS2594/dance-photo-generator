const CACHE='popshot-v1.0.2-stable';
const CORE=['./','./index.html','./app.js','./styles.css','./manifest.webmanifest','./version.json'];
self.addEventListener('install',e=>e.waitUntil(
  caches.open(CACHE).then(c=>Promise.allSettled(CORE.map(x=>c.add(x+'?v=1.0.2')))).then(()=>self.skipWaiting())
));
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  const critical=e.request.mode==='navigate'||/\/public\/(custom-combos|assets\/characters)\//.test(u.pathname)||/\.(js|css|json|webmanifest)$/.test(u.pathname);
  if(critical){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{
      if(r&&r.ok)caches.open(CACHE).then(c=>c.put(e.request,r.clone()));
      return r;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
  }else{
    e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
      if(r&&r.ok)caches.open(CACHE).then(c=>c.put(e.request,r.clone()));
      return r;
    })));
  }
});
