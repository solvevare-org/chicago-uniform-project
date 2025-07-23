# API Configuration and Ad Blocker Fix

## Problem

The error `net::ERR_BLOCKED_BY_CLIENT` occurs when ad blockers or browser security extensions block requests to specific URLs, especially IP addresses like `http://31.97.41.27:5000`.

## Solution

We've implemented multiple solutions to resolve this issue:

### 1. Vite Proxy Configuration

- Added a proxy in `vite.config.ts` that routes `/api/*` requests through the development server
- This masks the actual IP address from the browser and ad blockers
- In development, all API calls now go through `31.97.41.27:5000/api/*` instead of directly to the IP

### 2. Environment Variable Support

- Updated `.env` file to use `REACT_APP_API_URL`
- Can be easily changed for different environments

### 3. Centralized API Configuration

- Created `src/config/api.ts` with all API endpoints
- Automatic switching between proxy (development) and direct URLs (production)
- Better error handling and logging

## How to Use

### Development Mode

1. Run `npm run dev` or `yarn dev`
2. The Vite proxy will automatically route API calls
3. All requests go through `31.97.41.27:5000/api/*` → `31.97.41.27:5000/api/*`

### Production Mode

- Direct API calls to the configured URL
- Uses environment variables for flexibility

## Environment Variables

```bash
# .env
REACT_APP_API_URL=http://localhost:5000/api
```

## Troubleshooting

### If you still see ERR_BLOCKED_BY_CLIENT:

1. **Disable Ad Blocker temporarily**

   - Disable uBlock Origin, AdBlock Plus, or similar extensions
   - Add your localhost development URL to whitelist

2. **Check Browser Console**

   - Look for additional error messages
   - Verify the API URLs being called

3. **Test Direct API Access**

   - Try opening `http://31.97.41.27:5000/api/styles/brand-names` directly in browser
   - If this fails, the issue is network/server related

4. **Clear Browser Cache**

   - Hard refresh (Ctrl+Shift+R)
   - Clear browser cache and cookies

5. **Try Different Browser**
   - Test in incognito/private mode
   - Try a different browser without extensions

### Alternative Solutions:

1. **Use Different Port**

   ```bash
   # In .env
   REACT_APP_API_URL=http://31.97.41.27:8080/api
   ```

2. **Use Domain Name Instead of IP**

   - If you have a domain pointing to the IP

   ```bash
   REACT_APP_API_URL=http://api.yourdomain.com/api
   ```

3. **HTTPS (if available)**
   ```bash
   REACT_APP_API_URL=https://31.97.41.27:5000/api
   ```

## Files Modified

- `vite.config.ts` - Added proxy configuration
- `src/config/api.ts` - New centralized API configuration
- `src/components/Header/Header.tsx` - Updated to use new API config
- `.env` - Updated with environment variable

## Testing

After making these changes:

1. Restart your development server (`npm run dev`)
2. Check browser network tab to see requests going to `31.97.41.27:5000/api/*`
3. Check console for API request logs
4. Verify data loads correctly in the header dropdowns
