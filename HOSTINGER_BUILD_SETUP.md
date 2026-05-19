# Hostinger Deployment - Build Script Setup

## ✅ Changes Made

### 1. Root package.json Updated
**File:** `package.json`

Added new build script while keeping backend scripts:
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js",
  "build": "node scripts/build-client.js"
}
```

**Why:** Hostinger expects a `build` script in root package.json to build the frontend.

---

### 2. Build Script Created
**File:** `scripts/build-client.js` (NEW)

This Node.js script:
- ✅ Installs dependencies in `client/`
- ✅ Builds React app in `client/` (runs `npm run build`)
- ✅ Removes existing `root/build` directory
- ✅ Copies `client/build` → `root/build`
- ✅ Verifies `root/build/index.html` exists
- ✅ Uses cross-platform code (fs, path, child_process - no shell commands)

---

### 3. Frontend API Config Verified
**File:** `client/src/config/api.js`

✅ Uses environment variable with fallback:
```javascript
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://wheat-chough-880353.hostingersite.com/api";
```

✅ All old Cloud Run URLs removed from client folder

---

## 🧪 Testing Locally

### Test 1: Verify Build Script Works
```bash
# From repo root
npm run build

# Expected output:
# - build/ directory created at root
# - build/index.html exists
# - build/static/ directory exists with JS/CSS files
```

### Test 2: Verify Build Output Structure
```bash
# After npm run build, check:
ls build/
# Should show: index.html, static/

# Verify entry point
cat build/index.html
# Should contain React app HTML
```

### Test 3: Backend Still Works
```bash
# From repo root
npm start

# Expected:
# Server running on port 8080
# Can test endpoints:
# curl http://localhost:8080/api/health
```

### Test 4: Frontend API Config
Check that frontend uses Hostinger URL (or env override):
```bash
# In browser console after frontend loads:
# All API calls should go to:
# https://wheat-chough-880353.hostingersite.com/api
```

---

## 📋 Hostinger Deployment Flow

### Step 1: Push to Git
```bash
git add .
git commit -m "Add build script for Hostinger deployment"
git push
```

### Step 2: On Hostinger Dashboard
1. Connect your Git repository
2. Set build command: (Hostinger will auto-detect from package.json)
3. Root deployment directory: `/` (repo root)
4. Start command: Keep as default (Hostinger handles this)

### Step 3: Hostinger Builds Frontend
When you push:
1. Hostinger runs: `npm install` (installs root dependencies)
2. Hostinger runs: `npm run build` (calls scripts/build-client.js)
3. Build script:
   - Installs client/ dependencies
   - Runs `npm run build` in client/
   - Copies client/build → root/build
4. Hostinger serves `root/build/index.html`

### Step 4: Backend Separate
Backend is deployed separately at:
```
https://wheat-chough-880353.hostingersite.com
```

Frontend (from Hostinger Create React App):
```
https://darkseagreen-lemur-822131.hostingersite.com
```

---

## 🔐 Secrets - Not Exposed

✅ Backend secrets stay in .env on Hostinger backend:
- MONGO_URI
- JWT_SECRET
- Razorpay keys
- Shiprocket credentials
- Email password
- WhatsApp token

✅ Frontend doesn't hardcode API URL:
- Uses `REACT_APP_API_URL` environment variable
- Falls back to Hostinger backend URL
- No secrets in frontend code

---

## 📂 Repo Structure After Build

```
kesvi-spices/
├── package.json              (root - has build script)
├── index.js                  (backend entry)
├── client/
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── build/                (output of npm run build)
├── scripts/
│   └── build-client.js       (NEW - build orchestrator)
├── build/                    (CREATED by npm run build - this is what Hostinger serves)
│   ├── index.html
│   ├── static/
│   │   ├── js/
│   │   └── css/
│   └── ...
├── routes/
├── models/
├── middleware/
└── data/
```

---

## ✨ Key Points

| Aspect | Before | After |
|--------|--------|-------|
| Root package.json | No build script | Has `"build": "node scripts/build-client.js"` |
| Build script | None | `scripts/build-client.js` (cross-platform) |
| Frontend output | Loose in client/build | Copied to root/build for Hostinger |
| Backend start | Works (`npm start`) | Still works (`npm start`) |
| API URLs | Hardcoded Cloud Run URLs | Uses `REACT_APP_API_URL` env or Hostinger fallback |
| Secrets | N/A | Not exposed in frontend |

---

## 🚀 Deployment Checklist

- [ ] Commit changes: `git add . && git commit -m "..."`
- [ ] Push to Git: `git push`
- [ ] Test locally: `npm run build`
- [ ] Verify `root/build/index.html` exists
- [ ] Test backend: `npm start`
- [ ] Check Hostinger dashboard - build should start automatically
- [ ] Wait for Hostinger build to complete
- [ ] Visit frontend URL and test API calls
- [ ] Verify no CORS errors in browser console
- [ ] Test login, cart, checkout, admin dashboard

---

## 🔧 Troubleshooting

### Build fails: "Cannot find module 'react-scripts'"
- Script already runs `npm install` in client/
- Check client/package.json has react-scripts dependency

### Build fails: "npm: command not found"
- Hostinger needs Node.js and npm installed
- Contact Hostinger support to enable Node.js

### Build output missing at root/build
- Check script actually ran on Hostinger (check build logs)
- Verify client/package.json has "build" script
- Try running locally: `npm run build`

### Frontend shows old data
- Clear browser cache
- Check Network tab - API calls should go to Hostinger backend
- Verify REACT_APP_API_URL is not set to old URL

---

## 📞 Summary

**Root package.json scripts:**
- `npm start` → Backend (node index.js)
- `npm dev` → Backend with nodemon
- `npm run build` → Frontend build → copies to root/build

**Build script:** `scripts/build-client.js`

**Frontend API:** Uses Hostinger backend (`https://wheat-chough-880353.hostingersite.com/api`)

**Backend:** Still at Hostinger backend domain

**Secrets:** Protected (not in frontend code)

---

Generated: May 20, 2026
