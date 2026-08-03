import API from "./api";

export const getDashboardStats = async () => {
  const { data } = await API.get("/dashboard");
  return data;
};

export const getNotifications = async () => {
  const { data } = await API.get("/notifications");
  return data;
};