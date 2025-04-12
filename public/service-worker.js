
// Service Worker for Plant Care System (GreenHealth) PWA
const CACHE_NAME = 'plant-care-v1';

// Assets to cache for offline use
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// Dynamic cache for API responses and other runtime resources
const DYNAMIC_CACHE = 'plant-care-dynamic-v1';

// Install event - Cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell and static assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - Clean old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, DYNAMIC_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Helper function to determine if request should be cached
const shouldCache = (url) => {
  // Don't cache API calls or authentication requests
  if (url.includes('/api/') || url.includes('firebaseauth')) {
    return false;
  }
  // Cache static assets and navigation requests
  return true;
};

// Fetch event with network-first strategy for API requests and cache-first for static assets
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle API requests with network-first strategy
  if (event.request.url.includes('/api/') || event.request.url.includes('gemini')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // For navigation requests, try cache first, then network
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/')
        .then(response => {
          return response || fetch(event.request);
        })
        .catch(() => {
          return caches.match('/');
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Check if this request should be cached
            if (shouldCache(event.request.url)) {
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            
            return response;
          })
          .catch(() => {
            // If both network and cache fail for images, return a fallback
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('/placeholder.svg');
            }
            return new Response('Network error occurred', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body || 'New plant care notification!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Dismiss',
        icon: '/icons/icon-72x72.png'
      },
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Plant Care System', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Handle synchronization for offline actions
self.addEventListener('sync', function(event) {
  if (event.tag === 'plant-identification-sync') {
    event.waitUntil(syncPlantIdentification());
  }
});

// Function to handle syncing pending plant identification requests
function syncPlantIdentification() {
  // Here you would normally pull from IndexedDB to process offline requests
  console.log('Syncing pending plant identification requests');
  return Promise.resolve();
}
