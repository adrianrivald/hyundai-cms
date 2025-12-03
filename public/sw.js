const CACHE_NAME = 'hyundai-qr-cache-v1';
const OFFLINE_URLS = [
  '/',
  '/qr-scan',
  '/qr-scan/scan-visitor',
  '/qr-scan/visitor-list',
  '/qr-scan/scan-visitor/add',
  '/qr-scan/settings'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching essential files');
        return cache.addAll([
          '/',
          '/manifest.json',
          '/icons/icon-192x192.png',
          '/icons/icon-512x512.png'
        ]);
      })
      .then(() => {
        console.log('Service Worker installed');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
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

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle all navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // If network fails, serve the cached version
          return caches.match('/') || caches.match('/qr-scan');
        })
    );
    return;
  }

  // Handle other requests (API calls, assets, etc.)
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }

        return fetch(request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return cached version if available
            return caches.match(request);
          });
      })
  );
});

// Handle background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-visitors') {
    event.waitUntil(syncOfflineVisitors());
  }
});

// Sync offline visitor data when back online
async function syncOfflineVisitors() {
  try {
    const offlineVisitors = await getOfflineVisitors();
    
    for (const visitor of offlineVisitors) {
      try {
        await syncVisitor(visitor);
        await removeOfflineVisitor(visitor.id);
      } catch (error) {
        console.error('Failed to sync visitor:', visitor.id, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Get offline visitors from IndexedDB
async function getOfflineVisitors() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('HyundaiQRDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('visitors')) {
        const store = db.createObjectStore('visitors', { keyPath: 'id' });
        store.createIndex('synced', 'synced', { unique: false });
        store.createIndex('created_at', 'created_at', { unique: false });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['visitors'], 'readonly');
      const store = transaction.objectStore('visitors');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
      
      getAllRequest.onerror = () => {
        reject(getAllRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Sync individual visitor to server
async function syncVisitor(visitor) {
  const response = await fetch('/api/admin/participants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(visitor)
  });
  
  if (!response.ok) {
    throw new Error('Failed to sync visitor');
  }
  
  return response.json();
}

// Remove visitor from offline storage
async function removeOfflineVisitor(visitorId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('HyundaiQRDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('visitors')) {
        const store = db.createObjectStore('visitors', { keyPath: 'id' });
        store.createIndex('synced', 'synced', { unique: false });
        store.createIndex('created_at', 'created_at', { unique: false });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['visitors'], 'readwrite');
      const store = transaction.objectStore('visitors');
      const deleteRequest = store.delete(visitorId);
      
      deleteRequest.onsuccess = () => {
        resolve();
      };
      
      deleteRequest.onerror = () => {
        reject(deleteRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
