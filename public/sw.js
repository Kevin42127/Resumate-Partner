const CACHE = "resumate-v5";

async function precache() {
  const cache = await caches.open(CACHE);
  let paths = ["/zh", "/en"];
  try {
    const xml = await (await fetch("/sitemap.xml")).text();
    paths = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))];
  } catch {}
  const assets = new Set();
  const collect = (text, into) => {
    for (const m of text.matchAll(/\/_next\/static\/[\w./-]+\.js/g)) into.add(m[0]);
    for (const m of text.matchAll(/(?<![/\w])static\/chunks\/[\w.-]+\.js/g)) into.add(`/_next/${m[0]}`);
  };
  await Promise.allSettled(
    paths.map(async (p) => {
      const res = await fetch(p);
      if (!res.ok) return;
      await cache.put(p, res.clone());
      collect(await res.text(), assets);
    }),
  );
  // Crawl JS chunks: lazily-imported chunks (e.g. the docx builder) appear as
  // "static/chunks/..." strings inside other chunks — follow until none are new.
  const scanned = new Set();
  for (;;) {
    const pending = [...assets].filter((a) => !scanned.has(a));
    if (!pending.length) break;
    await Promise.allSettled(
      pending.map(async (a) => {
        scanned.add(a);
        try {
          collect(await (await fetch(a)).text(), assets);
        } catch {}
      }),
    );
  }
  await Promise.allSettled([...assets].map((a) => cache.add(a)));
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Immutable hashed build assets and static files: cache-first
  if (url.pathname.startsWith("/_next/static/") || /\.(?:png|ico|svg|woff2?|webmanifest)$/.test(url.pathname)) {
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
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
        }
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
