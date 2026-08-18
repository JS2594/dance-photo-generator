const CACHE_NAME='popshot-v1.0.8';
const RELEASE='1.0.8';
const CORE=['./','./index.html','./app.js','./styles.css','./manifest.webmanifest','./popshot-config.json'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil((async()=>{
    const c=await caches.open(CACHE_NAME);
    for(const u of CORE){
      try{ const r=await fetch(u+'?v='+RELEASE,{cache:'reload'}); if(r.ok) await c.put(u,r.clone()); }catch(e){}
    }
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE_NAME && k.toLowerCase().includes('popshot')).map(k=>caches.delete(k)));
    await self.clients.claim();
    const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    clients.forEach(c=>c.postMessage({type:'POPSHOT_RELEASE_ACTIVE',version:RELEASE}));
  })());
});

self.addEventListener('fetch', event => {
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  const core=/\/(index\.html|app\.js|styles\.css|popshot-config\.json|version\.json|manifest\.webmanifest)$/.test(url.pathname) || url.pathname.endsWith('/');
  if(core){
    event.respondWith((async()=>{
      try{
        const r=await fetch(event.request,{cache:'no-store'});
        const c=await caches.open(CACHE_NAME); c.put(event.request,r.clone()).catch(()=>{});
        return r;
      }catch(e){ return (await caches.match(event.request)) || (await caches.match(url.pathname.split('/').pop())) || Response.error(); }
    })());
  }else{
    event.respondWith((async()=>{
      const hit=await caches.match(event.request);
      if(hit) return hit;
      try{
        const r=await fetch(event.request);
        const c=await caches.open(CACHE_NAME); c.put(event.request,r.clone()).catch(()=>{});
        return r;
      }catch(e){ return Response.error(); }
    })());
  }
});
