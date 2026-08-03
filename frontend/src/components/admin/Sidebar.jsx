import { NavLink } from "react-router-dom";
import {
  FaUserShield,
  FaChartBar,
  FaUserCheck,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { FaCarSide } from "react-icons/fa";

export default function Sidebar() {
  const { logout, user } = useAuth();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaChartBar />,
      path: "/admin/dashboard",
    },
    {
      title: "Verifications",
      icon: <FaUserCheck />,
      path: "/admin/verifications",
    },
    {
      title: "Users",
      icon: <FaUsers />,
      path: "/admin/users",
    },

    {
      title: "Rides",
      icon: <FaCarSide />,
      path: "/admin/rides",
    },

  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside className="flex h-full w-72 flex-col bg-slate-900 text-white shadow-2xl">

      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-700 px-6 py-6">

        <div className="rounded-xl bg-blue-600 p-3">
          <FaUserShield className="text-2xl" />
        </div>

        <div>
          <h1 className="text-xl font-bold">
            Admin Panel
          </h1>

          <p className="text-xs text-slate-400">
            SSUET GoTogether
          </p>
        </div>

      </div>

      {/* Admin Info */}
      <div className="border-b border-slate-700 px-6 py-5">

        <h3 className="font-semibold">
          {user?.name}
        </h3>

        <p className="text-sm capitalize text-slate-400">
          {user?.role}
        </p>

      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-5">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `mb-2 flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.title}
            </span>
          </NavLink>
        ))}

      </nav>

      {/* Logout */}
      <div className="border-t border-slate-700 p-4">

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-4 py-3 font-semibold transition hover:bg-red-700"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </aside>
  );
}