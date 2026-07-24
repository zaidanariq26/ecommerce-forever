import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import axios from "axios";
import { BACKEND_URL, CURRENCY, FRONTEND_URL } from "../constants";
import useThemeStore from "../zustand/themeStore";

const Navbar = ({ setToken, token, onMenuToggle }) => {
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const dark = useThemeStore((s) => s.dark);
  const toggleTheme = useThemeStore((s) => s.toggle);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axios.post(BACKEND_URL + "/api/order/list", {}, { headers: { token } }),
          axios.get(BACKEND_URL + "/api/product/list"),
        ]);
        if (ordersRes.data.success) {
          const pending = ordersRes.data.orders
            .filter((o) => o.status !== "Delivered")
            .sort((a, b) => b.date - a.date)
            .slice(0, 10);
          setPendingOrders(pending);
        }
        if (productsRes.data.success) {
          const lowStock = productsRes.data.products
            .filter((p) => p.stock <= 5)
            .sort((a, b) => a.stock - b.stock)
            .slice(0, 10);
          setLowStockProducts(lowStock);
        }
      } catch {
        // silently fail
      }
    };
    fetchData();
  }, [token]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close dropdowns on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setUserOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const notifCount = pendingOrders.length + lowStockProducts.length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 sm:px-[4%]">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          aria-label="Toggle menu"
          className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
        >
          <Icon icon="solar:hamburger-menu-outline" className="text-xl" />
        </button>
        <img
          className="w-[max(10%,80px)]"
          src={assets.logo}
          alt="Forever Store admin"
        />
        <span className="hidden text-sm font-semibold text-gray-800 dark:text-gray-200 sm:inline">
          Admin Panel
        </span>
      </div>

      {/* Center: Greeting + Stats */}
      <div className="hidden items-center gap-4 md:flex">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {getGreeting()},{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">Admin</span>
        </p>
        {pendingOrders.length > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <Icon icon="solar:clock-outline" className="text-sm" />
            {pendingOrders.length} pending
          </span>
        )}
        {lowStockProducts.length > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <Icon icon="solar:danger-outline" className="text-sm" />
            {lowStockProducts.length} low stock
          </span>
        )}
      </div>

      {/* Right: Theme Toggle + Notification Bell + User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <Icon icon={dark ? "solar:sun-outline" : "solar:moon-outline"} className="text-lg" />
        </button>
        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setUserOpen(false);
            }}
            aria-label="Notifications"
            className="relative flex size-9 cursor-pointer items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Icon icon="solar:bell-outline" className="text-lg" />
            {notifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="fixed left-4 right-4 top-16 z-50 max-h-[70vh] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 sm:fixed-auto">
              <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Notifications</p>
              </div>

              {/* Pending Orders */}
              {pendingOrders.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                    Pending Orders
                  </p>
                  {pendingOrders.map((order) => (
                    <button
                      key={order._id}
                      onClick={() => {
                        navigate("/orders");
                        setNotifOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                        <Icon icon="solar:bag-outline" className="text-sm text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-gray-700 dark:text-gray-300">
                          {order.items.map((i) => i.name).join(", ")}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {order.status} — {CURRENCY}
                          {order.amount.toFixed(2)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Low Stock */}
              {lowStockProducts.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                    Low Stock
                  </p>
                  {lowStockProducts.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => {
                        navigate("/list");
                        setNotifOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <Icon icon="solar:danger-outline" className="text-sm text-red-600 dark:text-red-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-gray-700 dark:text-gray-300">{product.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {product.stock <= 0 ? "Out of stock" : `${product.stock} left`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {pendingOrders.length === 0 && lowStockProducts.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <Icon icon="solar:check-circle-outline" className="mx-auto mb-2 text-3xl text-green-500" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">All caught up!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => {
              setUserOpen((prev) => !prev);
              setNotifOpen(false);
            }}
            aria-label="User menu"
            className="flex items-center gap-2 cursor-pointer rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-gray-800 text-xs font-semibold text-white dark:bg-gray-600">
              AD
            </div>
            <Icon
              icon="solar:alt-arrow-down-outline"
              className="hidden text-sm text-gray-500 dark:text-gray-400 sm:block"
            />
          </button>

          {/* User Dropdown */}
          {userOpen && (
            <div className="fixed left-4 right-4 top-16 z-50 max-h-[70vh] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-56 sm:fixed-auto">
              <div className="border-b border-gray-100 dark:border-gray-700 px-4 py-3">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Admin</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Administrator</p>
              </div>
              <div className="py-1">
                <a
                  href={FRONTEND_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Icon icon="solar:external-link-outline" className="text-base" />
                  View Storefront
                </a>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                <button
                  onClick={() => setToken("")}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <Icon icon="solar:logout-outline" className="text-base" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
