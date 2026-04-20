import api from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";

export const getRoles = async () => {
  const response = await api.get(API_ENDPOINTS.ROLES.GET_ALL);
  return response.data;
};

export const createRole = async (data: Record<string, string>) => {
  const response = await api.post(API_ENDPOINTS.ROLES.CREATE, data);
  return response.data;
};

export const updateRole = async (id: number, data: Record<string, string>) => {
  const response = await api.patch(API_ENDPOINTS.ROLES.UPDATE(id), data);
  return response.data;
};

export const deleteRole = async (id: number) => {
  await api.delete(API_ENDPOINTS.ROLES.DELETE(id));
};

export const revokeRole = async (id: number) => {
  const response = await api.patch(API_ENDPOINTS.ROLES.UPDATE(id), { status: "revoked" });
  return response.data;
};

export const activateRole = async (id: number) => {
  const response = await api.patch(API_ENDPOINTS.ROLES.UPDATE(id), { status: "active" });
  return response.data;
};
