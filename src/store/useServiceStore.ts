import { create } from "zustand";
import type { PaginationMeta } from "@/src/components/shared/Pagination";

export type Service = {
  id: number;
  title: string;
  description: string;
  features: string[];
  color_gradient: string;
  visible: boolean;
};

type ServiceStore = {
  loading: boolean;
  search: string;
  services: Service[];
  pagination: PaginationMeta | null;
  setServices: (s: Service[], pagination?: PaginationMeta) => void;
  setLoading: (v: boolean) => void;
  setSearch: (v: string) => void;
  addService: (s: Service) => void;
  updateService: (id: number, s: Service) => void;
  deleteService: (id: number) => void;
};

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  pagination: null,
  loading: false,
  search: "",
  setServices: (services, pagination) => set({ services, ...(pagination ? { pagination } : {}) }),
  setLoading: (loading) => set({ loading }),
  setSearch: (v) => set({ search: v }),
  addService: (s) => set((state) => ({ services: [s, ...state.services] })),
  updateService: (id, s) => set((state) => ({ services: state.services.map((x) => (x.id === id ? s : x)) })),
  deleteService: (id) => set((state) => ({ services: state.services.filter((x) => x.id !== id) })),
}));
