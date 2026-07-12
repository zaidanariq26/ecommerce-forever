# PRD.md — Ecommerce Forever

## 1. Purpose
A personal portfolio project, but built and evaluated to the standard of a real shopping site — not a toy demo. Audience: recruiters/employers reviewing the portfolio, and hypothetical shoppers testing the actual flow.

## 2. Core Scope (must work)
- Auth (login / register / logout, protected routes)
- Home page
- Collection / category browsing (Men / Women / Kids)
- Filtering and sorting
- Product detail page, including the actual product description from the database
- Cart
- Checkout & Payment — Stripe, Razorpay (sandbox/test mode), and Cash on Delivery
- Payment verification must be server-side (e.g., Stripe session retrieval via the Stripe API), not client-trusting
- User profile page (view and edit name, email, phone, saved addresses)
- Order history / order list
- Admin panel — must boot without runtime errors and include:
  - Product CRUD (create, read, update, delete with image upload)
  - Inventory management (stock quantity per product, shown on product cards, disabled add-to-cart when out of stock)
  - Order management (view all orders, update order status)
  - Basic dashboard (total orders, total revenue, recent orders)

## 3. Explicitly Out of Scope
- Live/production payment processing (Stripe & Razorpay stay in sandbox/test mode)
- Real shipping/fulfillment integration
- Multi-language support
- Multi-currency support

## 4. Stretch Goals (only if time allows)
- Wishlist
- Reviews & ratings

## 5. Non-Functional Goals
- Fully responsive (mobile / tablet / desktop)
- Lighthouse score aiming for 90+ (best effort; accessibility and performance fixes applied, but not a hard gate)
- Deployed and demo-able (live URL)
- Meaningful loading states on all major pages (product grid, cart, orders, product detail)
- Empty states for empty cart, no orders, no search results, no matching products
- Error boundaries in the frontend to prevent full-page crashes
- Basic accessibility: descriptive alt text on all images, aria-labels on icon-only buttons, keyboard-navigable modals
- Client-side form validation on checkout address form (phone format, zipcode format)
- All secrets in .env files, none hardcoded in source code

## 6. Known Weak Spots (must fix, not skip)
The admin panel is functional but underbuilt — this is treated as a priority item in the execution roadmap, not skipped because it technically "works." Specific gaps: the panel crashes on load due to an undefined state variable, products cannot be edited (only added/deleted), no inventory tracking exists, and no dashboard is present.

The order placement flow is currently broken — the frontend never sends `userId` to the backend, causing every order to fail with a Mongoose validation error. This must be the first fix.
