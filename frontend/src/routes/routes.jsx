import Home from "../pages/Home";
import Collection from "../pages/Collection";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Product from "../pages/Product";
import Cart from "../pages/Cart";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import PlaceOrder from "../pages/PlaceOrder";
import Orders from "../pages/Orders";
import Wishlist from "../pages/Wishlist";
import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";
import VerifyEmail from "../components/auth/VerifyEmail";
import Verify from "../pages/Verify";
import AuthLayout from "../pages/AuthLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export const routes = [
  { path: "/", element: <Home />, title: "Home" },
  { path: "/collection", element: <Collection />, title: "Collection" },
  { path: "/about", element: <About />, title: "About Us" },
  { path: "/contact", element: <Contact />, title: "Contact" },
  { path: "/product/:productId", element: <Product /> },
  {
    path: "/cart",
    element: <ProtectedRoute><Cart /></ProtectedRoute>,
    title: "Cart",
  },
  {
    path: "/login",
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
    title: "Login",
  },
  {
    path: "/register",
    element: (
      <AuthLayout>
        <Register />
      </AuthLayout>
    ),
    title: "Register",
  },
  {
    path: "/place-order",
    element: <ProtectedRoute><PlaceOrder /></ProtectedRoute>,
    title: "Place Order",
  },
  {
    path: "/orders",
    element: <ProtectedRoute><Orders /></ProtectedRoute>,
    title: "My Orders",
  },
  {
    path: "/wishlist",
    element: <ProtectedRoute><Wishlist /></ProtectedRoute>,
    title: "Wishlist",
  },
  {
    path: "/forgot-password",
    element: (
      <AuthLayout>
        <ForgotPassword />
      </AuthLayout>
    ),
    title: "Forgot Password",
  },
  {
    path: "/reset-password",
    element: (
      <AuthLayout>
        <ResetPassword />
      </AuthLayout>
    ),
    title: "Reset Password",
  },
  {
    path: "/verify-email",
    element: (
      <AuthLayout>
        <VerifyEmail />
      </AuthLayout>
    ),
    title: "Verify Email",
  },
  { path: "/verify", element: <Verify />, title: "Verify" },
];
