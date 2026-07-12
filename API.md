# API.md — Ecommerce Forever API Reference

> **Date:** 2026-07-12
> **Base URL:** `http://localhost:4000` (from `VITE_BACKEND_URL`)
> **Total endpoints:** 24

---

## Base Configuration

**Global middleware** (applied to every request, in order):
1. `express.json()` — parses JSON bodies
2. `cookieParser()` — parses cookies
3. `cors({ origin, credentials: true })` — credentialed CORS

**Route prefixes:**
| Prefix | Router |
|--------|--------|
| `/api/user` | `userRoute.js` |
| `/api/product` | `productRoute.js` |
| `/api/cart` | `cartRoute.js` |
| `/api/order` | `orderRoute.js` |

---

## Auth Token Architecture

### User Access Token
- **Payload:** `{ id: ObjectId, role: "user"|"admin" }`
- **Signed with:** `JWT_ACCESS_SECRET`
- **Lifetime:** 15 minutes
- **Sent via:** Response body as `accessToken`
- **Sent to backend as:** `Authorization: Bearer <token>` header

### User Refresh Token
- **Payload:** `{ id: ObjectId }`
- **Signed with:** `JWT_REFRESH_SECRET`
- **Lifetime:** 7 days
- **Sent via:** httpOnly cookie named `refreshToken`
- **Cookie flags:** `httpOnly: true`, `secure: production`, `sameSite: strict`

### Admin Token
- **Payload:** Literal string `ADMIN_EMAIL + ADMIN_PASSWORD` (concatenation)
- **Signed with:** `JWT_SECRET`
- **Lifetime:** None (never expires)
- **Sent via:** Response body as `token`
- **Sent to backend as:** Custom `token` header (NOT `Authorization: Bearer`)

> **Note:** The frontend and admin use completely separate auth systems with different headers, secrets, and token structures.

---

## Auth Header Formats

| Client | Header format | Middleware |
|--------|--------------|------------|
| Frontend (user) | `Authorization: Bearer <jwt>` | `authUser` |
| Admin panel | `token: <jwt>` | `adminAuth` |

---

## User Endpoints (`/api/user`)

### POST `/api/user/refresh-token`
Renew an expired access token using the refresh token cookie.

| | |
|---|---|
| **Auth** | None (reads `refreshToken` cookie) |
| **Body** | None |
| **Cookie** | `refreshToken` (httpOnly) |

**Success (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbG...",
  "user": { "id": "...", "firstName": "...", "lastName": "...", "email": "...", "role": "user" }
}
```

**Errors:**
- `401` — No refresh token
- `401` — User not found
- `401` — Invalid refresh token

---

### POST `/api/user/login`
Authenticate a user with email and password.

| | |
|---|---|
| **Auth** | None |
| **Body** | `email` (string, required), `password` (string, required) |

**Success (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbG...",
  "user": { "id": "...", "firstName": "...", "lastName": "...", "email": "...", "role": "user" }
}
```
Sets `refreshToken` httpOnly cookie.

**Errors:**
- `400` — Missing email or password
- `400` — Invalid email format
- `401` — Invalid credentials
- `403` — Email not verified (`errorType: "EMAIL_NOT_VERIFIED"`)
- `500` — Internal server error

---

### POST `/api/user/register`
Create a new user account. Sends a verification email.

| | |
|---|---|
| **Auth** | None |
| **Body** | `firstName` (string, required), `lastName` (string, optional), `email` (string, required), `password` (string, required, min 8 chars) |

**Success (201):**
```json
{ "success": true, "message": "Registration successful, please check your email to verify your account" }
```

**Errors:**
- `400` — Missing required fields
- `400` — Invalid email format
- `400` — Password too short
- `403` — Email registered but not verified (`errorType: "EMAIL_NOT_VERIFIED"`)
- `409` — Email already registered (and verified)
- `502` — Verification email failed to send
- `500` — Internal server error

---

### GET `/api/user/verify-email`
Verify email address via token from email link. Auto-logs in the user.

| | |
|---|---|
| **Auth** | None |
| **Query** | `token` (string, required) |

**Success (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbG...",
  "message": "Email verified successfully",
  "user": { "id": "...", "firstName": "...", "lastName": "...", "email": "...", "role": "user" }
}
```
Sets `refreshToken` httpOnly cookie.

**Errors:**
- `400` — Invalid or expired verification link
- `500` — Internal server error

---

### POST `/api/user/resend-verification-email`
Resend the email verification link.

| | |
|---|---|
| **Auth** | None |
| **Body** | `token` (string, optional) OR `email` (string, optional) — at least one required |

**Success (200):**
```json
{ "success": true, "message": "Verification email has been resent, please check your email" }
```

**Errors:**
- `400` — Neither token nor email provided
- `400` — Account not found
- `400` — Email already verified
- `502` — Email failed to send
- `500` — Internal server error

---

### POST `/api/user/forgot-password`
Request a password reset email.

| | |
|---|---|
| **Auth** | None |
| **Body** | `email` (string, required) |

**Success (200):**
```json
{ "success": true, "message": "Reset link has been sent successfully" }
```

**Errors:**
- `400` — Email is required (**note:** backend typo returns `messsage` key with 3 s's)
- `400` — Invalid email format
- `400` — Email not found
- `502` — Reset email failed to send
- `500` — Internal server error

---

### PATCH `/api/user/reset-password`
Reset password using the token from the email link.

| | |
|---|---|
| **Auth** | None |
| **Body** | `token` (string, required), `password` (string, required, min 8 chars), `passwordConfirmation` (string, required) |

**Success (200):**
```json
{ "success": true, "message": "Password reset successfully, please login with your new password" }
```

**Errors:**
- `400` — Token is required
- `400` — Password and confirmation are required
- `400` — Password too short
- `400` — Passwords do not match
- `400` — Invalid or expired reset link
- `500` — Internal server error

---

### POST `/api/user/logout`
Log out the user. Clears the refresh token cookie.

| | |
|---|---|
| **Auth** | `authUser` |
| **Headers** | `Authorization: Bearer <accessToken>` |

**Success (200):**
```json
{ "success": true, "message": "Logged out successfully" }
```
Clears `refreshToken` cookie.

**Errors:**
- `401` — No token provided
- `401` — Invalid or expired token

---

### POST `/api/user/admin`
Admin login. Returns a JWT token.

| | |
|---|---|
| **Auth** | None |
| **Body** | `email` (string, required), `password` (string, required) |

**Success (200):**
```json
{ "success": true, "token": "eyJhbG..." }
```

**Errors:**
- `200` — Invalid Credentials (**note:** returns HTTP 200, not 401)

---

## Product Endpoints (`/api/product`)

### GET `/api/product/list`
List all products. Public, no auth required.

| | |
|---|---|
| **Auth** | None |

**Success (200):**
```json
{
  "success": true,
  "products": [
    {
      "_id": "...",
      "name": "T-Shirt",
      "description": "...",
      "price": "29.99",
      "image": ["https://cloudinary..."],
      "category": "Men",
      "subCategory": "Topwear",
      "sizes": ["S", "M", "L"],
      "bestseller": true,
      "date": 1688888888888
    }
  ]
}
```

**Note:** Returns ALL products. No pagination.

---

### POST `/api/product/single`
Get a single product by ID.

| | |
|---|---|
| **Auth** | None |
| **Body** | `productId` (string, required) — MongoDB ObjectId |

**Success (200):**
```json
{ "success": true, "product": { ...product object... } }
```

**Errors:**
- `200` — Error message (returns `null` product if not found)

---

### POST `/api/product/add` *(Admin)*
Add a new product with images.

| | |
|---|---|
| **Auth** | `adminAuth` |
| **Headers** | `token: <adminJwt>` |
| **Content-Type** | `multipart/form-data` |

**Body fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | yes | |
| `description` | string | yes | |
| `price` | string | yes | Converted to Number server-side |
| `category` | string | yes | `"Men"`, `"Women"`, or `"Kids"` |
| `subCategory` | string | yes | `"Topwear"`, `"Bottomwear"`, or `"Winterwear"` |
| `sizes` | string | yes | JSON array, e.g. `'["S","M","L"]'` |
| `bestseller` | string | yes | `"true"` or `"false"` |
| `image1`–`image4` | file | no | Up to 4 image files |

**Success (200):**
```json
{ "success": true, "message": "Product Added" }
```

**Errors:**
- `200` — Not Authorized (admin auth failed)
- `200` — Error message

**⚠ Known mismatch:** Admin sends field name `bestseller` (lowercase), but backend destructures `bestSeller` (camelCase). Bestseller is always saved as `false`.

---

### POST `/api/product/remove` *(Admin)*
Delete a product by ID.

| | |
|---|---|
| **Auth** | `adminAuth` |
| **Headers** | `token: <adminJwt>` |
| **Body** | `id` (string, required) — product MongoDB ObjectId |

**Success (200):**
```json
{ "success": true, "message": "Product Removed" }
```

**Note:** Returns success even if the product ID doesn't exist.

---

## Cart Endpoints (`/api/cart`)

### GET `/api/cart/get`
Get the authenticated user's cart.

| | |
|---|---|
| **Auth** | `authUser` |
| **Headers** | `Authorization: Bearer <accessToken>` |

**Success (200):**
```json
{
  "success": true,
  "cartData": {
    "<productId>": { "<size>": <quantity> },
    "<productId>": { "<size>": <quantity>, "<size2>": <quantity> }
  }
}
```

**Cart structure:** `{ [productId]: { [size]: quantity } }`

---

### POST `/api/cart/add`
Add an item to the cart (increments quantity by 1).

| | |
|---|---|
| **Auth** | `authUser` |
| **Headers** | `Authorization: Bearer <accessToken>` |
| **Body** | `itemId` (string, required), `size` (string, required) |

**Success (200):**
```json
{ "success": true, "message": "Added To Cart" }
```

**Cart mutation:**
```
if cartData[itemId] exists and cartData[itemId][size] exists:
    cartData[itemId][size] += 1
else:
    cartData[itemId][size] = 1
```

---

### PUT `/api/cart/update`
Set an item's quantity (absolute, not relative).

| | |
|---|---|
| **Auth** | `authUser` |
| **Headers** | `Authorization: Bearer <accessToken>` |
| **Body** | `itemId` (string, required), `size` (string, required), `quantity` (number, required) |

**Success (200):**
```json
{ "success": true, "message": "Cart Updated" }
```

**⚠ Known issue:** No validation that `quantity >= 0` or that `cartData[itemId]` exists.

---

## Order Endpoints (`/api/order`)

### POST `/api/order/place` *(COD)*
Place a Cash on Delivery order.

| | |
|---|---|
| **Auth** | `authUser` |
| **Headers** | `Authorization: Bearer <accessToken>` |
| **Body** | See below |

**Request body:**
```json
{
  "items": [
    { "_id": "...", "name": "...", "price": 29.99, "size": "M", "quantity": 2, "...full product fields" }
  ],
  "amount": 69.98,
  "address": {
    "firstName": "John", "lastName": "Doe", "email": "john@example.com",
    "street": "123 Main St", "city": "New York", "state": "NY",
    "zipcode": "10001", "country": "USA", "phone": "1234567890"
  }
}
```

**⚠ Known issue:** Frontend sends `items`, `amount`, `address` but NOT `userId`. Backend expects `userId` from `req.body` but gets `undefined`. **This endpoint always fails.**

**Expected fix:** Backend should extract `userId` from `req.user.id` instead of `req.body`.

**Success (200):**
```json
{ "success": true, "message": "Order Placed" }
```

**Side effects:** Creates order document, clears user cart.

---

### POST `/api/order/stripe` *(Stripe)*
Place an order via Stripe Checkout.

| | |
|---|---|
| **Auth** | `authUser` |
| **Headers** | `Authorization: Bearer <accessToken>`, `origin` (browser auto-sends) |
| **Body** | Same as `/api/order/place` |

**Success (200):**
```json
{ "success": true, "session_url": "https://checkout.stripe.com/pay/cs_..." }
```

**Side effects:** Creates order document, creates Stripe Checkout session. Does NOT clear cart yet.

---

### POST `/api/order/verifyStripe`
Verify Stripe payment after redirect.

| | |
|---|---|
| **Auth** | `authUser` |
| **Headers** | `Authorization: Bearer <accessToken>` |
| **Body** | `orderId` (string, required), `success` (string, required — `"true"` or `"false"`) |

**⚠ Known issue:** `success` is compared as string `"true"`, not boolean. Client trusts `success` from URL param — no server-side Stripe verification.

**Success (200):**
```json
{ "success": true }
```

**Side effects:**
- If `success === "true"`: sets `payment: true`, clears user cart
- If `success === "false"`: **deletes the order**

---

### POST `/api/order/razorpay` *(Razorpay)*
Place an order via Razorpay.

| | |
|---|---|
| **Auth** | `authUser` |
| **Headers** | `Authorization: Bearer <accessToken>` |
| **Body** | Same as `/api/order/place` |

**Success (200):**
```json
{
  "success": true,
  "order": {
    "id": "order_...",
    "amount": 6998,
    "currency": "USD",
    "receipt": "<mongoOrderId>"
  }
}
```

**Side effects:** Creates order document, creates Razorpay order. Does NOT clear cart yet.

---

### POST `/api/order/verifyRazorpay`
Verify Razorpay payment.

| | |
|---|---|
| **Auth** | `authUser` |
| **Headers** | `Authorization: Bearer <accessToken>` |
| **Body** | `razorpay_order_id` (string, required) — also accepts `razorpay_payment_id`, `razorpay_signature` but they're not used |

**Success (200):**
```json
{ "success": true, "message": "Payment Successful" }
```

**Errors:**
- `200` — `{ "success": false, "message": "Payment Failed" }`

**Side effects:** If Razorpay order status is `"paid"`, sets `payment: true` on internal order, clears user cart.

**⚠ Known issue:** No Razorpay signature verification. Client can mark any order as paid by providing its order ID.

---

### POST `/api/order/userorders`
Get all orders for the authenticated user.

| | |
|---|---|
| **Auth** | `authUser` |
| **Headers** | `Authorization: Bearer <accessToken>` |
| **Body** | None |

**Success (200):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "...",
      "userId": "...",
      "items": [...],
      "amount": 69.98,
      "address": { ... },
      "status": "Order Placed",
      "paymentMethod": "COD",
      "payment": false,
      "date": 1688888888888
    }
  ]
}
```

---

### POST `/api/order/list` *(Admin)*
Get all orders (admin).

| | |
|---|---|
| **Auth** | `adminAuth` |
| **Headers** | `token: <adminJwt>` |
| **Body** | None |

**Success (200):**
```json
{ "success": true, "orders": [...all orders...] }
```

**Note:** Returns ALL orders. No pagination.

---

### POST `/api/order/status` *(Admin)*
Update an order's status.

| | |
|---|---|
| **Auth** | `adminAuth` |
| **Headers** | `token: <adminJwt>` |
| **Body** | `orderId` (string, required), `status` (string, required) |

**Valid status values:** `"Order Placed"`, `"Packing"`, `"Shipped"`, `"Out for Delivery"`, `"Delivered"` (enforced by admin UI dropdown, not backend validation)

**Success (200):**
```json
{ "success": true, "message": "Status Updated" }
```

**⚠ Known issue:** Backend accepts ANY string for `status` — no enum validation.

---

## Database Schemas

### User (`userModel.js`)
```
firstName    String  required, trim, max 50
lastName     String  trim, max 50
email        String  required, unique, lowercase, trim, max 100
password     String  required, min 8
phone        String  trim, max 20
role         String  enum ['user', 'admin'], default 'user'
isVerified   Boolean default false
address      Object  { street, city, state, country, zipcode }
cartData     Object  default {} — structure: { [productId]: { [size]: quantity } }
verifyToken          String
verifyTokenExpiry    Date
resetPasswordToken         String
resetPasswordTokenExpiry   Date
timestamps   true (auto createdAt, updatedAt)
```

### Product (`productModel.js`)
```
name         String  required
description  String  required
price        String  required     ⚠ stored as String, not Number
image        Array   required     (Cloudinary URLs)
category     String  required     "Men" | "Women" | "Kids"
subCategory  String  required     "Topwear" | "Bottomwear" | "Winterwear"
sizes        Array   required     ["S", "M", "L", "XL", "XXL"]
bestseller   Boolean              ⚠ lowercase in schema, camelCase in controller
date         Number  required     (Unix timestamp)
```

### Order (`orderModel.js`)
```
userId        String  required    ⚠ stored as String, not ObjectId ref
items         Array   required    (full product objects with size + quantity)
amount        Number  required
address       Object  required    { street, city, state, country, zipcode }
status        String  required    default "Order Placed"
paymentMethod String  required    "COD" | "Stripe" | "Razorpay"
payment       Boolean required    default false
date          Number  required    (Unix timestamp)
```

---

## Complete Endpoint Summary

| # | Method | Path | Auth | Body | Key Response |
|---|--------|------|------|------|-------------|
| 1 | POST | `/api/user/refresh-token` | cookie | — | `accessToken`, `user` |
| 2 | POST | `/api/user/login` | — | `email`, `password` | `accessToken`, `user` + cookie |
| 3 | POST | `/api/user/register` | — | `firstName`, `lastName`, `email`, `password` | `message` |
| 4 | GET | `/api/user/verify-email` | — | `?token=` | `accessToken`, `user` + cookie |
| 5 | POST | `/api/user/resend-verification-email` | — | `token` or `email` | `message` |
| 6 | POST | `/api/user/forgot-password` | — | `email` | `message` |
| 7 | PATCH | `/api/user/reset-password` | — | `token`, `password`, `passwordConfirmation` | `message` |
| 8 | POST | `/api/user/logout` | Bearer | — | `message` + clear cookie |
| 9 | POST | `/api/user/admin` | — | `email`, `password` | `token` |
| 10 | GET | `/api/product/list` | — | — | `products[]` |
| 11 | POST | `/api/product/single` | — | `productId` | `product` |
| 12 | POST | `/api/product/add` | admin | FormData (name, desc, price, category, subCategory, sizes, bestseller, images) | `message` |
| 13 | POST | `/api/product/remove` | admin | `id` | `message` |
| 14 | GET | `/api/cart/get` | Bearer | — | `cartData` |
| 15 | POST | `/api/cart/add` | Bearer | `itemId`, `size` | `message` |
| 16 | PUT | `/api/cart/update` | Bearer | `itemId`, `size`, `quantity` | `message` |
| 17 | POST | `/api/order/place` | Bearer | `items[]`, `amount`, `address{}` | `message` |
| 18 | POST | `/api/order/stripe` | Bearer | `items[]`, `amount`, `address{}` | `session_url` |
| 19 | POST | `/api/order/verifyStripe` | Bearer | `orderId`, `success` (string) | `success` |
| 20 | POST | `/api/order/razorpay` | Bearer | `items[]`, `amount`, `address{}` | `order` |
| 21 | POST | `/api/order/verifyRazorpay` | Bearer | `razorpay_order_id` | `message` |
| 22 | POST | `/api/order/userorders` | Bearer | — | `orders[]` |
| 23 | POST | `/api/order/list` | admin | — | `orders[]` |
| 24 | POST | `/api/order/status` | admin | `orderId`, `status` | `message` |

---

## Known Mismatches & Issues

| Issue | Frontend | Backend | Impact |
|-------|----------|---------|--------|
| **Order userId missing** | Sends `items`, `amount`, `address` only | Expects `userId` from `req.body` | **All order placement fails** |
| **Bestseller field casing** | Admin sends `bestseller` (lowercase) | Controller destructures `bestSeller` (camelCase) | **Bestseller always saved as false** |
| **Stripe verify trusts client** | Sends `success: "true"` from URL param | Compares `success === "true"` without server check | **Security: can mark any order paid** |
| **Razorpay verify no signature check** | Sends `razorpay_order_id` | Fetches from Razorpay but no signature verification | **Security: can mark any order paid** |
| **Forgot password typo** | Reads `error.response.data.message` | Returns `messsage` (3 s's) for missing email | **Error message shows undefined** |
| **Admin auth returns 200** | Frontend checks `response.data.success` | All errors return HTTP 200 | **No HTTP status differentiation** |
| **price stored as String** | Frontend treats as number | Schema requires String type | **Comparison bugs possible** |
| **POST for read operations** | Uses `POST /api/product/single`, `POST /api/order/userorders` | Reads data via POST | **REST convention violation** |

---

*End of API reference. All contracts verified against source code.*
