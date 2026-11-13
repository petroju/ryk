// Тигреня Рик і звук Р — offline cache for the presentation. Bump VERSION on every release.
const VERSION = 'ryk-v1';
const CORE = ['./', './index.html'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('ryk-') && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const font = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== self.location.origin && !font) return;
  const page = req.mode === 'navigate';
  // Answer from cache at once, refresh the cache in the background; offline, the cache is all there is.
  e.respondWith(caches.open(VERSION).then(async c => {
    const key = page ? './index.html' : req;
    const hit = await c.match(key, { ignoreSearch: page });
    const net = fetch(req).then(res => { if (res && (res.ok || res.type === 'opaque')) c.put(key, res.clone()); return res; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return (await net) || Response.error();
  }));
});
