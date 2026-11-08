// DurianExport service worker — network-first for the page, cache fallback offline. Versionless: no cache bump needed on edits.
const CACHE="durianexport";
const ASSETS=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./apple-touch-icon.png","./og-image.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(self.clients.claim());});
self.addEventListener("fetch",e=>{
  const req=e.request;
  if(req.method!=="GET"||new URL(req.url).origin!==location.origin)return;
  e.respondWith(
    fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return r;})
    .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||(req.mode==="navigate"?caches.match("./index.html"):Response.error())))
  );
});
