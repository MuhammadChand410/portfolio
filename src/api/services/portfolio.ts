import api from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";

export const getPortfolios = async (search?: string) => {
  const response = await api.get(API_ENDPOINTS.PORTFOLIO.GET_ALL, {
    params: search ? { search } : undefined,
  });
  return response.data;
};

function toFormData(data: Record<string, string | File>) {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => fd.append(k, v));
  return fd;
}

export const createPortfolio = async (data: Record<string, string | File>) => {
  const body = data.image instanceof File ? toFormData(data) : data;
  const response = await api.post(API_ENDPOINTS.PORTFOLIO.CREATE, body);
  return response.data;
};

export const updatePortfolio = async (id: number, data: Record<string, string | File>) => {
  const body = data.image instanceof File ? toFormData(data) : data;
  const response = await api.patch(API_ENDPOINTS.PORTFOLIO.UPDATE(id), body);
  return response.data;
};

export const deletePortfolio = async (id: number) => {
  await api.delete(API_ENDPOINTS.PORTFOLIO.DELETE(id));
};

