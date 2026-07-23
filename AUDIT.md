# AUDIT.md — Ecommerce Forever Codebase Audit

> **Date:** 2026-07-12
> **Scope:** Full codebase — backend, frontend, admin panel
> **Methodology:** Every claim is backed by a file path. No guessing.

---

## 1. Detected Tech Stack

| Layer              | Technology                   | Version        |
| ------------------ | ---------------------------- | -------------- |
| Frontend framework | React                        | 18.3.1         |
| Frontend routing   | React Router DOM             | 6.26.1         |
| Frontend state     | Zustand                      | 5.0.14         |
| Frontend HTTP      | Axios                        | 1.16.1         |
| Frontend styling   | Tailwind CSS (Vite plugin)   | 4.3.0          |
| Frontend SEO       | react-helmet-async           | —              |
| Frontend icons     | @iconify/react               | —              |
| Frontend build     | Vite                         | 5.3.4          |
| Admin framework    | React                        | 19.2.0         |
| Admin routing      | React Router DOM             | 7.11.0         |
| Admin HTTP         | Axios                        | 1.13.2         |
| Admin styling      | Tailwind CSS (PostCSS)       | 3.4.19         |
| Admin build        | Vite                         | 7.2.4          |
| Backend framework  | Express                      | 5.2.1          |
| Database/ORM       | MongoDB / Mongoose           | 8.20.3         |
| Auth               | jsonwebtoken + bcrypt        | 9.0.3 / 6.0.0  |
| Payments           | Stripe + Razorpay            | 20.1.0 / 2.9.6 |
| File uploads       | Multer + Cloudinary          | 2.0.2 / 2.8.0  |
| Email              | Resend (+ nodemailer unused) | 6.14.0         |
| Language           | JavaScript (ES Modules)      | —              |

---

## 2. Feature Inventory

### Storefront (Customer-Facing)

| Feature                                                           | Status         | Evidence                                                                                                                                                    | Notes                                                                                                                                                                                           |
| ----------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage with featured/new products                               | ✅ Implemented | `frontend/src/pages/Home.jsx`, `frontend/src/components/Hero.jsx`, `frontend/src/components/LatestCollection.jsx`, `frontend/src/components/BestSeller.jsx` | Hero banner + first 10 products (newest) + bestseller products                                                                                                                                  |
| Category browsing (Men / Women / Kids) with subcategories         | ✅ Implemented | `frontend/src/pages/Collection.jsx:16-20`                                                                                                                   | Sidebar filters for category (Men/Women/Kids) and subcategory (Topwear/Bottomwear/Winterwear)                                                                                                   |
| Product listing with pagination/infinite scroll                   | ❌ Missing     | `backend/controllers/productController.js:50` returns all products; frontend `Collection.jsx` has no pagination                                             | `find({})` returns entire collection, rendered all at once                                                                                                                                      |
| Filtering (size, color, price) and sorting                        | ⚠️ Partial     | `frontend/src/pages/Collection.jsx:30-100`, `frontend/src/components/FilterModal.jsx`                                                                       | Category/subcategory/sort-by-price filtering works. **No size or color filtering.** No price range filter. "Newest" sort option exists in UI but has no implementation in the switch statement. |
| Search with results page                                          | ⚠️ Partial     | `frontend/src/components/SearchBar.jsx`, `frontend/src/pages/Collection.jsx:36-39`                                                                          | Search only filters within the Collection page by product name. No dedicated search results page.                                                                                               |
| Product detail page (images, variants, stock status, description) | ⚠️ Partial     | `frontend/src/pages/Product.jsx`                                                                                                                            | Image gallery, size selector, and add-to-cart work. **No stock status.** Description tab shows hardcoded generic text, not the actual product description from the database.                    |
| Related/recommended products                                      | ⚠️ Partial     | `frontend/src/components/RelatedProducts.jsx`                                                                                                               | First `useEffect` (lines 11-20) has a no-op filter bug (filtered result is discarded). Second `useEffect` (lines 23-31) corrects it. Works end-to-end but double-renders wastefully.            |
| Reviews and ratings                                               | ❌ Missing     | `frontend/src/pages/Product.jsx:55-60` hardcodes 4/5 stars with "(122)" reviews                                                                             | No review model, no review API, no review UI. Stars are purely decorative.                                                                                                                      |

### Cart & Checkout

| Feature                                                | Status         | Evidence                                                                                     | Notes                                                                                                                                                                                                      |
| ------------------------------------------------------ | -------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add/remove/update cart items, persists across sessions | ✅ Implemented | `frontend/src/context/ShopContext.jsx:26-66,84-101`, `backend/controllers/cartController.js` | Cart syncs to MongoDB when authenticated. Optimistic updates (no rollback on API failure).                                                                                                                 |
| Guest checkout vs logged-in checkout                   | ❌ Missing     | `frontend/src/pages/PlaceOrder.jsx:81-150`                                                   | No guest checkout. Unauthenticated users cannot reach checkout (no route guard either, but no guest flow).                                                                                                 |
| Address form + validation                              | ⚠️ Partial     | `frontend/src/pages/PlaceOrder.jsx:163-249`                                                  | HTML `required` attribute on all fields. **No format validation** — no phone regex, no zipcode pattern, no email validation on the address form.                                                           |
| Payment integration (real or mocked)                   | ✅ Implemented | `frontend/src/pages/PlaceOrder.jsx:107-146`, `backend/controllers/orderController.js`        | Three methods: Stripe (hosted checkout redirect), Razorpay (in-page modal), COD. All real integrations. **Critical bug:** order fails because `userId` is never sent in the request body (see Weaknesses). |
| Order confirmation + summary                           | ⚠️ Partial     | `frontend/src/pages/PlaceOrder.jsx:113-115`, `frontend/src/pages/Orders.jsx`                 | On COD success, redirects to `/orders` page. No order confirmation page with summary. Stripe redirects to `/verify` then `/orders`.                                                                        |
| Discount/coupon codes                                  | ❌ Missing     | —                                                                                            | No coupon model, no discount logic, no coupon input field anywhere in checkout.                                                                                                                            |

### Account / Auth

| Feature                                   | Status         | Evidence                                                                                                                                             | Notes                                                                                                                                                                                                                                      |
| ----------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Register / login / logout                 | ✅ Implemented | `frontend/src/components/auth/Register.jsx`, `frontend/src/components/auth/Login.jsx`, `frontend/src/zustand/authStore.js`                           | Full flow with email verification, dual JWT tokens (access + refresh), bcrypt hashing.                                                                                                                                                     |
| Password reset flow                       | ✅ Implemented | `frontend/src/components/auth/ForgotPassword.jsx`, `frontend/src/components/auth/ResetPassword.jsx`, `backend/controllers/userController.js:305-432` | Forgot password → email with reset link → reset form with confirmation. 5-minute token expiry.                                                                                                                                             |
| Protected routes (middleware/guards)      | ⚠️ Partial     | `backend/middleware/auth.js`, `frontend/src/routes/routes.jsx`                                                                                       | Backend: `authUser` middleware on all user routes. **Frontend: `/place-order` and `/orders` have NO route-level auth guards.** `AuthLayout` wrapper protects auth pages (login/register/etc) from authenticated users but not the reverse. |
| Profile page (edit info, saved addresses) | ❌ Missing     | —                                                                                                                                                    | No profile page component. No route for profile. No API endpoint to update user profile.                                                                                                                                                   |
| Order history                             | ✅ Implemented | `frontend/src/pages/Orders.jsx`, `backend/controllers/orderController.js:185-194`                                                                    | Fetches user orders, displays items with status, payment method, date. **No empty state** when user has no orders.                                                                                                                         |
| Wishlist / saved items                    | ❌ Missing     | —                                                                                                                                                    | No wishlist model, no API, no UI.                                                                                                                                                                                                          |

### Admin / Backend

| Feature                                | Status         | Evidence                                                                                          | Notes                                                                                                                                                                                                                                       |
| -------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin-only route protection            | ⚠️ Partial     | `backend/middleware/adminAuth.js`                                                                 | Backend has `adminAuth` middleware but uses critically flawed JWT (no expiry, plaintext credentials as payload, weak secret "forever"). **Admin panel App.jsx:16 references undefined `token`/`setToken` — the app will crash at runtime.** |
| Product CRUD (incl. image upload)      | ⚠️ Partial     | `admin/src/pages/Add.jsx`, `admin/src/pages/List.jsx`, `backend/controllers/productController.js` | **Create** ✅ (Add.jsx, up to 4 images via Cloudinary). **Read** ✅ (List.jsx). **Delete** ✅ (List.jsx). **Update** ❌ — no edit product functionality exists.                                                                             |
| Inventory/stock management             | ❌ Missing     | —                                                                                                 | No stock/quantity field on products. No inventory tracking.                                                                                                                                                                                 |
| Order management (view, update status) | ✅ Implemented | `admin/src/pages/Orders.jsx`, `backend/controllers/orderController.js:174-207`                    | View all orders, update status (Order Placed → Packing → Shipped → Out for Delivery → Delivered). No pagination, no confirmation dialog.                                                                                                    |
| Basic sales dashboard                  | ❌ Missing     | —                                                                                                 | No dashboard page. No analytics, charts, or summary statistics.                                                                                                                                                                             |

### Cross-Cutting Quality

| Feature                                          | Status         | Evidence                                                                                                                                                 | Notes                                                                                                                                                                                                                                                                        |
| ------------------------------------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Responsive design (mobile/tablet/desktop)        | ⚠️ Partial     | `frontend/src/components/Navbar.jsx`, `frontend/src/components/FilterModal.jsx`, `frontend/src/pages/Collection.jsx`                                     | Frontend has mobile-first Tailwind with hamburger nav, mobile filter modal, responsive grids. Admin panel has basic responsiveness but sidebar labels hide on mobile.                                                                                                        |
| Loading states / skeletons, error/empty states   | ⚠️ Partial     | `frontend/src/components/Loading.jsx` (spinner/dots), `frontend/src/components/ui/SubmitButton.jsx`                                                      | `Loading` component exists and is reusable. Auth flows use loading states well. **Missing from:** product list, cart page, orders page, product detail page, admin pages. **No empty states** for cart, orders, collection (no results), or search. **No error boundaries.** |
| Client + server form validation                  | ⚠️ Partial     | `frontend/src/components/auth/Login.jsx:20-30`, `backend/controllers/userController.js:52-82`                                                            | Auth forms have email regex + password length validation (client) and full validation (server). **Address form has only HTML `required`.** Product add form has no validation. No validation library used (no zod, yup, or react-hook-form).                                 |
| SEO basics (meta tags, sitemap, semantic HTML)   | ⚠️ Partial     | `frontend/src/components/SEO.jsx`, `frontend/src/routes/routes.jsx`, `frontend/src/constant/index.js`                                                    | `react-helmet-async` sets title + meta description per route. **Bug:** parameterized routes (Product page) get `undefined` title because `location.pathname` won't match the route pattern. No sitemap.xml. No structured data.                                              |
| Accessibility (alt text, keyboard nav, contrast) | ❌ Poor        | `frontend/src/components/Hero.jsx`, `frontend/src/components/ProductItem.jsx`, `frontend/src/components/OurPolicy.jsx`, `frontend/src/pages/Product.jsx` | Images have empty `alt=""` throughout. No `aria-label` on icon-only buttons (search, user, hamburger, delete). No keyboard focus management in modals. No skip-to-content link.                                                                                              |
| Image optimization / lazy loading                | ❌ Missing     | `frontend/src/components/ProductItem.jsx:14`                                                                                                             | Images load eagerly. No lazy loading (`loading="lazy"`). No responsive `srcset`. No blur-up placeholders. Cloudinary URLs could use transformations but none are applied.                                                                                                    |
| Automated tests                                  | ❌ Missing     | `frontend/package.json`, `backend/package.json`, `admin/package.json`                                                                                    | No test framework installed (no jest, vitest, mocha, testing-library, cypress, playwright). No test files exist anywhere.                                                                                                                                                    |
| Secrets in env vars, not hardcoded               | ⚠️ Partial     | `backend/.env`, `frontend/.env`, `admin/.env`                                                                                                            | All secrets are in `.env` files (good). **However:** frontend `.env` contains a real Razorpay test API key (`rzp_test_us_Syhcj1No8nDLae`). Admin `.env` is not gitignored. Backend `JWT_SECRET` is the literal string `"forever"`.                                           |
| README with setup instructions                   | ✅ Implemented | `README.md`                                                                                                                                              | Describes project structure, tech stack, env vars for all 3 apps. Adequate for setup.                                                                                                                                                                                        |

---

## 3. Weaknesses & Issues

### Critical (blocks core functionality or security)

- **`admin/src/App.jsx:16-17`** — `token` and `setToken` are referenced but **never declared**. The admin panel will crash with `ReferenceError: token is not defined` on every load. This is a runtime blocker.

- **`frontend/src/pages/PlaceOrder.jsx:101-105`** — The `orderData` object does not include `userId`. The backend controller (`orderController.js:20`) expects `userId` from `req.body` but receives `undefined`. **Every order placement attempt fails** with Mongoose validation error "Path `userId` is required."

- **`backend/controllers/orderController.js:102-106`** — `verifyStripe` trusts `req.body.success === "true"` from the client to mark an order as paid. No server-side Stripe session verification (e.g., checking `session.payment_status` via the Stripe API). **An attacker can mark any order as paid without paying.**

- **`backend/middleware/adminAuth.js` + `userController.js:448-461`** — Admin JWT payload is literally the plaintext concatenation of `ADMIN_EMAIL + ADMIN_PASSWORD`. The JWT secret is the string `"forever"`. Admin tokens have **no expiry**. Anyone who guesses the secret can forge an admin token.

- **`backend/routes/userRoute.js`** — No rate limiting on login (`/login`), register (`/register`), forgot-password (`/forgot-password`), or resend-verification (`/resend-verification-email`). **Vulnerable to brute-force and email bombing attacks.**

- **`backend/controllers/orderController.js:47` + `frontend/src/pages/PlaceOrder.jsx:122`** — Stripe order placement does not include `userId` either (same bug as COD). The `origin` header is read for redirect URLs, but `userId` comes from `req.body` which is empty. Stripe orders will also fail to save.

### High (security gaps or broken functionality)

- **`frontend/src/routes/routes.jsx`** — `/place-order` and `/orders` have **no route-level auth protection**. Unauthenticated users can navigate directly to these URLs (they'll see empty/error states, but there's no redirect).

- **`backend/middleware/multer.js`** — No file size limits or file type filtering on uploads. Attackers can upload arbitrarily large files or malicious file types (e.g., `.html` for XSS, `.exe` for malware).

- **`backend/controllers/userController.js:4`** — `import crypto from 'crypto'` may resolve to the deprecated npm `crypto` package (v1.0.1) instead of the Node.js built-in `node:crypto`.

- **`backend/controllers/userController.js:434-445`** — `logoutUser` clears the refresh token cookie but does NOT invalidate the refresh token server-side. The token remains valid for 7 days.

- **`admin/src/App.jsx` + `admin/src/components/Login.jsx:18`** — Admin token stored only in React component state. **Page refresh loses the token** and logs the admin out. No `localStorage` persistence.

- **`frontend/src/zustand/authStore.js:35`** — `register` calls `toast.success(response.data.message)` even when `response.data.success` is `false`. Users get a false success toast on registration failure.

- **`admin/.gitignore`** — `.env` is NOT listed in gitignore (only `*.local` is). The admin `.env` file is tracked in version control.

- **`backend/models/userModel.js`** — Sensitive fields (`password`, `verifyToken`, `resetPasswordToken`) have no `select: false`. They are returned in every query by default.

- **`backend/server.js`** — No `helmet` middleware for security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, etc.). No global error handler middleware.

### Medium (functional bugs or quality issues)

- **`admin/src/pages/Add.jsx:32` + `backend/controllers/productController.js:7,29`** — Admin sends `bestseller` (lowercase 's') in FormData, but backend destructures `bestSeller` (camelCase 'S'). The `productData` object sets `bestSeller` (camelCase key), but the Mongoose schema field is `bestseller` (lowercase). **The bestseller checkbox has no effect** — the field is never saved correctly.

- **`backend/models/productModel.js:14`** — `price` field is `type: String` but is used as a number everywhere. The controller does `Number(price)` before saving, but the schema type is String. This can cause comparison bugs.

- **`frontend/src/components/RelatedProducts.jsx:11-20`** — First `useEffect` calls `.filter()` but discards the result, then sets state to `productsCopy.slice(0, 5)` (all products, not filtered). The second `useEffect` corrects it. Causes unnecessary double-render and a brief flash of wrong products.

- **`frontend/src/components/CartTotal.jsx:17,24,33`** — Unconditionally appends `.00` to all amounts. Would display `$10.50.00` for decimal prices.

- **`frontend/src/pages/Collection.jsx`** — "Newest" sort option exists in `sortLabelMap` but the `switch` statement has no case for it. The `default` case does nothing.

- **`frontend/src/pages/Cart.jsx:50`** — `products.find()` could return `undefined` if a cart item references a deleted product. Accessing `.image[0]` and `.name` on `undefined` will crash.

- **`backend/controllers/productController.js:30`** — `JSON.parse(sizes)` without try/catch. Malformed JSON input will crash with an unhandled error.

- **`backend/controllers/cartController.js:40`** — `updateCart` has no null check. If `cartData[itemId]` doesn't exist, `cartData[itemId][size] = quantity` throws a TypeError.

- **`backend/controllers/orderController.js`** — `allOrders` and `listProducts` return entire collections with no pagination. Will degrade at scale.

- **`frontend/src/routes/routes.jsx`** — No catch-all/404 route. Invalid URLs render an empty page with just Navbar and Footer.

- **`frontend/src/components/SEO.jsx` + `frontend/src/routes/routes.jsx`** — Dynamic SEO title fails for parameterized routes. `location.pathname` (e.g., `/product/abc123`) won't match the route pattern `/product/:productId`, so title is always `undefined` for product pages.

- **`frontend/src/pages/Orders.jsx`** — Status indicator dot is always `bg-green-500` regardless of actual order status. No visual distinction between "Order Placed" and "Delivered."

- **`admin/src/pages/List.jsx:73`** — No confirmation dialog before deleting a product. Clicking "X" permanently deletes immediately.

- **`admin/src/pages/Add.jsx:69,73,77,81`** — `URL.createObjectURL()` creates object URLs for image previews that are never revoked via `URL.revokeObjectURL()`. Memory leak on each image selection.

- **`backend/services/emailService.js:13,37`** — Uses `onboarding@resend.dev` as sender email. This is Resend's test domain; emails will be flagged as spam and only deliverable to the registered account email in development.

### Low (code hygiene, typos, minor UX)

- **`frontend/src/constant/index.js:9`** — Typo: "fasion" should be "fashion".
- **`frontend/src/components/OurPolicy.jsx:9`** — Typo: "hassel" should be "hassle".
- **`frontend/src/pages/About.jsx:57`** — Typo: "Exeptional" should be "Exceptional".
- **`frontend/src/assets/assets.js:7`** — Dead code: hardcoded product with Windows path `E:/TUTORIAL REACT/...`. 600+ lines of commented-out mock data.
- **`frontend/src/context/ShopContext.jsx:5`** — Dead import: `import { products } from "../assets/assets"` is shadowed by `const [products, setProducts]` on line 20.
- **`frontend/src/main.jsx`** — No `<StrictMode>` wrapper. Double-rendering in dev mode is disabled, masking re-render bugs.
- **`frontend/src/components/Footer.jsx`** — Uses `<a href>` instead of React Router `<Link>`. Causes full page reloads.
- **`frontend/src/components/Navbar.jsx:60`** — Redundant assignment: `(prev) => (prev = !prev)` should be `(prev) => !prev`.
- **`frontend/src/components/ui/AlertDialog.jsx`** — Default labels are in Indonesian ("Ya, lanjutkan", "Batal") while the rest of the app is English.
- **`frontend/src/components/auth/ForgotPassword.jsx:30`** — `console.log(response.data)` debug logging left in production code.
- **`admin/src/pages/List.jsx:18`** — `console.log(response.data)` logs full product list to console.
- **`admin/src/components/Login.jsx:19`** — `console.log(response)` logs full response including admin token.
- **`admin/src/pages/List.jsx:60`** — Uses array `index` as React key instead of `item._id`.
- **`admin/src/pages/Orders.jsx:58`** — Uses array `index` as React key instead of `order._id`.
- **`admin/src/pages/Orders.jsx:61-74`** — if/else in `order.items.map` renders identical JSX in both branches (dead duplicate code).
- **`backend/package.json`** — `nodemailer` listed as dependency but never imported. Dead dependency.
- **`backend/database/products/productSeeder.js:5`** — Imports from `../assets/assets.js` which does not exist. Seeder will crash.
- **`backend/controllers/productController.js:29`** — Sets `bestSeller` (camelCase) in productData, but schema defines `bestseller` (lowercase). Mongoose creates a separate field instead of setting the schema field.
- **Many frontend images** — Empty `alt=""` on Hero, OurPolicy, Product, ProductItem, Contact, About images. Accessibility violation.
- **No password visibility toggle** on any password input field (Login, Register, ResetPassword).

---

## 4. Prioritized Roadmap

### Phase 1 — Critical (blocks the core shopping flow)

- [*] **Fix order placement `userId` bug** — In `backend/controllers/orderController.js`, change all 3 place-order functions (`placeOrder`, `placeOrderStripe`, `placeOrderRazorpay`) plus `userOrders`, `verifyStripe`, and `verifyRazorpay` to get `userId` from `req.user.id` (set by auth middleware) instead of `req.body.userId`. This requires no frontend changes. (Files: `backend/controllers/orderController.js:20,47,101,120,157,187`)

- [*] **Fix admin panel crash** — In `admin/src/App.jsx`, add `const [token, setToken] = useState('')` to declare the `token` state. Also add `localStorage` persistence so the token survives page refreshes (read from `localStorage` on init, save on login, clear on logout). (Files: `admin/src/App.jsx`, `admin/src/components/Login.jsx`, `admin/src/components/Navbar.jsx`)

- [*] **Fix Stripe payment verification security hole** — In `backend/controllers/orderController.js:100-114`, replace the client-trusting `req.body.success` check with a server-side Stripe session retrieval (`stripe.checkout.sessions.retrieve(orderId)` or use the `orderId` from the URL to fetch the session and check `session.payment_status`). (File: `backend/controllers/orderController.js:100-114`)

- [*] **Add route-level auth guards** — Create a `ProtectedRoute` wrapper component in `frontend/src/components/auth/` that redirects to `/login` if not authenticated. Wrap `/place-order`, `/orders`, and `/cart` routes in `frontend/src/routes/routes.jsx`. (Files: `frontend/src/routes/routes.jsx`, new component in `frontend/src/components/auth/`)

- [*] **Fix bestseller field casing mismatch** — In `backend/controllers/productController.js:7,29`, the destructured key `bestSeller` should be `bestseller` to match the FormData field name AND the Mongoose schema field name. Change line 7 to `const { ..., bestseller } = req.body` and line 29 to `bestseller: bestseller === 'true' ? true : false`. (Files: `backend/controllers/productController.js:7,29`)

### Phase 2 — High Priority (expected of any real e-commerce site)

- [*] **Redesign admin auth system** — Replace the current plaintext-credentials-in-JWT pattern with proper admin user records in the database. Create an `adminUser` model or add an `isAdmin` role to `userModel`. Use standard JWT with `expiresIn`, role-based middleware, and bcrypt password comparison. Remove `JWT_SECRET = "forever"` and use a proper random secret. (Files: `backend/middleware/adminAuth.js`, `backend/controllers/userController.js:448-461`, `backend/models/userModel.js`)

- [*] **Add rate limiting** — Install `express-rate-limit` and apply to auth routes: login (5/15min), register (3/15min), forgot-password (3/15min), resend-verification (3/15min). (File: `backend/server.js`, new middleware)

- [*] **Add multer file upload limits** — In `backend/middleware/multer.js`, add `limits: { fileSize: 5 * 1024 * 1024 }` (5MB) and a `fileFilter` that only allows `image/jpeg`, `image/png`, `image/webp`. (File: `backend/middleware/multer.js`)

- [*] **Add `select: false` to sensitive fields** — In `backend/models/userModel.js`, add `select: false` to `password`, `verifyToken`, `resetPasswordToken`, `verifyTokenExpiry`, `resetPasswordTokenExpiry` fields. (File: `backend/models/userModel.js`)

- [*] **Fix invalidation on logout** — Add a server-side token blocklist (Redis or a simple `Set` in memory for now) in the logout endpoint. Check the blocklist in `auth.js` middleware. (Files: `backend/controllers/userController.js:434-445`, `backend/middleware/auth.js`)

- [*] **Add empty states and loading indicators** — Add skeleton/loading spinners to: Collection page (product grid), Cart page (cart items), Orders page (order list), Product detail page. Add empty state messages for: Cart (empty cart), Orders (no orders), Collection (no matching products). (Files: `frontend/src/pages/Cart.jsx`, `frontend/src/pages/Orders.jsx`, `frontend/src/pages/Collection.jsx`, `frontend/src/pages/Product.jsx`)

- [*] **Fix register success toast bug** — In `frontend/src/zustand/authStore.js:35`, change `toast.success(...)` to `toast.error(...)` when `response.data.success` is false. (File: `frontend/src/zustand/authStore.js:35`)

- [*] **Add helmet security headers** — Install `helmet` and add `app.use(helmet())` in `backend/server.js`. (File: `backend/server.js`)

- [*] **Add product edit functionality in admin** — Create an edit page/modal in the admin panel. Add a backend `updateProduct` controller function and route. Allow editing name, description, price, category, subcategory, sizes, bestseller, and replacing images. (Files: new admin page, `backend/controllers/productController.js`, `backend/routes/productRoute.js`)

- [*] **Add delete confirmation dialogs** — In `admin/src/pages/List.jsx`, add a confirmation modal (use `window.confirm` or a custom dialog) before deleting a product. Similarly for status changes in `admin/src/pages/Orders.jsx`. (Files: `admin/src/pages/List.jsx:73`, `admin/src/pages/Orders.jsx`)

### Phase 3 — Medium Priority (improves completeness/quality)

- [*] **Add product price as Number type** — Change `price` field in `backend/models/productModel.js` from `type: String` to `type: Number`. Update the controller to stop doing `Number(price)` (Mongoose will cast automatically). (File: `backend/models/productModel.js:14`)

- [*] **Add pagination** — Add `skip` and `limit` query params to `listProducts` in `backend/controllers/productController.js`. Add page controls in the frontend Collection page and admin List page. (Files: `backend/controllers/productController.js:48-55`, `frontend/src/pages/Collection.jsx`, `admin/src/pages/List.jsx`)

- [*] **Fix Product page description** — In `frontend/src/pages/Product.jsx`, display the actual `productData.description` from the database instead of hardcoded marketing text. Remove the hardcoded star rating or implement a real review system. (Files: `frontend/src/pages/Product.jsx`)

- [*] **Fix `RelatedProducts.jsx` double useEffect** — Remove the first broken `useEffect` (lines 11-20). Keep only the second correct one (lines 23-31). (File: `frontend/src/components/RelatedProducts.jsx:11-20`)

- [*] **Fix SEO for parameterized routes** — In `frontend/src/App.jsx`, use `react-helmet-async`'s `<Helmet>` directly in each page component instead of trying to match `location.pathname` against route patterns. Each page should set its own `<title>`. (File: `frontend/src/App.jsx`, `frontend/src/pages/Product.jsx`)

- [*] **Fix `CartTotal.jsx` decimal formatting** — Replace the hardcoded `.00` suffix with proper currency formatting (e.g., `Number(amount).toFixed(2)`). (File: `frontend/src/components/CartTotal.jsx:17,24,33`)

- [*] **Add "Newest" sort implementation** — In `frontend/src/pages/Collection.jsx`, add a `case "newest"` to the sort switch statement that sorts by `date` field in descending order. (File: `frontend/src/pages/Collection.jsx`)

- [*] **Add null checks in Cart.jsx** — Guard against `products.find()` returning undefined for cart items that reference deleted products. (File: `frontend/src/pages/Cart.jsx:50`)

- [*] **Add try/catch around `JSON.parse(sizes)`** — In `backend/controllers/productController.js:30`, wrap in try/catch to handle malformed JSON gracefully. (File: `backend/controllers/productController.js:30`)

- [*] **Add null check in `updateCart`** — In `backend/controllers/cartController.js:40`, check that `cartData[itemId]` exists before accessing `cartData[itemId][size]`. (File: `backend/controllers/cartController.js:40`)

- [*] **Fix AlertDialog default language** — Change default labels from Indonesian to English in `frontend/src/components/ui/AlertDialog.jsx`. (File: `frontend/src/components/ui/AlertDialog.jsx`)

- [*] **Fix Footer to use React Router Links** — Replace `<a href>` with `<Link to>` for internal navigation links in `frontend/src/components/Footer.jsx`. (File: `frontend/src/components/Footer.jsx`)

- [*] **Add `<StrictMode>`** — Wrap the app in `<React.StrictMode>` in `frontend/src/main.jsx`. (File: `frontend/src/main.jsx`)

- [*] **Add contact page button handler** — Add an `onClick` or `<a href="mailto:...">` to the "Contact Support" button in `frontend/src/pages/Contact.jsx`. (File: `frontend/src/pages/Contact.jsx`)

### Phase 4 — Polish (portfolio "wow factor")

- [x] **Add reviews and ratings system** — Create a `reviewModel` (userId, productId, rating, comment, date). Add CRUD API endpoints. Add review section to Product page with star selector and text input. Show average rating on product cards.

- [x] **Add wishlist/favorites** — Add a `wishlist` array field to `userModel`. Create add/remove/check API endpoints. Add a heart icon to `ProductItem` and a wishlist page.

- [x] **Add profile page** — Create a profile page where users can view/edit their name, email, phone, and saved addresses. Add a backend endpoint for profile updates.

- [x] **Add coupon/discount system** — Create a `couponModel` (code, discountPercent, minOrder, maxUses, expiry). Add validation in checkout and apply discount to order total.

- [x] **Add order tracking UI** — Replace the "Track Order" button refresh behavior with a proper order detail view showing a timeline of status changes with dates.

- [x] **Add image lazy loading** — Add `loading="lazy"` to all product images. Consider Cloudinary auto-optimization (`/w_auto,f_auto/` URL transformations).

- [x] **Add accessibility improvements** — Add descriptive `alt` text to all images. Add `aria-label` to icon-only buttons. Add keyboard focus trapping to AlertDialog and FilterModal. Add a skip-to-content link.

- [ ] **Add basic automated tests** — Install Vitest + React Testing Library for frontend, Jest + Supertest for backend. Write tests for: cart operations, order placement, auth flows, and Collection page filtering.

- [x] **Fix all typos** — "fasion" -> "fashion" (`frontend/src/constant/index.js:9`), "hassel" -> "hassle" (`frontend/src/components/OurPolicy.jsx:9`), "Exeptional" -> "Exceptional" (`frontend/src/pages/About.jsx:57`).

- [x] **Clean up dead code** — Remove commented-out mock data from `frontend/src/assets/assets.js` (600+ lines). Remove dead `products` import from `frontend/src/context/ShopContext.jsx:5`. Remove dead first `useEffect` in `frontend/src/components/RelatedProducts.jsx:11-20`. Remove `nodemailer` from `backend/package.json`. Remove unused Iconify imports from `admin/src/main.jsx`.

- [x] **Add admin sales dashboard** — Create a dashboard page with: total orders, total revenue, orders by status, recent orders, and top-selling products. Use a simple charting library (e.g., Chart.js or Recharts).

- [ ] **Add product inventory/stock** — Add a `stock` field to `productModel`. Decrease stock on order placement. Show "Out of Stock" on product cards when stock is 0. Disable add-to-cart when out of stock.

- [ ] **Consistent error handling** — Add a global Express error handler middleware in `backend/server.js`. Add React Error Boundaries in the frontend. Standardize error response format across all controllers.

---

_End of audit. Every finding has been verified against the actual source code._
