import {
  FaBars,
  FaBell,
  FaUser,
  FaCog,
  FaLock,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [pendingCount, setPendingCount] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const fetchPendingCount = async () => {
    try {
      const res = await API.get(
        "/admin/verifications/pending-count"
      );

      if (res.data.success) {
        setPendingCount(res.data.count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPendingCount();

    const interval = setInterval(() => {
      fetchPendingCount();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(e.target)
    ) {
      setShowProfile(false);
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

        <h1 className="text-2xl font-bold text-slate-800">
          Admin Dashboard
        </h1>

      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        {/* Notification Bell */}
        <button
          onClick={() => navigate("/admin/notifications")}
          className="relative rounded-xl p-2 transition hover:bg-slate-100"
        >
          <FaBell className="text-xl text-slate-700" />

          {pendingCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
              {pendingCount > 99 ? "99+" : pendingCount}
            </span>
          )}
        </button>

        {/* Profile */}
<div
  ref={profileRef}
  className="relative"
>
  <button
    onClick={() => setShowProfile(!showProfile)}
    className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-100"
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

    <FaChevronDown className="hidden text-slate-500 md:block" />
  </button>

  {showProfile && (
    <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

      <div className="border-b px-5 py-4">
        <h3 className="font-bold">
          {user?.name}
        </h3>

        <p className="text-sm text-slate-500">
          {user?.role}
        </p>
      </div>

      <button
        onClick={() => {
          navigate("/admin/profile");
          setShowProfile(false);
        }}
        className="flex w-full items-center gap-3 px-5 py-3 hover:bg-slate-100"
      >
        <FaUser />
        My Profile
      </button>

      <button
        onClick={() => {
          navigate("/admin/settings");
          setShowProfile(false);
        }}
        className="flex w-full items-center gap-3 px-5 py-3 hover:bg-slate-100"
      >
        <FaCog />
        Settings
      </button>

      <hr />

      <button
  onClick={() => {
    navigate("/admin/change-password");
    setShowProfile(false);
  }}
  className="flex w-full items-center gap-3 px-5 py-3 hover:bg-slate-100"
>
  <FaLock />
  Change Password
</button>

<hr />

      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="flex w-full items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50"
      >
        <FaSignOutAlt />
        Logout
      </button>

    </div>
  )}
</div>

      </div>

    </header>
  );
}