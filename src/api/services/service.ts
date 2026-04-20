import api from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";

export const getServices = async () => {
  const response = await api.get(API_ENDPOINTS.SERVICES.GET_ALL);
  return response.data;
};

export const createService = async (data: Record<string, any>) => {
  const response = await api.post(API_ENDPOINTS.SERVICES.CREATE, data);
  return response.data;
};

export const updateService = async (id: number, data: Record<string, any>) => {
  const response = await api.patch(API_ENDPOINTS.SERVICES.UPDATE(id), data);
  return response.data;
};

export const deleteService = async (id: number) => {
  await api.delete(API_ENDPOINTS.SERVICES.DELETE(id));
};
