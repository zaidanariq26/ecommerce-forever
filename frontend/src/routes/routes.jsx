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
import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";
import VerifyEmail from "../components/auth/VerifyEmail";
import Verify from "../pages/Verify";
import AuthLayout from "../pages/AuthLayout";

export const routes = [
  { path: "/", element: <Home />, title: "Home" },
  { path: "/collection", element: <Collection />, title: "Collection" },
  { path: "/about", element: <About />, title: "About Us" },
  { path: "/contact", element: <Contact />, title: "Contact" },
  { path: "/product/:productId", element: <Product /> },
  { path: "/cart", element: <Cart />, title: "Cart" },
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
  { path: "/place-order", element: <PlaceOrder />, title: "Place Order" },
  { path: "/orders", element: <Orders />, title: "My Orders" },
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
