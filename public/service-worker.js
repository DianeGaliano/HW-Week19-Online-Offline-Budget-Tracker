const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/js/index.js',
  "/manifest.webmanifest",
  "/js/indexedDB.js",
  '/css/style.css',
  './icon/icon-192x192.png',
  './icon/icon-192x192.png',
  'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
];

const APP_PREFIX = 'BudgetTracker'
const VERSION = 'version_01';
const CACH_NAME = APP_PREFIX + VERSION;

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache: ' + CACHE_NAME)
      return cache.addAll(FILES_TO_CACHE)
    })
  )
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    catches.keys().then(function (keyList){
      let cacheKeepList = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheKeepList.push(CACH_NAME);
      return Promise.all(keyList.map(function (key, i) {
        if (cacheKeepList.indexOf(key)=== -1) {
          console.log('deleting cache :' + keyList[i]);
          return caches.delete(keyList);
        }
      }));
    })
  )
});

self.addEventListener('fetch', function (e) {
  console.log('fetch request:' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log('responding with cache:' + e.request.url);
        return fetch(e.request)
      }
    })
  )
});