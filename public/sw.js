const CACHE = "resumate-v6";
const STATIC_RE = /\.(?:png|ico|svg|woff2?|webmanifest)$/;

function collect(text, into) {
  for (const m of text.matchAll(/\/_next\/static\/[\w./-]+\.js/g)) into.add(m[0]);
  for (const m of text.matchAll(/(?<![/\w])static\/chunks\/[\w.-]+\.js/g)) into.add(`/_next/${m[0]}`);
}

// Fetch every referenced chunk + follow nested "static/chunks/..." refs
// (lazily-imported modules like the docx builder) until nothing new appears.
// Static assets are never evicted, so a cached page's chunks always stay
// available — every cached HTML entry remains self-consistent across deploys.
async function crawl(texts, cache) {
  const assets = new Set();
  for (const t of texts) collect(t, assets);
  const scanned = new Set();
  for (;;) {
    const pending = [...assets].filter((a) => !scanned.has(a));
    if (!pending.length) break;
    await Promise.allSettled(
      pending.map(async (a) => {
        scanned.add(a);
        if (await cache.match(a)) return;
        const res = await fetch(a);
        if (res.ok) {
          await cache.put(a, res.clone());
          collect(await res.text(), assets);
        }
      }),
    );
  }
}

async function precache() {
  const cache = await caches.open(CACHE);
  let paths = ["/zh", "/en"];
  try {
    const xml = await (await fetch("/sitemap.xml")).text();
    paths = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))];
  } catch {}
  const texts = [];
  await Promise.allSettled(
    paths.map(async (p) => {
      const res = await fetch(p);
      if (!res.ok) return;
      await cache.put(p, res.clone());
      texts.push(await res.text());
    }),
  );
  await crawl(texts, cache);
}

// After serving a page/RSC payload online: cache it and make sure every chunk
// it references is cached too — pages become offline-complete on first visit.
async function refresh(request, pageRes, scanRes) {
  const cache = await caches.open(CACHE);
  await cache.put(request, pageRes);
  await crawl([await scanRes.text()], cache);
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      // Install's waitUntil already resolved, so precache is done — tell pages
      // the whole site (incl. lazy chunks) is usable offline.
      .then(() => self.clients.matchAll())
      .then((clients) => clients.forEach((c) => c.postMessage("sw-ready"))),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Immutable hashed build assets and static files: cache-first
  if (url.pathname.startsWith("/_next/static/") || STATIC_RE.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(request, copy));
            }
            return res;
          }),
      ),
    );
    return;
  }

  // Pages and RSC payloads: network-first, cached copy when offline
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) event.waitUntil(refresh(request, res.clone(), res.clone()));
        return res;
      })
      .catch(async () => {
        // Client-side RSC fetches carry ?_rsc query — match cached HTML ignoring it.
        // Next falls back to a hard navigation when an RSC request gets HTML.
        const hit = await caches.match(request, { ignoreSearch: true });
        if (hit) return hit;
        if (request.mode === "navigate") {
          return (await caches.match("/zh")) || (await caches.match("/en")) || Response.error();
        }
        return Response.error();
      }),
  );
});
