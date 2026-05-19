# 🎯 Hostinger Deployment - Quick Reference

## Backend URL
```
https://wheat-chough-880353.hostingersite.com/api
```

## Frontend URL
```
https://darkseagreen-lemur-822131.hostingersite.com
```

---

## Frontend API Configuration

### Option 1: Use Default (Recommended)
No `.env` file needed. Default uses Hostinger backend.

### Option 2: Override with .env
Create `client/.env`:
```
REACT_APP_API_URL=https://your-custom-backend-url/api
```

### Option 3: Local Development
For local dev with localhost backend:
```
REACT_APP_API_URL=http://localhost:8080/api
```

---

## Testing API Endpoints

```bash
# Health check
curl https://wheat-chough-880353.hostingersite.com/
curl https://wheat-chough-880353.hostingersite.com/api/health

# Get products
curl https://wheat-chough-880353.hostingersite.com/api/products

# Get stores
curl https://wheat-chough-880353.hostingersite.com/api/stores

# Get cities
curl https://wheat-chough-880353.hostingersite.com/api/stores/cities
```

---

## Key Files

| File | Purpose |
|------|---------|
| `client/src/config/api.js` | Centralized API config (new) |
| `client/src/App.js` | Sets axios default baseURL |
| `client/src/context/AuthContext.js` | Auth with BASE_URL |
| `client/src/context/CartContext.js` | Cart operations |
| `index.js` | Backend CORS & health routes |
| `client/.env.example` | Environment config template |

---

## Authentication Flow

1. User logs in at `/login`
2. Token stored in localStorage: `parosa_token`
3. Authorization header: `Authorization: Bearer ${token}`
4. AdminDashboard checks: `Authorization: Bearer ${token}`

**Token key names remain unchanged:**
- `parosa_token` - JWT token
- `parosa_user` - User object
- `userId` - User ID

---

## Business Logic - No Changes

✅ All maintained:
- User registration & email OTP
- Mobile/WhatsApp OTP authentication
- Product browsing with variants
- Cart add/remove/update
- Order creation & tracking
- Razorpay payment integration
- Shiprocket shipping integration
- Admin dashboard operations
- Organic membership requests
- Store finder with GPS
- Coupon validation

---

## Environment Variables Needed on Hostinger Backend

```
PORT=8080
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
RAZORPAY_KEY_ID=<your_razorpay_key>
RAZORPAY_KEY_SECRET=<your_razorpay_secret>
SHIPROCKET_EMAIL=<your_shiprocket_email>
SHIPROCKET_PASSWORD=<your_shiprocket_password>
SHIPROCKET_API_TOKEN=<your_shiprocket_token>
MEMBERSHIP_TOTAL_SLOTS=100
```

---

## Troubleshooting

### CORS Error
- Check allowed origins in `index.js`
- Frontend URL must be in `allowedOrigins` array

### API Not Found (404)
- Check backend is running: `https://wheat-chough-880353.hostingersite.com/api/health`
- Verify endpoint path is correct

### Auth Failing
- Check `parosa_token` exists in localStorage
- Verify token in Authorization header

### Cart Empty
- Check localStorage for `userId` or `parosa_user_id`
- Verify API_BASE_URL is correct

---

## Quick Build & Deploy

```bash
# Frontend
cd client
npm install
npm run build
# Upload build/ to Hostinger

# Backend
# Ensure .env is set on Hostinger
# Server starts automatically
```

---

**All old Cloud Run URLs removed ✅**
**All new URLs point to Hostinger ✅**
**Auth & business logic unchanged ✅**
