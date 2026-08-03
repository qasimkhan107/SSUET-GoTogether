import Notification from "../models/Notification.js";

const createNotification = async ({
  receiver,
  sender,
  type,
  title,
  message,
}) => {
  try {
    await Notification.create({
      receiver,
      sender,
      type,
      title,
      message,
    });
  } catch (error) {
    console.log("Notification Error:", error.message);
  }
};

export default createNotification;