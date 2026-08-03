import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import API from "../../services/api";
import {
  FaBars,
  FaBell,
  FaSearch,
  FaUserCircle,
  FaCog,
  FaCarSide,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Navbar({ toggleSidebar }) {
  const { user } = useAuth();
  const { count } = useNotifications();

  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notificationRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileRef = useRef(null);

  // Fetch latest notifications when dropdown opens
  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");

      if (res.data.success) {
        setNotifications(res.data.notifications.slice(0, 5));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(e.target)
    ) {
      setShowNotifications(false);
    }

    if (
      profileRef.current &&
      !profileRef.current.contains(e.target)
    ) {
      setShowProfileMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
}, []);

  return (
    <header className="sticky top-0 z-40 flex h-18 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">

      {/* Left */}
      <div className="flex items-center gap-4">

        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
        >
          <FaBars className="text-xl text-slate-700" />
        </button>

        <div className="hidden items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 md:flex">
          <FaSearch className="mr-3 text-slate-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-72 bg-transparent outline-none"
          />
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        {/* Notification Bell */}
        <div
          className="relative"
          ref={notificationRef}
        >
          <button
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
            className="relative rounded-xl p-2 transition hover:bg-slate-100"
          >
            <FaBell className="text-xl text-slate-700" />

            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

              <div className="border-b px-5 py-4">
                <h2 className="text-lg font-bold text-slate-800">
                  Notifications
                </h2>
              </div>

              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => {
                      navigate("/notifications");
                      setShowNotifications(false);
                    }}
                    className={`cursor-pointer border-b p-4 transition hover:bg-slate-50 ${
                      !notification.isRead
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    <h3 className="font-semibold text-slate-800">
                      {notification.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                ))
              )}

              <button
                onClick={() => {
                  navigate("/notifications");
                  setShowNotifications(false);
                }}
                className="w-full bg-slate-100 py-3 font-semibold text-blue-600 transition hover:bg-slate-200"
              >
                View All Notifications
              </button>

            </div>
          )}
        </div>

        {/* User */}
        {/* User */}
<div
  className="relative"
  ref={profileRef}
>
  <button
    onClick={() => setShowProfileMenu(!showProfileMenu)}
    className="flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-slate-100"
  >
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
      {user?.name?.charAt(0).toUpperCase()}
    </div>

    <div className="hidden text-left md:block">
      <h3 className="font-semibold text-slate-800">
        {user?.name}
      </h3>

      <p className="text-sm capitalize text-slate-500">
        {user?.role}
      </p>
    </div>
  </button>

  {showProfileMenu && (
  <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

    {/* User Card */}
    <div className="bg-blue-600 p-5 text-white">

      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl font-bold text-blue-600">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3 className="text-lg font-bold">
            {user?.name}
          </h3>

          <p className="text-sm text-blue-100">
            {user?.role}
          </p>

          <p className="text-xs text-blue-200">
            {user?.email}
          </p>
        </div>

      </div>

    </div>

    {/* Quick Actions */}

    <div className="p-2">

      <button
        onClick={() => {
          navigate("/profile");
          setShowProfileMenu(false);
        }}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100"
      >
        <FaUserCircle />
        My Profile
      </button>

      <button
        onClick={() => {
          navigate("/my-vehicle");
          setShowProfileMenu(false);
        }}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100"
      >
        <FaCarSide />
        My Vehicle
      </button>

      <button
        onClick={() => {
          navigate("/my-bookings");
          setShowProfileMenu(false);
        }}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100"
      >
        📅
        My Bookings
      </button>

      <button
        onClick={() => {
          navigate("/notifications");
          setShowProfileMenu(false);
        }}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100"
      >
        <FaBell />
        Notifications
      </button>

      <button
        onClick={() => {
          navigate("/settings");
          setShowProfileMenu(false);
        }}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100"
      >
        <FaCog />
        Settings
      </button>

    </div>

    <hr />

    {/* Logout */}

    <div className="p-2">

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-red-600 transition hover:bg-red-50"
      >
        <FaSignOutAlt />
        Logout
      </button>

    </div>

  </div>
)}
</div>

      </div>

    </header>
  );
}