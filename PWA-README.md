# Hyundai CMS PWA - Offline QR Scan

This web application has been converted to a Progressive Web App (PWA) with offline functionality for the QR scan features.

## Features

### PWA Features

- ✅ **App Manifest**: Configured for standalone app experience
- ✅ **Service Worker**: Handles offline caching and background sync
- ✅ **PWA Icons**: Multiple icon sizes for different devices
- ✅ **Offline Support**: Works without internet connection

### Offline QR Scan Features

- ✅ **Scan Visitors**: QR code scanning works offline
- ✅ **Visitor List**: View and manage visitors offline
- ✅ **Add Visitors**: Add new visitors offline
- ✅ **Mark Attendance**: Mark visitors as attended offline
- ✅ **Data Sync**: Automatically syncs when back online

## How to Test

### 1. Install as PWA

1. Open the app in Chrome/Edge
2. Look for the "Install" button in the address bar
3. Click "Install" to add to home screen
4. The app will open in standalone mode

### 2. Test Offline Functionality

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Check "Offline" checkbox to simulate offline mode
4. Try the following features:
   - Scan QR codes
   - View visitor list
   - Add new visitors
   - Mark visitors as attended

### 3. Test Data Sync

1. Add some visitors while offline
2. Turn network back on
3. Check that data syncs automatically
4. Verify data appears in online mode

## Technical Implementation

### Files Added/Modified

- `public/manifest.json` - PWA manifest
- `public/sw.js` - Service worker for offline functionality
- `public/icons/` - PWA icons (multiple sizes)
- `app/lib/offline-storage.ts` - IndexedDB utilities
- `app/hooks/use-offline-mode.ts` - React hook for offline state
- `app/components/offline-indicator.tsx` - Offline status indicator
- `app/root.tsx` - PWA meta tags and service worker registration
- `app/page/qr-scan/` - Updated components for offline support

### Offline Storage

- Uses IndexedDB for persistent offline storage
- Stores visitor data locally when offline
- Automatically syncs when connection is restored
- Handles conflicts gracefully

### Service Worker

- Caches essential app files
- Handles offline requests
- Manages background sync
- Provides offline fallbacks

## Browser Support

- ✅ Chrome/Chromium (recommended)
- ✅ Edge
- ✅ Firefox (with limitations)
- ✅ Safari (iOS 11.3+)

## Notes

- The app works best in Chrome/Edge for full PWA features
- Offline data is stored locally and syncs when online
- QR scanning requires camera access (works offline)
- All visitor management features work offline

## Troubleshooting

- If service worker doesn't register, check browser console
- Clear browser cache if experiencing issues
- Ensure HTTPS is enabled for PWA features
- Check that camera permissions are granted for QR scanning
