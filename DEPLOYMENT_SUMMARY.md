# Hostinger Deployment Configuration Summary

## ✅ DEPLOYMENT SETUP COMPLETE

Backend: https://wheat-chough-880353.hostingersite.com
Frontend: https://darkseagreen-lemur-822131.hostingersite.com

---

## 📋 FILES CHANGED

### Frontend Files Updated (11 files)

1. **client/src/config/api.js** [CREATED]
   - Centralized API configuration
   - Exports `API_BASE_URL` from environment or defaults to Hostinger backend
   - Location: Uses `process.env.REACT_APP_API_URL`

2. **client/src/App.js**
   - Updated: `axios.defaults.baseURL = API_BASE_URL`
   - Removed hardcoded Cloud Run URL
   - Imports from `./config/api`

3. **client/src/context/AuthContext.js**
   - Updated: `export const BASE_URL = API_BASE_URL`
   - Imports from `../config/api`
   - Auth token still uses localStorage key: `parosa_token`

4. **client/src/context/CartContext.js**
   - Updated: Imports `API_BASE_URL` and uses for all cart API calls
   - All `/api/cart/*` endpoints now use centralized config

5. **client/src/lib/cartUtils.js**
   - Updated: `fetch('${API_BASE_URL}/cart/add', ...)`
   - Removed hardcoded Cloud Run URL

6. **client/src/pages/Login.jsx**
   - Updated: `const BASE_URL = API_BASE_URL`
   - Imports from `../config/api`
   - Auth endpoints: `/auth/send-mobile-otp`, `/auth/verify-mobile-otp`, etc.

7. **client/src/pages/AdminDashboard.jsx**
   - Updated: `const BASE_URL = API_BASE_URL`
   - Imports from `../config/api`
   - All admin API calls use centralized config
   - Auth header: `Authorization: Bearer ${token}`

8. **client/src/pages/OrderHistory.jsx**
   - Updated: `const BASE_URL = API_BASE_URL`
   - Imports from `../config/api`
   - Fetch orders from `/api/orders/myorders`

9. **client/src/pages/StoreFinder.jsx**
   - Updated: `const BASE_URL = API_BASE_URL`
   - Imports from `../config/api`
   - Fetch stores and cities from `/api/stores`

10. **client/src/pages/organic.jsx**
    - Updated: `const BASE_URL = API_BASE_URL`
    - Imports from `../config/api`
    - Membership requests API calls updated

11. **client/src/pages/ProductDetails.jsx**
    - Updated: Uses `${API_BASE_URL}/products/${slug}`
    - Imports from `../config/api`
    - Removed hardcoded Cloud Run URL

12. **client/.env.example** [CREATED]
    - Shows how to configure REACT_APP_API_URL
    - Default: `https://wheat-chough-880353.hostingersite.com/api`
    - Local dev: `http://localhost:8080/api`

### Backend Files Updated (1 file)

1. **index.js**
   - **CORS Origins Updated**: Added Hostinger frontend URL
     ```
     'https://darkseagreen-lemur-822131.hostingersite.com'
     'https://parosa.co.in'
     'https://www.parosa.co.in'
     'http://localhost:3000'
     'http://localhost:5173'
     ```
   
   - **Health Routes Added**:
     ```
     GET /           -> JSON response with success status
     GET /api/health -> JSON response with success status
     ```
   
   - **Port Configuration**: Already correct
     ```
     const PORT = process.env.PORT || 8080;
     app.listen(PORT, '0.0.0.0', ...)
     ```

---

## 🔐 SECURITY - UNCHANGED

✅ Auth tokens still stored in localStorage:
- `parosa_token` - JWT token
- `parosa_user` - User object

✅ Authorization still works:
- Header: `Authorization: Bearer ${parosa_token}`
- Used in AdminDashboard, OrderHistory, Checkout (if needed)

✅ No secrets exposed in code:
- MONGO_URI, JWT_SECRET, Razorpay keys, etc. remain in backend .env

✅ Credentials handling:
- `axios.defaults.withCredentials = false` (uses JWT, not cookies)

---

## 🗑️ OLD REFERENCES REMOVED

❌ Removed all instances of:
```
https://parosa-755646660410.asia-south2.run.app
```

✅ Verification: Grep search shows 0 matches in client/src/

---

## 📝 API ENDPOINTS - UNCHANGED

All backend routes remain the same:
- `/api/auth/*` - Authentication
- `/api/products/*` - Products & browsing
- `/api/cart/*` - Cart operations
- `/api/orders/*` - Orders & history
- `/api/payment/*` - Razorpay integration
- `/api/shipping/*` - Shiprocket integration
- `/api/stores/*` - Store finder
- `/api/membership-requests/*` - Organic membership requests

---

## 🧪 TESTING CHECKLIST

### Backend Health
- [ ] `https://wheat-chough-880353.hostingersite.com/` → Returns JSON success message
- [ ] `https://wheat-chough-880353.hostingersite.com/api/health` → Returns JSON success message
- [ ] Check CORS headers allow `https://darkseagreen-lemur-822131.hostingersite.com`

### Frontend Basics
- [ ] Open frontend: `https://darkseagreen-lemur-822131.hostingersite.com`
- [ ] Products load from API (check Network tab - calls should go to wheat-chough backend)
- [ ] No CORS errors in console

### Authentication
- [ ] Login page loads
- [ ] Email OTP sends successfully
- [ ] Mobile/WhatsApp OTP sends successfully
- [ ] Login success → redirects to home
- [ ] User stored in localStorage: `parosa_user` and `parosa_token`

### Cart & Checkout
- [ ] Add product to cart → stored in backend
- [ ] View cart → items load from API
- [ ] Checkout page loads → calculates shipping correctly
- [ ] Coupon validation works
- [ ] Razorpay payment flow starts

### Admin Dashboard
- [ ] Admin login → redirects to dashboard
- [ ] Authorization header sent correctly: `Authorization: Bearer ${token}`
- [ ] Orders list loads
- [ ] Products list loads
- [ ] Membership requests load
- [ ] Can update order status
- [ ] Can modify products

### Order History
- [ ] Logged-in user sees order history
- [ ] Orders fetch from `/api/orders/myorders`
- [ ] Guest tracking works
- [ ] Order status displays correctly

### Store Finder
- [ ] Stores load from API: `/api/stores`
- [ ] Cities load from API: `/api/stores/cities`
- [ ] GPS location works
- [ ] Distance calculation displays

### Organic Atta Page
- [ ] Membership request form works
- [ ] Form submits to `/api/membership-requests`
- [ ] Success message displays

---

## ⚙️ ENVIRONMENT CONFIGURATION

### Frontend (.env file needed in client/)
Create or update `client/.env`:
```
REACT_APP_API_URL=https://wheat-chough-880353.hostingersite.com/api
```

### Backend (existing .env)
Ensure these are set on Hostinger:
```
PORT=8080
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
SHIPROCKET_EMAIL=your_shiprocket_email
SHIPROCKET_PASSWORD=your_shiprocket_password
SHIPROCKET_API_TOKEN=your_shiprocket_token
MEMBERSHIP_TOTAL_SLOTS=100
```

---

## 🚀 DEPLOYMENT STEPS

### Frontend Build & Deploy
```bash
cd client
npm install
npm run build
# Upload build/ folder to Hostinger frontend hosting
```

### Backend Deploy
```bash
# Hostinger backend already configured
# Ensure .env variables are set in Hostinger dashboard
# Restart server if needed
```

---

## 💡 KEY POINTS

1. **Centralized Config**: All API calls use `API_BASE_URL` from `client/src/config/api.js`
2. **Environment-based**: Use `REACT_APP_API_URL` env variable to override default
3. **No Hardcoding**: All references to old Cloud Run URL removed
4. **Auth Preserved**: Token storage and authorization headers unchanged
5. **CORS Updated**: Backend allows Hostinger frontend origin
6. **Health Routes**: Added `/` and `/api/health` for monitoring
7. **Port Flexible**: Backend PORT uses environment variable with 8080 default

---

## ✨ NEXT STEPS

1. Verify Hostinger backend is running and accessible
2. Verify MongoDB connection on Hostinger
3. Build and deploy frontend
4. Run through testing checklist
5. Monitor error logs in browser console and Hostinger dashboard

---

Generated: May 20, 2026
