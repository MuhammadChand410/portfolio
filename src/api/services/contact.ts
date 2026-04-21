import api from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";

export const sendContactMessage = async (name: string, email: string, subject: string, message: string) => {
  const response = await api.post(API_ENDPOINTS.CONTACT.SEND, { name, email, subject, message });
  return response.data;
};

export const getContactQueries = async (page?: number, status?: string) => {
  const response = await api.get(API_ENDPOINTS.CONTACT.GET_ALL, {
    params: {
      ...(page ? { page } : {}),
      ...(status ? { status } : {}),
    },
  });
  return response.data;
};

export const searchContactQueries = async (term: string) => {
  const response = await api.get(API_ENDPOINTS.CONTACT.SEARCH(term));
  return response.data;
};

export const markContactRead = async (id: number) => {
  const response = await api.post(API_ENDPOINTS.CONTACT.MARK_READ(id));
  return response.data;
};

export const markAllContactRead = async () => {
  const response = await api.post(API_ENDPOINTS.CONTACT.MARK_ALLREAD);
  return response.data;
};

export const deleteContactQuery = async (id: number) => {
  await api.delete(API_ENDPOINTS.CONTACT.DELETE(id));
};
