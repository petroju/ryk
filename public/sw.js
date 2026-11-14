// Offline cache for every presentation on this site. Bump VERSION on every release.
const VERSION = 'logo-v2';
const CORE = ['./', './s/'];   // one entry per presentation folder
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => (k.startsWith('ryk-') || k.startsWith('logo-')) && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const font = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== self.location.origin && !font) return;
  // A page is cached under its folder address, so /s/, /s/index.html and /s/?x=1 are the same entry.
  let key = req;
  if (req.mode === 'navigate') { let p = url.pathname.replace(/index\.html$/, ''); if (!p.endsWith('/')) p += '/'; key = url.origin + p; }
  // Answer from cache at once, refresh the cache in the background; offline, the cache is all there is.
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(key);
    const net = fetch(req).then(res => { if (res && (res.ok || res.type === 'opaque')) c.put(key, res.clone()); return res; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return (await net) || Response.error();
  }));
});
