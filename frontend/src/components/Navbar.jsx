import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { Icon } from "@iconify/react";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const currentPath = useLocation().pathname;

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "COLLECTION", path: "/collection" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

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

  return (
    <div className="flex items-center justify-between border-b border-gray-300 py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} className="w-28 sm:w-36" alt="" />
      </Link>

      <ul className="hidden gap-5 text-sm text-gray-700 md:flex">
        {navLinks.map((navLink, index) => (
          <NavLink
            key={index}
            to={navLink.path}
            className="flex flex-col items-center gap-1"
          >
            <p>{navLink.name}</p>
            <hr className="hidden h-[1.5px] w-2/4 border-none bg-gray-700" />
          </NavLink>
        ))}
      </ul>

      <div className="flex items-center gap-6">
        <Icon
          onClick={() => setShowSearch((prev) => (prev = !prev))}
          icon="si:search-line"
          height={28}
          className={
            currentPath === "/collection" ? "block text-gray-800" : "hidden"
          }
          cursor="pointer"
        />

        <div className="group relative">
          <Icon
            onClick={() => (token ? null : navigate("/login"))}
            icon="solar:user-outline"
            height={28}
            className="text-gray-800"
            cursor="pointer"
          />
          {/* Dropdown Menu */}
          {token && (
            <div className="dropdown-menu absolute right-0 hidden pt-4 group-hover:block">
              <div className="flex w-36 flex-col gap-2 rounded bg-slate-100 px-5 py-3 text-gray-500">
                <p className="cursor-pointer hover:text-black">My Profile</p>
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <Icon
            icon="solar:cart-large-4-outline"
            height={30}
            className="text-gray-800"
          />
          <p className="absolute -top-1 -right-1.25 aspect-square w-4 rounded-full bg-black text-center text-[8px] leading-4 text-white">
            {getCartCount()}
          </p>
        </Link>

        <img
          src={assets.menu_icon}
          onClick={() => setVisible(true)}
          className="w-5 cursor-pointer md:hidden"
          alt=""
        />
      </div>

      {/* Sidebar Menu For Small Fresa */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
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
                {navLink.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
