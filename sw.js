// ============================================================
// SERVICE WORKER - EduPro Web Sekolah
// Tugasnya: deteksi versi baru dari version.json dan
// bersihkan semua cache browser saat ada update kode.
// ============================================================

var CACHE_VERSION = 'webskul-v1'; // akan di-update oleh logika versi

// Saat SW diinstall: langsung aktif (skipWaiting)
self.addEventListener('install', function(event) {
    self.skipWaiting();
});

// Saat SW aktif: ambil kontrol semua tab
self.addEventListener('activate', function(event) {
    event.waitUntil(
        // Hapus semua cache lama yang namanya berbeda dengan CACHE_VERSION
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(name) {
                    return name !== CACHE_VERSION;
                }).map(function(name) {
                    return caches.delete(name);
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

// Intercept fetch: untuk index.html selalu ambil dari network (no-cache)
// untuk aset lain gunakan cache-first tapi dengan validasi ETag
self.addEventListener('fetch', function(event) {
    var url = new URL(event.request.url);

    // Untuk file version.json: SELALU ambil dari network, jangan cache
    if (url.pathname.endsWith('version.json')) {
        event.respondWith(
            fetch(event.request, { cache: 'no-store' })
        );
        return;
    }

    // Untuk index.html: network-first (pastikan selalu terbaru)
    if (url.pathname === '/' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
        event.respondWith(
            fetch(event.request, { cache: 'no-cache' }).catch(function() {
                return caches.match(event.request);
            })
        );
        return;
    }

    // Untuk file lain (JS, CSS, gambar): cache-first
    // Tapi karena sudah ada ?v= di URL, cache otomatis invalid saat versi berubah
    event.respondWith(
        caches.match(event.request).then(function(cached) {
            if (cached) return cached;
            return fetch(event.request).then(function(response) {
                if (response && response.status === 200 && response.type === 'basic') {
                    var respClone = response.clone();
                    caches.open(CACHE_VERSION).then(function(cache) {
                        cache.put(event.request, respClone);
                    });
                }
                return response;
            });
        })
    );
});

// Terima pesan dari halaman utama untuk update cache version
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SET_VERSION') {
        CACHE_VERSION = 'edupro-' + event.data.version;
        // Bersihkan cache lama
        caches.keys().then(function(names) {
            names.forEach(function(name) {
                if (name !== CACHE_VERSION) caches.delete(name);
            });
        });
    }
});
