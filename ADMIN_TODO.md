# Admin Panel Improvement Roadmap

## Immediate (This Session)

- [x] **Responsive Navbar** — Fill white space with: greeting text, live stat pills (pending orders, low stock count), notification bell, "View Storefront" link. Add hamburger button for mobile.
- [x] **Responsive Sidebar** — Desktop: fixed sidebar. Tablet: collapsed icon-only. Mobile: hidden, opens as slide-over overlay via hamburger. Add backdrop.
- [x] **Fix Coupon navigation bug** — Investigate and fix the sidebar Coupon nav issue.
- [x] **Action buttons in List & Coupons** — Replace `<p>E</p>` / `<p>X</p>` with proper `<button>` + Iconify icons (edit pencil, delete trash). Add hover states and tooltips. Same pattern for Coupons delete button.
- [x] **Remove test todo from AUDIT.md**

## Phase A: Dashboard Visual Upgrade

- [x] **Revenue chart** — Add a line/bar chart for monthly revenue trend (using `recharts` or CSS-only approach).
- [x] **Orders by status chart** — Replace plain badge pills with a donut/pie chart.
- [x] **Date range filter** — Let admin filter dashboard stats by 7 days / 30 days / custom range.

## Phase B: Order Management

- [x] **Order detail drawer/modal** — Click an order to see full details: customer info, address, items, status timeline.
- [x] **Bulk status update** — Select multiple orders and update status in batch.

## Phase C: Product Management

- [x] **Product image in List page** — Show larger product thumbnails in the list table.
- [x] **Inline stock editing** — Edit stock directly from the list without going to the edit page.
- [x] **Low stock alerts** — Highlight products with `stock <= 5` in List page + Dashboard section.

## Phase D: Reporting & Utilities

- [ ] **Export orders to CSV** — Download button for orders data.
- [ ] **Activity log / audit trail** — Track admin actions (status changes, product edits, coupon creation).
- [ ] **Dark mode** — Theme toggle with Tailwind `dark:` classes.
