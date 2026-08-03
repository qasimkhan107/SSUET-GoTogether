import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaCheckDouble,
} from "react-icons/fa";
import { useNotifications } from "../../context/NotificationContext";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    setCount,
    fetchNotificationCount,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");

      if (res.data.success) {
        setNotifications(res.data.notifications);

        // Update bell count
        const unread = res.data.notifications.filter(
          (n) => !n.isRead
        ).length;

        setCount(unread);
      }
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id
            ? { ...n, isRead: true }
            : n
        )
      );

      fetchNotificationCount();

      toast.success("Notification marked as read");
    } catch {
      toast.error("Failed");
    }
  };

  const markAllRead = async () => {
    try {
      await API.put("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: true,
        }))
      );

      setCount(0);

      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.filter((n) => n._id !== id)
      );

      fetchNotificationCount();

      toast.success("Notification deleted");
    } catch {
      toast.error("Failed");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <h1 className="text-3xl font-bold text-slate-800">
          Notifications
        </h1>

        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
          >
            <FaCheckDouble />
            Mark All Read
          </button>
        )}

      </div>

      {notifications.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
          <FaBell className="mx-auto text-6xl text-slate-300" />

          <h2 className="mt-5 text-2xl font-semibold">
            No Notifications
          </h2>

          <p className="mt-2 text-slate-500">
            You're all caught up.
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {notifications.map((notification) => (

            <div
              key={notification._id}
              className={`rounded-3xl border bg-white p-6 shadow transition ${
                !notification.isRead
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
            >

              <div className="flex items-start justify-between">

                <div className="flex gap-4">

                  <div
                    className={`mt-2 h-3 w-3 rounded-full ${
                      notification.isRead
                        ? "bg-gray-300"
                        : "bg-blue-600"
                    }`}
                  ></div>

                  <div>

                    <h2 className="text-xl font-bold">
                      {notification.title}
                    </h2>

                    <p className="mt-1 text-slate-600">
                      {notification.message}
                    </p>

                    <p className="mt-3 text-sm text-slate-400">
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

                <div className="flex gap-2">

                  {!notification.isRead && (
                    <button
                      onClick={() =>
                        markAsRead(notification._id)
                      }
                      className="rounded-xl bg-green-600 p-3 text-white hover:bg-green-700"
                    >
                      <FaCheck />
                    </button>
                  )}

                  <button
                    onClick={() =>
                      deleteNotification(notification._id)
                    }
                    className="rounded-xl bg-red-600 p-3 text-white hover:bg-red-700"
                  >
                    <FaTrash />
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}