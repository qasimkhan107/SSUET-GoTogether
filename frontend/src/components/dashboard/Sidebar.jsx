import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  FaCarSide,
  FaHome,
  FaUser,
  FaIdCard,
  FaCar,
  FaPlusCircle,
  FaClipboardList,
  FaSearch,
  FaRoad,
  FaBell,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { logout, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
  fetchNotifications();
}, []);

const fetchNotifications = async () => {
  try {
    const res = await API.get("/notifications");

    if (res.data.success) {
      const unread = res.data.notifications.filter(
        (n) => !n.isRead
      ).length;

      setUnreadCount(unread);
    }
  } catch (error) {
    console.log(error);
  }
};

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
    },
    {
      title: "My Profile",
      icon: <FaUser />,
      path: "/profile",
    },
    {
      title: "Verification",
      icon: <FaIdCard />,
      path: "/verification",
    },
    {
      title: "My Vehicle",
      icon: <FaCar />,
      path: "/vehicle",
    },
    {
      title: "Publish Ride",
      icon: <FaPlusCircle />,
      path: "/rides/create",
    },
    {
      title: "Find Ride",
      icon: <FaSearch />,
      path: "/rides",
    },
    {
      title: "My Rides",
      icon: <FaRoad />,
      path: "/my-rides",
    },
    {
      title: "My Bookings",
      icon: <FaClipboardList />,
      path: "/my-bookings",
    },
    {
      title: "Notifications",
      icon: <FaBell />,
      path: "/notifications",
    },
    {
      title: "Settings",
      icon: <FaCog />,
      path: "/settings",
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
          <FaCarSide className="text-2xl" />
        </div>

        <div>
          <h1 className="text-xl font-bold">
            GoTogether
          </h1>

          <p className="text-xs text-slate-400">
            SSUET Carpool
          </p>
        </div>

      </div>

      {/* User */}

      <div className="border-b border-slate-700 px-6 py-5">

        <h3 className="font-semibold">
          {user?.name}
        </h3>

        <p className="text-sm text-slate-400">
          {user?.role}
        </p>

      </div>

      {/* Menu */}

      <nav className="flex-1 overflow-y-auto px-4 py-5">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/rides"}
            className={({ isActive }) =>
              `mb-2 flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <div className="relative">
  <span className="text-lg">
    {item.icon}
  </span>

  {item.title === "Notifications" && unreadCount > 0 && (
    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
      {unreadCount}
    </span>
  )}
</div>

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