# Ecommerce Forever

Ecommerce Forever is a full-stack fashion ecommerce project with three separate applications in one repository:

- `frontend` - customer storefront for browsing products, managing cart items, checkout, and viewing orders.
- `admin` - admin dashboard for managing products and customer orders.
- `backend` - Express API for authentication, products, cart, orders, image uploads, and payments.

## Project Overview

This project is being developed as a MERN-style ecommerce platform for clothing products. Customers can explore collections, filter products, select sizes, add items to a cart, place orders, and pay with Cash on Delivery, Stripe, or Razorpay. Admin users can log in to a separate dashboard, upload products with images, remove products, view orders, and update order delivery status.

## Main Features

### Customer Storefront

- Home page with hero, latest collections, best sellers, policies, and newsletter UI.
- Product collection page with search, category filters, subcategory filters, and price sorting.
- Product details page with image gallery, size selection, related products, and add-to-cart action.
- User authentication with login and signup.
- Persistent user cart connected to the backend when logged in.
- Checkout form with delivery information.
- Payment options for Cash on Delivery, Stripe Checkout, and Razorpay.
- Stripe and Razorpay payment verification flow.
- Customer order history and order tracking display.

### Admin Dashboard

- Admin login protected by JWT.
- Add products with name, description, price, category, subcategory, sizes, bestseller flag, and up to four images.
- Upload product images through the backend to Cloudinary.
- View all products and remove products.
- View all customer orders.
- Update order status through the admin panel.

### Backend API

- Express server with MongoDB connection through Mongoose.
- JWT authentication for users and admins.
- User registration and login.
- Product create, list, remove, and single-product endpoints.
- Cart add, update, and get endpoints.
- Order placement for COD, Stripe, and Razorpay.
- Payment verification endpoints.
- Cloudinary integration for product images.

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- React Toastify
- Tailwind CSS

### Admin

- React
- Vite
- React Router
- Axios
- React Toastify
- Tailwind CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt
- Multer
- Cloudinary
- Stripe
- Razorpay

## Folder Structure

```text
.
├── admin/      # Admin dashboard
├── backend/    # Express API server
└── frontend/   # Customer ecommerce storefront
```

## Environment Variables

Each app uses its own `.env` file. These files are intentionally ignored by Git because they can contain private keys and secrets.

### Frontend

```env
VITE_BACKEND_URL=your_backend_url
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Admin

```env
VITE_BACKEND_URL=your_backend_url
```

### Backend

```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
STRIPE_SECRET_KEY=your_stripe_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Running Locally

Install dependencies separately in each app folder.

```bash
cd backend
npm install
npm run server
```

```bash
cd frontend
npm install
npm run dev
```

```bash
cd admin
npm install
npm run dev
```

## Current Development Status

The project currently has the main ecommerce workflow in place: customer browsing, cart, checkout, payment flow, admin product management, and admin order management. The next likely improvements would be deployment setup, stronger validation, production-ready error handling, and polishing the customer/admin UI.
