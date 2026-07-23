import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";

const navItems = [
  { to: "/", label: "Dashboard", icon: "solar:home-outline" },
  { to: "/add", label: "Add Items", icon: "solar:add-circle-outline" },
  { to: "/list", label: "List Items", icon: "solar:document-text-outline" },
  { to: "/orders", label: "Orders", icon: "solar:bag-outline" },
  { to: "/coupons", label: "Coupons", icon: "solar:ticket-outline" },
];

const Sidebar = () => {
  return (
    <div className="min-h-screen w-56 border-r border-gray-200 bg-white py-6">
      <div className="flex flex-col gap-1 px-3">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            <Icon icon={icon} className="text-lg" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
