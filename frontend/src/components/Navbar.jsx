import { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { Icon } from "@iconify/react";
import { navLinks } from "../constant";
import useAuthStore from "../zustand/authStore";
import useWishlistStore from "../zustand/wishlistStore";

const Navbar = () => {
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, navigate } = useContext(ShopContext);
  const currentPath = useLocation().pathname;
  const { wishlist, fetchWishlist, resetWishlist } = useWishlistStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    resetWishlist();
    window.location.replace("/login");
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between border-b border-gray-300 py-5 font-medium">
      {/* Logo */}
      <div className="flex flex-1">
        <Link to="/">
          <img src={assets.logo} className="w-28 sm:w-36" alt="Forever logo" />
        </Link>
      </div>

      {/* Nav Link */}
      <ul className="hidden shrink-0 gap-5 text-sm text-gray-700 md:flex">
        {navLinks.map((navLink, index) => (
          <NavLink
            key={index}
            to={navLink.path}
            className="flex flex-col items-center gap-1"
          >
            <p>{navLink.name.toUpperCase()}</p>
            <hr className="hidden h-[1.5px] w-2/4 border-none bg-gray-700" />
          </NavLink>
        ))}
      </ul>

      {/* Nav Actions */}
      <div className="flex flex-1 items-center justify-end gap-4 lg:gap-6">
        <button
          onClick={() => setShowSearch((prev) => (prev = !prev))}
          aria-label="Toggle search"
          className={
            currentPath === "/collection"
              ? "xs:text-[28px] block text-2xl text-gray-800"
              : "hidden"
          }
        >
          <Icon icon="si:search-line" cursor="pointer" />
        </button>

        <div className={isAuthenticated ? "relative" : "hidden"}>
          <button
            aria-label="Toggle user menu"
            onClick={() => {
              setUserMenuOpen((prev) => !prev);
            }}
            className="xs:text-[28px] block text-2xl text-gray-800"
          >
            <Icon icon="solar:user-outline" cursor="pointer" />
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 z-99 pt-4 transition-all duration-300 ease-in-out ${userMenuOpen ? "block" : "hidden"}`}
            ref={dropdownRef}
            onClick={() => {
              setUserMenuOpen((prev) => !prev);
            }}
          >
            <div className="flex w-36 flex-col gap-2 rounded bg-slate-100 px-5 py-3 text-gray-500">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer hover:text-black"
              >
                My Profile
              </p>
              <p
                onClick={() => navigate("/wishlist")}
                className="cursor-pointer hover:text-black"
              >
                Wishlist
              </p>
              <p
                onClick={() => navigate("/orders")}
                className="cursor-pointer hover:text-black"
              >
                Orders
              </p>
              <p
                onClick={handleLogout}
                className="cursor-pointer hover:text-black"
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/wishlist"
          className={isAuthenticated ? "xs:block relative hidden" : "hidden"}
        >
          <Icon
            icon="solar:heart-outline"
            className="xs:text-[28px] block text-2xl text-gray-800"
          />
          {wishlist.length > 0 && (
            <p className="xs:w-4 absolute -top-1 -right-1.25 aspect-square w-4 rounded-full bg-gray-900 text-center text-[8px] leading-4 text-white">
              {wishlist.length}
            </p>
          )}
        </Link>

        <Link
          to="/cart"
          className={isAuthenticated ? "relative block" : "hidden"}
        >
          <Icon
            icon="solar:cart-large-4-outline"
            className="xs:text-[28px] block text-2xl text-gray-800"
          />
          <p className="xs:w-4 absolute -top-1 -right-1.25 aspect-square w-4 rounded-full bg-gray-900 text-center text-[8px] leading-4 text-white">
            {getCartCount()}
          </p>
        </Link>

        {/* Login & Register Button */}
        <div className={isAuthenticated ? "hidden" : "hidden gap-2 sm:flex"}>
          <Link
            to="/login"
            className="border border-gray-900 bg-transparent px-4 py-2 text-sm font-normal text-gray-900 hover:bg-gray-100"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-normal text-gray-100 hover:bg-gray-800"
          >
            Register
          </Link>
        </div>

        <button
          onClick={() => setVisible(true)}
          aria-label="Open menu"
          className="xs:text-[28px] cursor-pointer text-2xl text-gray-800 md:hidden"
        >
          <Icon icon="solar:hamburger-menu-outline" />
        </button>
      </div>

      {/* Sidebar Menu For Small Fresa */}
      <div
        className={`absolute top-0 right-0 bottom-0 z-999 overflow-hidden bg-white transition-all ${
          visible ? "w-full " : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex cursor-pointer items-center gap-2 p-3"
          >
            <Icon icon="solar:alt-arrow-left-outline" height={22} />

            <p>Back</p>
          </div>

          <div className="divide-y divide-gray-300 border-t border-b border-gray-300">
            {navLinks.map((navLink, index) => (
              <NavLink
                key={index}
                className="block py-2 pl-6"
                onClick={() => setVisible(false)}
                to={navLink.path}
              >
                {navLink.name.toUpperCase()}
              </NavLink>
            ))}
            {isAuthenticated && (
              <NavLink
                className="block py-2 pl-6"
                onClick={() => setVisible(false)}
                to="/wishlist"
              >
                WISHLIST
              </NavLink>
            )}
          </div>

          {!isAuthenticated && (
            <div className="xs:flex-row xs:justify-center xs:items-center mt-6 flex flex-col gap-2 px-3 sm:hidden">
              <Link
                to="/login"
                onClick={() => setVisible(false)}
                className="border border-gray-900 bg-transparent px-4 py-2 text-center text-sm font-normal text-gray-900 hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setVisible(false)}
                className="border border-gray-900 bg-gray-900 px-4 py-2 text-center text-sm font-normal text-gray-100 hover:bg-gray-800"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
