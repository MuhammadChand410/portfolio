import { create } from "zustand";
import type { PaginationMeta } from "@/src/components/shared/Pagination";

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  status: "Published" | "Hidden";
};

type TestimonialStore = {
  testimonials: Testimonial[];
  pagination: PaginationMeta | null;
  loading: boolean;
  search: string;
  filterStatus: string;
  setTestimonials: (t: Testimonial[], pagination?: PaginationMeta) => void;
  setLoading: (v: boolean) => void;
  setSearch: (v: string) => void;
  setFilterStatus: (v: string) => void;
  addTestimonial: (t: Omit<Testimonial, "id">) => void;
  updateTestimonial: (id: number, t: Omit<Testimonial, "id">) => void;
  deleteTestimonial: (id: number) => void;
  toggleStatus: (id: number) => void;
};

export const useTestimonialStore = create<TestimonialStore>((set) => ({
  testimonials: [],
  pagination: null,
  loading: false,
  search: "",
  filterStatus: "All",
  setTestimonials: (t, pagination) => set({ testimonials: t, ...(pagination ? { pagination } : {}) }),
  setLoading: (v) => set({ loading: v }),
  setSearch: (v) => set({ search: v }),
  setFilterStatus: (v) => set({ filterStatus: v }),
  addTestimonial: (t) =>
    set((s) => ({ testimonials: [...s.testimonials, { ...t, id: Date.now() }] })),
  updateTestimonial: (id, t) =>
    set((s) => ({ testimonials: s.testimonials.map((x) => (x.id === id ? { ...t, id } : x)) })),
  deleteTestimonial: (id) =>
    set((s) => ({ testimonials: s.testimonials.filter((x) => x.id !== id) })),
  toggleStatus: (id) =>
    set((s) => ({
      testimonials: s.testimonials.map((x) =>
        x.id === id ? { ...x, status: x.status === "Published" ? "Hidden" : "Published" } : x
      ),
    })),
}));
