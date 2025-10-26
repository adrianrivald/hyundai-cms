# PWA Installation Troubleshooting Guide

## Why the Install Button Might Not Appear

The install button in Chrome/Edge appears only when specific PWA criteria are met. Here are the most common issues and solutions:

### 1. **HTTPS Requirement** 🔒

**Issue**: PWA requires HTTPS (except localhost)
**Solution**:

- Use HTTPS in production
- For development, use `localhost` or `127.0.0.1`
- Avoid `http://` URLs in production

### 2. **Manifest Issues** 📋

**Common Problems**:

- Invalid JSON syntax
- Missing required fields
- Incorrect icon paths
- Wrong scope/start_url

**Check**: Visit `/pwa-test.html` to verify manifest loading

### 3. **Service Worker Issues** ⚙️

**Common Problems**:

- Service worker not registered
- Registration errors
- Cache issues

**Check**: Open DevTools → Application → Service Workers

### 4. **Icon Requirements** 🖼️

**Required**:

- At least one icon with 192x192 or 512x512 size
- Icons must be accessible via HTTP/HTTPS
- Proper MIME type (image/png)

### 5. **User Engagement** 👤

**Requirements**:

- User must interact with the site
- Site must be "engaging" (not just visited)
- May need to spend some time on the site

## Step-by-Step Debugging

### Step 1: Check PWA Test Page

1. Visit `http://localhost:3000/pwa-test.html` (or your domain)
2. Review all status indicators
3. Check debug information

### Step 2: Chrome DevTools

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Check **Manifest** section
4. Check **Service Workers** section
5. Look for any errors in **Console**

### Step 3: Lighthouse Audit

1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Run **Progressive Web App** audit
4. Review recommendations

### Step 4: Manual Installation Test

1. In Chrome DevTools → Application → Manifest
2. Click "Add to homescreen" button
3. Check if installation works

## Common Fixes

### Fix 1: Update Manifest

```json
{
  "id": "hyundai-cms-qr-scan",
  "name": "Hyundai CMS - QR Scan",
  "short_name": "Hyundai QR",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ]
}
```

### Fix 2: Service Worker Registration

```javascript
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => console.log("SW registered"))
    .catch((error) => console.log("SW registration failed"));
}
```

### Fix 3: Clear Cache

1. Chrome DevTools → Application → Storage
2. Click "Clear site data"
3. Refresh page
4. Try again

## Testing Checklist

- [ ] Site loads over HTTPS (or localhost)
- [ ] Manifest.json loads without errors
- [ ] Service worker registers successfully
- [ ] Icons are accessible (192x192 and 512x512)
- [ ] User has interacted with the site
- [ ] No console errors
- [ ] Lighthouse PWA score > 90

## Browser-Specific Notes

### Chrome/Edge

- Most strict PWA requirements
- Install button appears in address bar
- Requires user engagement

### Firefox

- Different installation process
- Uses "Install" option in menu
- Less strict requirements

### Safari (iOS)

- Uses "Add to Home Screen"
- Different manifest requirements
- Requires Apple-specific meta tags

## Quick Test Commands

```bash
# Check if manifest is accessible
curl -I http://localhost:3000/manifest.json

# Check if service worker is accessible
curl -I http://localhost:3000/sw.js

# Check if icons are accessible
curl -I http://localhost:3000/icons/icon-192x192.png
curl -I http://localhost:3000/icons/icon-512x512.png
```

## Still Not Working?

1. **Check the PWA test page**: `/pwa-test.html`
2. **Run Lighthouse audit** in Chrome DevTools
3. **Check browser console** for errors
4. **Verify all files are accessible** via HTTP
5. **Try in incognito mode** to avoid cache issues
6. **Test on different devices/browsers**

The most common issue is usually HTTPS or missing icons. Make sure your development server is running on `localhost` and all icon files exist.
