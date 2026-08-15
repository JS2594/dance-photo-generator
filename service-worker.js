const CACHE='popshot-v10.4.2';
const CODE_SUFFIXES=['.html','.js','.css','.webmanifest','.json'];

self.addEventListener('install',event=>{
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;

  const url=new URL(req.url);
  const isNavigation=req.mode==='navigate';
  const isCode=isNavigation || CODE_SUFFIXES.some(s=>url.pathname.endsWith(s));

  // 代码与页面：network-first + no-store，避免安装到桌面后卡在旧版本。
  if(isCode){
    event.respondWith(
      fetch(req,{cache:'no-store'})
        .then(resp=>{
          const copy=resp.clone();
          caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});
          return resp;
        })
        .catch(()=>caches.match(req).then(r=>r||caches.match('./index.html')))
    );
    return;
  }

  // 图片等静态素材：缓存优先，后台刷新。
  event.respondWith(
    caches.match(req).then(hit=>{
      const fresh=fetch(req).then(resp=>{
        const copy=resp.clone();
        caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});
        return resp;
      }).catch(()=>hit);
      return hit||fresh;
    })
  );
});
