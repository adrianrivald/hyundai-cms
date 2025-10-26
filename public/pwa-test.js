// PWA Test Script
// This script can be run in the browser console to test PWA functionality

console.log('Testing PWA functionality...');

// Test 1: Check if service worker is registered
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log('Service Worker registrations:', registrations.length);
    if (registrations.length > 0) {
      console.log('✅ Service Worker is registered');
    } else {
      console.log('❌ Service Worker is not registered');
    }
  });
} else {
  console.log('❌ Service Worker not supported');
}

// Test 2: Check if IndexedDB is available
if ('indexedDB' in window) {
  console.log('✅ IndexedDB is supported');
  
  // Test IndexedDB connection
  const request = indexedDB.open('HyundaiQRDB', 1);
  request.onsuccess = () => {
    console.log('✅ IndexedDB connection successful');
    request.result.close();
  };
  request.onerror = () => {
    console.log('❌ IndexedDB connection failed');
  };
} else {
  console.log('❌ IndexedDB not supported');
}

// Test 3: Check if app can be installed
if ('BeforeInstallPromptEvent' in window) {
  console.log('✅ App can be installed as PWA');
} else {
  console.log('ℹ️ App installation prompt not available (may need to be triggered manually)');
}

// Test 4: Check offline storage
async function testOfflineStorage() {
  try {
    const { offlineStorage } = await import('./app/lib/offline-storage.ts');
    await offlineStorage.init();
    console.log('✅ Offline storage initialized');
    
    // Test adding a visitor
    const testVisitor = {
      name: 'Test Visitor',
      dob: '1990-01-01',
      phone_number: '1234567890',
      email: 'test@example.com',
      sex: 'male',
      is_special_need: false,
      tour_number: 'TEST001',
      verification_code: 'TEST123'
    };
    
    const id = await offlineStorage.addVisitor(testVisitor);
    console.log('✅ Test visitor added with ID:', id);
    
    const visitors = await offlineStorage.getVisitors();
    console.log('✅ Retrieved visitors:', visitors.length);
    
  } catch (error) {
    console.log('❌ Offline storage test failed:', error);
  }
}

// Run offline storage test
testOfflineStorage();

console.log('PWA test completed. Check the results above.');
