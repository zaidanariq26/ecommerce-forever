# DESIGN.md — Ecommerce Forever Design System

> **Date:** 2026-07-12
> **Scope:** Frontend (customer storefront) + Admin panel
> **Purpose:** Document the existing design system to keep future work consistent and assess dark mode readiness.

---

## 1. Styling Approach

| App | Framework | Integration | Config |
|-----|-----------|-------------|--------|
| **Frontend** | Tailwind CSS **v4.3.0** | Vite plugin (`@tailwindcss/vite`) | No `tailwind.config.js` — theme via CSS-native `@theme` block in `src/css/index.css` |
| **Admin** | Tailwind CSS **v3.4.19** | PostCSS plugin (`postcss.config.js`) | `tailwind.config.js` with **empty `theme.extend`** — all defaults |

**Other approaches:** None. No CSS Modules, no styled-components, no CSS-in-JS, no component library (no shadcn, MUI, Chakra, etc.).

**CSS custom properties:** Effectively none. The only custom property is `--breakpoint-xs: 30rem` in the frontend's `@theme` block. There are no color tokens, no font tokens, no spacing tokens defined as CSS variables.

**Source of truth for colors:** There is no centralized theme file. Colors live implicitly in Tailwind utility classes scattered across components. The admin panel has 4 hardcoded hex values in `admin/src/index.css` that override/supplement Tailwind defaults.

**Font imports:**
- Frontend: `src/css/index.css` imports Google Fonts `Outfit` (100-900) and `Prata` (400)
- Admin: `src/index.css` imports Google Fonts `Outfit` (100-900) and `Prata` (400, unused)

---

## 2. Color Palette

### Primary / Brand

| Name | Value | Used for | Source file |
|------|-------|----------|-------------|
| Gray-900 | `#111827` (Tailwind default) | All CTA buttons (Place Order, Add to Cart, Checkout, Submit, Login, Register), active filter chips, filter apply button, mobile active nav | Used in: `PlaceOrder.jsx`, `Product.jsx`, `Cart.jsx`, `SubmitButton.jsx`, `Login.jsx`, `Register.jsx`, `FilterModal.jsx`, `Navbar.jsx` |

### Secondary / Accent

| Name | Value | Used for | Source file |
|------|-------|----------|-------------|
| `#414141` | `#414141` (hardcoded hex) | Hero section text and decorative lines — the only inline hex in the frontend | `frontend/src/components/Hero.jsx` |
| `#c586a5` | `#c586a5` (hardcoded hex) | Admin focus ring outline color, active nav link border color — pink/rose accent | `admin/src/index.css` |
| `#ffebf5` | `#ffebf5` (hardcoded hex) | Admin active nav link background — very light pink | `admin/src/index.css` |
| Orange-500 | `#f97316` (Tailwind default) | Selected product size border (single usage) | `frontend/src/pages/Product.jsx` |

### Neutrals / Grays

| Name | Value | Used for | Source file |
|------|-------|----------|-------------|
| White | `#ffffff` | CTA button text, mobile active nav text, FilterModal sheet bg, AlertDialog portal bg | Multiple components |
| Gray-50 | `#f9fafb` | SearchBar bg, AlertDialog icon bg, admin page bg | `SearchBar.jsx`, `AlertDialog.jsx`, `admin/App.jsx` |
| Slate-50 | `#f8fafc` | Cart size badge bg (single usage — differs from gray-50 used elsewhere) | `frontend/src/pages/Cart.jsx` |
| Gray-100 | `#f3f4f6` | Navbar dropdown bg, AlertDialog modal bg, Cart +/- hover, size button default bg, SubmitButton disabled bg, admin table header bg | Multiple components |
| Slate-200 | `#e2e8f0` | Admin unselected size chip (single usage) | `admin/src/pages/Add.jsx` |
| Gray-200 | `#e5e7eb` | FilterModal cancel hover, Track Order hover, admin order card border | Multiple components |
| Gray-300 | `#d1d5db` | Most borders (inputs, dividers, card borders, filter borders), admin input/nav borders | Most components |
| `#c2c2c2` | `#c2c2c2` | Admin global CSS input border — slightly different from gray-300 | `admin/src/index.css` |
| Gray-400 | `#9ca3af` | Cart size labels, orders metadata text, FilterModal label text, Loading default text | Multiple components |
| Gray-500 | `#6b7280` | Title subtitle text, search icons, AlertDialog message text, product description text, Loading default | Multiple components |
| Gray-600 | `#4b5563` | Footer links, About text, Navbar sidebar text, admin logout button bg, admin content text | Multiple components |
| Gray-700 | `#374151` | Navbar link text, product name/price text, filter unselected text, Title subtitle, admin label text | Multiple components |
| Gray-800 | `#1f2937` | Navbar icons, form text, SubmitButton disabled bg, AlertDialog default button bg, filter active chip text | Multiple components |
| Black/50 | `rgba(0,0,0,0.5)` | AlertDialog backdrop overlay | `AlertDialog.jsx` |
| Black/40 | `rgba(0,0,0,0.4)` | FilterModal backdrop overlay | `FilterModal.jsx` |

### Semantic / Status

| Name | Value | Used for | Source file |
|------|-------|----------|-------------|
| Green-400 | `#4ade80` | Selected payment method radio dot | `PlaceOrder.jsx` |
| Green-500 | `#22c55e` | Order status indicator dot (always green regardless of status) | `Orders.jsx` |
| Pink-100 | `#fce7f3` | Admin selected size chip | `admin/src/pages/Add.jsx` |

**AlertDialog semantic variants** (frontend only):

| Variant | Icon bg | Icon text | Icon border | Button bg | Button hover |
|---------|---------|-----------|-------------|-----------|--------------|
| default | `bg-gray-50` | `text-gray-500` | `text-gray-500` | `bg-gray-800` | `hover:bg-gray-900` |
| info | `bg-blue-50` | `text-blue-500` | `text-blue-300` | `bg-blue-500` | `hover:bg-blue-600` |
| success | `bg-green-50` | `text-green-500` | `text-green-300` | `bg-green-500` | `hover:bg-green-600` |
| warning | `bg-amber-50` | `text-amber-500` | `text-amber-300` | `bg-amber-500` | `hover:bg-amber-600` |
| error | `bg-red-50` | `text-red-500` | `text-red-300` | `bg-red-500` | `hover:bg-red-600` |

### Borders / Dividers

| Name | Value | Used for | Source file |
|------|-------|----------|-------------|
| Gray-300 | `#d1d5db` | Most borders and dividers (inputs, cards, nav bottom, item separators) | Most components |
| Gray-400 | `#9ca3af` | SearchBar border, payment method border, filter button border | Multiple components |
| Gray-500 | `#6b7280` | Auth form input borders | `Login.jsx`, `Register.jsx` |
| Gray-900 | `#111827` | Auth button borders, active filter chip border | `Login.jsx`, `Register.jsx`, `FilterModal.jsx` |
| Black | `#000000` | Contact page button border (single usage — differs from gray-900 used elsewhere) | `Contact.jsx` |

---

## 3. Typography

### Font Families

| Font | Weight(s) | Role | Source |
|------|-----------|------|--------|
| **Outfit** (sans-serif) | 100-900 (variable) | Global body font — `* { font-family: "Outfit" }` | `frontend/src/css/index.css`, `admin/src/index.css` |
| **Prata** (serif) | 400 only | Display/heading accent — `.prata-regular { font-family: "Prata", serif }` | `frontend/src/css/index.css` (also imported but unused in admin) |

### Font Sizes

| Tailwind class | CSS value | Where used |
|----------------|-----------|------------|
| `text-[8px]` | 8px | Cart badge count |
| `text-xs` | 0.75rem / 12px | OurPolicy, ProductItem, FilterModal chips, Cart size, Collection filter labels, BestSeller subtitle, orders metadata, admin responsive |
| `text-sm` | 0.875rem / 14px | **Most common** — Navbar links, all buttons, form labels, CartTotal, product names/prices, descriptions, SubmitButton, AlertDialog, FilterModal, admin labels/table |
| `text-base` | 1rem / 16px | Admin content wrapper, Loading default, AuthLayout labels |
| `text-[15px]` | 15px | Admin sidebar nav links, admin order amounts (arbitrary) |
| `text-lg` | 1.125rem / 18px | Filter icon, SearchBar icons, Cart quantity, admin delete button |
| `text-xl` | 1.25rem / 20px | Title component, Footer section headers, Cart items |
| `text-2xl` | 1.5rem / 24px | Cart page title, auth form titles (sm+), product name, admin login heading |
| `text-3xl` | 1.875rem / 28px | Title component (md), BestSeller/RelatedProducts titles, Product price, Hero "Latest Arrivals" (lg), AlertDialog icon |
| `text-5xl` | 3rem / 48px | Hero "OUR BESTSELLERS" heading |

### Font Weights

| Class | Weight | Where used |
|-------|--------|------------|
| `font-light` | 300 | Collection filter options |
| `font-normal` | 400 | Login/Register buttons, SubmitButton, AlertDialog message, auth buttons |
| `font-medium` | 500 | **Most common** — Navbar, ProductItem price, Footer headers, Product name/price, Cart names, Orders "Track Order", FilterModal header, Title, AlertDialog title, admin labels |
| `font-semibold` | 600 | Hero "SHOP NOW", OurPolicy titles, Contact headers, admin status select |
| `font-bold` | 700 | Admin "Admin Panel" heading (single usage) |

### Line Heights

| Class | Where used |
|-------|------------|
| `leading-relaxed` | Hero "Latest Arrivals" (prata-regular), AlertDialog message text |

### Letter Spacing

| Class | Where used |
|-------|------------|
| `tracking-widest` | FilterModal "SORT BY", "CATEGORY", "TYPE" labels |

---

## 4. Spacing & Layout

### Container Widths

| Class | Where used |
|-------|------------|
| `max-w-xs` | AlertDialog modal (mobile) |
| `max-w-sm` | AlertDialog modal (sm+) |
| `max-w-96` | Login/Register form (mobile) |
| `max-w-120` | PlaceOrder form left side |
| `max-w-md` | Admin login card, Contact message |
| `max-w-[450px]` | Cart total, About image |
| `max-w-[480px]` | Contact page image |
| `max-w-[500px]` | Admin product form inputs |

### Common Spacing Scale (most frequently used)

| Scale | Value | Common use |
|-------|-------|------------|
| `gap-2` / `p-2` / `py-2` / `px-2` | 0.5rem / 8px | Tight internal spacing (chips, icon+text pairs) |
| `gap-3` / `p-3` / `px-3` / `mb-3` | 0.75rem / 12px | Form field spacing, card internals |
| `gap-4` / `p-4` / `px-4` / `py-4` / `mb-4` | 1rem / 16px | Default component spacing, grid gaps |
| `gap-5` / `px-5` / `py-5` / `mb-5` | 1.25rem / 20px | Section spacing, dropdown padding |
| `gap-6` / `gap-12` | 1.5rem / 3rem / 48px | Large section gaps (footer, hero, policy) |
| `my-10` / `py-10` | 2.5rem / 40px | Major section separators |
| `my-20` / `py-20` | 5rem / 80px | Page-level vertical spacing |
| `my-24` | 6rem / 96px | RelatedProducts section |

### Breakpoints

| Prefix | Width | Source |
|--------|-------|--------|
| `xs:` | 30rem / 480px | Custom — `frontend/src/css/index.css` `@theme` block |
| `sm:` | 640px | Tailwind default |
| `min-[964px]:` | 964px | Arbitrary — Collection filter sidebar visibility |
| `md:` | 768px | Tailwind default |
| `lg:` | 1024px | Tailwind default |
| `h-xs:` through `h-xl:` | 480px–1280px | Custom height-based — `frontend/src/css/index.css` |

### Grid Patterns

| Pattern | Where |
|---------|-------|
| `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5` | Product grids (BestSeller, LatestCollection, RelatedProducts) |
| `grid-cols-2` | Collection page |
| `flex flex-col sm:flex-row` | PlaceOrder form layout, Add form layout |
| `grid grid-cols-[1fr_3fr_1fr_1fr_1fr]` | Admin product list table (md+) |
| `grid grid-cols-1 sm:grid-cols-[.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr]` | Admin order cards |

---

## 5. Components

### Buttons

| Variant | Pattern | Where |
|---------|---------|-------|
| **Primary CTA** | `bg-gray-900 px-8 py-3 text-sm text-white hover:bg-gray-800` (no border-radius) | Place Order, Proceed to Checkout, Add to Cart, Contact Support, Admin Add/Admin Login |
| **SubmitButton (loading-aware)** | `bg-gray-900 hover:bg-gray-800 text-gray-100 h-10 w-full` (disabled: `bg-gray-800 text-gray-400 cursor-not-allowed`) | Auth forms |
| **Secondary/ghost** | `bg-gray-100 hover:bg-gray-200` (no border) | Cart +/- buttons, FilterModal cancel, Track Order |
| **Outline** | `border border-gray-900 bg-transparent text-gray-900 hover:bg-gray-100` | None currently (pattern exists in FilterModal chips) |
| **Admin Logout** | `bg-gray-600 text-white rounded-full px-5 py-2` | `admin/src/components/Navbar.jsx` |
| **Chip/Tag** | `rounded-full border border-gray-300 px-4 py-1.5 text-xs` (active: `border-gray-900 bg-gray-900 text-white`) | FilterModal, Collection page |

**No border-radius on primary CTAs** — all major buttons are intentionally sharp-cornered.

### Form Inputs

| Context | Pattern | Source |
|---------|---------|--------|
| **Checkout address** | `w-full border border-gray-300 px-3.5 py-1.5 rounded` | `PlaceOrder.jsx` |
| **Auth forms** | `w-full border border-gray-500 px-3 py-2` (no border-radius) | `Login.jsx`, `Register.jsx` |
| **Admin inputs** | `w-full px-3 py-2` (global CSS adds `border: 1px solid #c2c2c2; border-radius: 4px`) | `Add.jsx`, `admin/index.css` |
| **Admin login inputs** | `border border-gray-300 rounded-md px-3 py-2` (overrides global CSS) | `admin/Login.jsx` |
| **Focus** | Global: `outline-color: #c586a5` (admin only). Frontend: `outline-none` globally (no visible focus) | `admin/index.css`, `frontend/src/css/index.css` |

### Cards / Items

| Type | Pattern | Source |
|------|---------|--------|
| **Product card** | No bg, no border, no shadow. Image + name + price. `hover:scale-110` on image with `transition ease-in-out` | `ProductItem.jsx` |
| **Cart item** | `py-4 border-b border-gray-300 divide-gray-300` (horizontal rule separator) | `Cart.jsx` |
| **Order item** | `py-4 border-b border-gray-300 divide-gray-300` (same as cart) | `Orders.jsx` |
| **Admin order card** | `border border-gray-200 my-3 md:my-4 rounded-sm` with `p-5 md:p-8` | `admin/Orders.jsx` |
| **Admin login card** | `bg-white max-w-md mx-auto px-8 py-6 rounded-lg shadow-md` | `admin/Login.jsx` |

### Navbar

| Element | Pattern | Source |
|---------|---------|--------|
| **Container** | `py-5 flex items-center justify-between border-b border-gray-300` | `Navbar.jsx` |
| **Nav links** | `flex gap-5` with `font-medium text-sm text-gray-700` | `Navbar.jsx` |
| **Active link** | Desktop: `<hr>` underline below. Mobile: `bg-gray-900 text-white` | `Navbar.jsx`, `index.css` |
| **Icons** | `text-gray-800` with `size-5` | `Navbar.jsx` |
| **Dropdown** | `absolute right-0 bg-gray-100 rounded w-36 flex flex-col gap-2 p-3` with `group-hover:block` visibility | `Navbar.jsx` |

### Modals

| Type | Pattern | Source |
|------|---------|--------|
| **AlertDialog** | Portal to body. Backdrop `bg-black/50 backdrop-blur-[2px]`. Modal `bg-gray-100 max-w-xs sm:max-w-sm px-7 pt-8 pb-6 shadow-xl`. Scale+opacity animation via `requestAnimationFrame`. | `AlertDialog.jsx` |
| **FilterModal** | Bottom sheet on mobile. Backdrop `bg-black/40`. Sheet `bg-white fixed bottom-0 w-full`. | `FilterModal.jsx` |

### Admin Sidebar

| Element | Pattern | Source |
|---------|---------|--------|
| **Container** | `w-[18%] min-h-screen border-r-2 pt-6 pl-[20%] flex flex-col gap-4` | `Sidebar.jsx` |
| **Nav links** | `NavLink` with `size-5` icon + `text-[15px]` label, left-rounded (`rounded-l`) | `Sidebar.jsx` |
| **Active state** | `.active` class: `background-color: #ffebf5; border-color: #c586a5` | `admin/index.css` |

---

## 6. Dark Mode Readiness

### Token-based vs hardcoded: **NOT READY**

There are **no reusable color tokens** anywhere in the codebase. The frontend has zero CSS custom properties for colors. The admin has 4 hardcoded hex values in `index.css` but no token system. Every color is a Tailwind utility class (`bg-gray-900`, `text-gray-500`) or a hardcoded hex (`#414141`, `#c586a5`) applied directly in JSX.

**To implement dark mode, every component would need to be modified** to either:
- Use CSS custom properties (e.g., `bg-[var(--color-primary)]` instead of `bg-gray-900`)
- Use Tailwind's `dark:` variant (e.g., `bg-gray-900 dark:bg-gray-100`)
- Use a Tailwind theme extension with color tokens

### Files/components with hardcoded colors that will need refactor

| File | Hardcoded value | Issue |
|------|----------------|-------|
| `frontend/src/components/Hero.jsx` | `text-[#414141]`, `bg-[#414141]` | Arbitrary hex, not tokenized |
| `admin/src/index.css` | `border: 1px solid #c2c2c2` | Global input border — hardcoded hex |
| `admin/src/index.css` | `outline-color: #c586a5` | Global focus ring — hardcoded hex |
| `admin/src/index.css` | `background-color: #ffebf5` | Active nav — hardcoded hex |
| `admin/src/index.css` | `border-color: #c586a5` | Active nav — hardcoded hex |
| **Every component using `bg-gray-900`** | `#111827` | Would need a `dark:` variant or token swap |
| **Every component using `bg-white`** | `#ffffff` | Would need `dark:bg-gray-900` equivalent |
| **Every component using `text-gray-*`** | Various | Would need light/dark text variants |

### Colors likely to be problematic in dark mode as-is

| Color | Value | Why |
|-------|-------|-----|
| `bg-white` | `#ffffff` | Pure white backgrounds would need to become dark surfaces |
| `text-gray-900` | `#111827` | Near-black text invisible on dark backgrounds |
| `text-gray-800` | `#1f2937` | Same issue |
| `text-gray-700` | `#374151` | Very low contrast on dark backgrounds |
| `border-gray-300` | `#d1d5db` | Would need lighter borders in dark mode |
| `bg-gray-100` | `#f3f4f6` | Modal/dropdown backgrounds — would need dark equivalent |
| `bg-black/50` | `rgba(0,0,0,0.5)` | Backdrop overlays — would need lightened version for dark mode |
| `#c586a5` (admin) | Pink accent | May need adjustment for dark bg contrast |
| `#ffebf5` (admin) | Light pink bg | Nearly invisible on dark backgrounds |

---

## 7. Inconsistencies Found

- **Input border colors differ across the app**: `border-gray-300` (`#d1d5db`) in `PlaceOrder.jsx` vs `border-gray-500` (`#6b7280`) in `Login.jsx`/`Register.jsx` vs `#c2c2c2` via global CSS in `admin/index.css` — three different border colors for the same element type.

- **Button border-radius is inconsistent**: Primary CTAs have no border-radius. Admin logout button uses `rounded-full`. Admin login button uses `rounded-md`. Admin login card uses `rounded-lg`. No consistent pattern.

- **`bg-slate-50` vs `bg-gray-50`**: `Cart.jsx` uses `bg-slate-50` for size badges while everything else uses `bg-gray-50`. Mixing the slate and gray color families.

- **Contact button border uses `border-black`** (`#000000` in `Contact.jsx`) while all other dark borders use `border-gray-900` (`#111827`). Visually almost identical but technically inconsistent.

- **`#414141` vs `gray-800` (`#1f2937`)**: The Hero section uses a hardcoded `#414141` that is neither a Tailwind default nor equivalent to any gray-800/900 value. It creates a third "dark" color in the palette.

- **Focus ring styles differ**: Admin has a visible pink focus ring (`#c586a5`). Frontend has **no visible focus ring at all** (`outline-none` applied globally to all inputs).

- **Admin has zero hover states** while the frontend has hover effects on most interactive elements (buttons, links, cards, chips).

- **Tailwind version mismatch**: Frontend uses Tailwind v4 with CSS-native config. Admin uses Tailwind v3 with `tailwind.config.js`. Both use the same font (Outfit) but import it independently.

- **Prata font imported but unused in admin**: `admin/src/index.css` imports Prata but no admin component references it.

- **Product card hover differs**: `ProductItem.jsx` has `hover:scale-110` image zoom. Admin list items have no hover effect at all.

- **Global CSS input styling conflicts with Tailwind classes**: `admin/index.css` sets `border: 1px solid #c2c2c2` on all inputs, but `admin/Login.jsx` also applies `border border-gray-300` (different color) and `rounded-md` (overrides the global `border-radius: 4px`).

---

## 8. Rules for Future Work

1. **Use `bg-gray-900` for all primary CTAs** — do not introduce new hex values for buttons. The existing pattern (`bg-gray-900 hover:bg-gray-800 text-white text-sm px-8 py-3`) is the established brand identity.

2. **Use the existing gray scale, not slate** — all neutrals should come from the `gray-*` family. Do not mix in `slate-*` values.

3. **New components must use Tailwind utility classes, not inline hex** — the only exception is the Hero's `#414141`, which should be replaced with `gray-800` or `gray-900` in future refactors, not duplicated.

4. **Match the frontend's Tailwind version (v4)** for any new frontend work. Do not add a `tailwind.config.js` to the frontend — use the CSS-native `@theme` block for any new custom values.

5. **Use `rounded-full` only for small elements** (chips, badges, radio dots, avatar circles). Use no border-radius for primary CTAs. Use `rounded` for inputs and `rounded-lg` for cards.

6. **For dark mode preparation**: any new component should avoid hardcoding color values directly. Prefer Tailwind's built-in classes (`bg-white`, `text-gray-700`) so they can be systematically overridden with `dark:` variants later.

---

*End of design system documentation. All values verified against actual source files.*
