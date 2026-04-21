import api from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";



export const getTestimonials = async (page?: number, status?: string) => {
  const response = await api.get(API_ENDPOINTS.TESTIMONIAL.GET_ALL, {
    params: {
      ...(page ? { page } : {}),
      ...(status ? { status } : {}),
    },
  });
  return response.data;
};

export const searchTestimonials = async (term: string) => {
  const response = await api.get(API_ENDPOINTS.TESTIMONIAL.SEARCH(term));
  return response.data;
};

export const createTestimonial = async (data: Record<string, string | number>) => {
  const response = await api.post(API_ENDPOINTS.TESTIMONIAL.CREATE, data);
  return response.data;
};

export const updateTestimonial = async (id: number, data: Record<string, string | number>) => {
  const response = await api.patch(API_ENDPOINTS.TESTIMONIAL.UPDATE(id), data);
  return response.data;
};

export const deleteTestimonial = async (id: number) => {
  await api.delete(API_ENDPOINTS.TESTIMONIAL.DELETE(id));
};
