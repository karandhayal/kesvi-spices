# Admin Seed Endpoint Guide

## Endpoint Details

**URL:** `POST /api/admin/seed/basic-data`

**Protection:** Requires admin authentication (JWT token + admin role)

**Purpose:** Seeds Products, Stores, and Cities data from JSON files without touching Users, Orders, Carts, or MembershipRequests.

---

## Authentication Requirements

The endpoint requires:
1. Valid JWT token in Authorization header
2. User must have `role === "admin"` or `isAdmin === true`

Token format:
```
Authorization: Bearer <your_jwt_token>
```

---

## Getting an Admin Token

### Step 1: Create an admin user (one-time setup)

Option A: Directly in MySQL (if you have access):
```sql
INSERT INTO Users (name, email, phone, password, isAdmin, role, createdAt, updatedAt)
VALUES (
  'Admin User',
  'admin@example.com',
  '+91-XXXXXXXXXX',
  '$2a$10/...', -- bcryptjs hash of your password
  true,
  'admin',
  NOW(),
  NOW()
);
```

Option B: Use login endpoint to create admin (if you can modify user role afterward):
1. Create a regular user via `/api/auth/login-email` or `/api/auth/register`
2. Manually set `isAdmin = true` and `role = 'admin'` in the database
3. Login to get the token

### Step 2: Login to get JWT token

**Endpoint:** `POST /api/auth/login-email`

**Request:**
```bash
curl -X POST http://localhost:8080/api/auth/login-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_password"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "isAdmin": true,
    "role": "admin"
  }
}
```

Save the `token` value.

---

## Using the Seed Endpoint

### Option 1: cURL (Command Line)

```bash
curl -X POST http://localhost:8080/api/admin/seed/basic-data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{}'
```

**Example with real token:**
```bash
curl -X POST http://localhost:8080/api/admin/seed/basic-data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{}'
```

### Option 2: Postman

1. **Create new request**
   - Method: `POST`
   - URL: `http://localhost:8080/api/admin/seed/basic-data` (or your Hostinger backend URL)

2. **Set Headers**
   - Key: `Content-Type` → Value: `application/json`
   - Key: `Authorization` → Value: `Bearer YOUR_JWT_TOKEN_HERE`

3. **Body**
   - Select "raw"
   - Paste: `{}`
   - Click Send

4. **Expected Response**
```json
{
  "success": true,
  "message": "Basic data seeded successfully",
  "counts": {
    "products": 35,
    "stores": 4,
    "cities": 3,
    "total": 42
  }
}
```

### Option 3: JavaScript/Fetch

```javascript
const token = 'YOUR_JWT_TOKEN_HERE';

fetch('http://localhost:8080/api/admin/seed/basic-data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({})
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    console.log('✓ Seeded:', data.counts);
  } else {
    console.error('✗ Error:', data.message);
  }
});
```

---

## Success Response

```json
{
  "success": true,
  "message": "Basic data seeded successfully",
  "counts": {
    "products": 35,
    "stores": 4,
    "cities": 3,
    "total": 42
  }
}
```

---

## Error Responses

### 401 - Not Authorized (Missing/Invalid Token)
```json
{
  "message": "Not authorized, token missing"
}
```

**Solution:** Include a valid JWT token in the Authorization header.

### 403 - Admin Access Required (Not Admin)
```json
{
  "message": "Admin access required"
}
```

**Solution:** The user must have `role === 'admin'` or `isAdmin === true`.

### 500 - Server Error
```json
{
  "success": false,
  "message": "Error seeding data",
  "error": "..."
}
```

**Solution:** Check server logs for the specific error.

---

## What Gets Seeded

### 1. Products (from data/products.js)
- Name, slug, category, description, price, variants, etc.
- Avoids duplicates using slug

### 2. Cities (from data/cityData.js)
- Name, state, coordinates, Google Maps URL
- Avoids duplicates using city name

### 3. Stores (from data/storeData.js)
- Name, address, city, state, phone, timings, coordinates
- Avoids duplicates using store name

### What Does NOT Get Touched
- ❌ Users
- ❌ Orders
- ❌ Carts
- ❌ MembershipRequests
- ❌ Any other existing data

---

## Testing Locally

### Step 1: Start backend
```bash
npm install
npm start
```

### Step 2: Login as admin and get token
```bash
curl -X POST http://localhost:8080/api/auth/login-email \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}' \
  | jq '.token'
```

Copy the token value.

### Step 3: Call seed endpoint
```bash
curl -X POST http://localhost:8080/api/admin/seed/basic-data \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Step 4: Verify in database
```bash
# Check MySQL
SELECT COUNT(*) FROM Products;
SELECT COUNT(*) FROM Stores;
SELECT COUNT(*) FROM Cities;
```

---

## Testing on Hostinger

### Step 1: Get admin token
```bash
curl -X POST https://wheat-chough-880353.hostingersite.com/api/auth/login-email \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}'
```

Copy the token.

### Step 2: Call seed endpoint
```bash
curl -X POST https://wheat-chough-880353.hostingersite.com/api/admin/seed/basic-data \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Step 3: Verify products load on frontend
- Open https://darkseagreen-lemur-822131.hostingersite.com
- Products should appear in listings

---

## Important Security Notes

- ✅ Endpoint is protected by `protect` and `adminOnly` middleware
- ✅ Requires valid JWT token
- ✅ Only admin users can call it
- ✅ Uses `findOrCreate` to avoid duplicate slugs/names
- ✅ Does not delete or overwrite existing data
- ✅ Does not expose passwords or secrets
- ❌ Do not share your admin token
- ❌ Do not hardcode tokens in code (use environment variables)
- ❌ Do not expose this endpoint to unauthorized users

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Not authorized, token missing" | Include `Authorization: Bearer <token>` header |
| "Admin access required" | User must have `isAdmin = true` in database |
| "token invalid" | Token may have expired; login again to get a new token |
| "0 items seeded" | Data may already exist (uses findOrCreate, so duplicates are skipped) |
| 503 Service Unavailable on Hostinger | Check Hostinger logs; MySQL may not be configured correctly |

---

## For Hostinger Setup

### Once deployed:

1. **Create an admin user** (via phpMyAdmin or SQL):
   ```sql
   INSERT INTO Users (name, email, phone, password, isAdmin, role, createdAt, updatedAt) 
   VALUES ('Admin', 'admin@example.com', '+91-9876543210', 
     '$2a$10$...', true, 'admin', NOW(), NOW());
   ```

2. **Login to get token:**
   ```bash
   curl -X POST https://wheat-chough-880353.hostingersite.com/api/auth/login-email \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@example.com", "password": "your_password"}'
   ```

3. **Call seed endpoint:**
   ```bash
   curl -X POST https://wheat-chough-880353.hostingersite.com/api/admin/seed/basic-data \
     -H "Authorization: Bearer <token_from_step_2>" \
     -H "Content-Type: application/json" \
     -d '{}'
   ```

4. **Verify products on frontend:**
   - Open https://darkseagreen-lemur-822131.hostingersite.com
   - Products should appear

---
