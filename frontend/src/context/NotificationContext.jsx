import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [count, setCount] = useState(0);

  const fetchNotificationCount = async () => {
    try {
      const res = await API.get("/notifications");

      if (res.data.success) {
        const unread = res.data.notifications.filter(
          (n) => !n.isRead
        ).length;

        setCount(unread);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotificationCount();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        count,
        setCount,
        fetchNotificationCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () =>
  useContext(NotificationContext);