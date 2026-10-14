// SnapCal service worker: offline app shell + Android "Share to SnapCal" inbox.
const SHELL = 'snapcal-shell-v2';
const INBOX = 'snapcal-share-inbox';
const ASSETS = ['./', './index.html', './manifest.webmanifest',
  './anthropic-sdk.js', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== SHELL && k !== INBOX).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Shared content from another app (Android share sheet)
  if (e.request.method === 'POST' && url.pathname.endsWith('/share')) {
    e.respondWith((async () => {
      try {
        const form = await e.request.formData();
        const inbox = await caches.open(INBOX);
        const text = [form.get('title'), form.get('text'), form.get('url')].filter(Boolean).join('\n');
        await inbox.put('text', new Response(text));
        const files = form.getAll('media');
        await inbox.put('count', new Response(String(files.length)));
        for (let i = 0; i < files.length; i++) {
          await inbox.put('file-' + i, new Response(files[i], {
            headers: { 'Content-Type': files[i].type, 'X-Name': encodeURIComponent(files[i].name || 'shared') }
          }));
        }
      } catch (err) { /* fall through to the app */ }
      return Response.redirect(new URL('./?shared=1', self.registration.scope).href, 303);
    })());
    return;
  }

  if (e.request.method !== 'GET' || url.origin !== location.origin) return;

  // App files: network first so updates arrive, cache as offline fallback
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(SHELL).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
