import api from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";

export const getNotifications = async () => {
  const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.GET_ALL);
  return response.data;
};

export const markNotificationRead = async (id: number) => {
  const response = await api.post(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALLREAD);
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.GET_UNREAD_COUNT);
  return response.data;
};
