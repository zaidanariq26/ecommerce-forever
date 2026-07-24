import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";

const navItems = [
  { to: "/", label: "Dashboard", icon: "solar:home-outline" },
  { to: "/add", label: "Add Items", icon: "solar:add-circle-outline" },
  { to: "/list", label: "List Items", icon: "solar:document-text-outline" },
  { to: "/orders", label: "Orders", icon: "solar:bag-outline" },
  { to: "/coupons", label: "Coupons", icon: "solar:ticket-outline" },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop — mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between px-4 pt-4 lg:hidden">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Menu</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Icon icon="solar:close-outline" className="text-lg" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 px-3 pt-4 lg:pt-6">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                }`
              }
            >
              <Icon icon={icon} className="text-lg flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
