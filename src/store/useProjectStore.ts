import { create } from "zustand";
import type { PaginationMeta } from "@/src/components/shared/Pagination";

export type Project = {
  id: number;
  title: string;
  category: string;
  tech: string[];
  status: "Live" | "In Progress" | "Archived";
  year: string;
  github: string;
  live: string;
  desc: string;
  image?: string;
};

type ProjectStore = {
  projects: Project[];
  pagination: PaginationMeta | null;
  loading: boolean;
  search: string;
  filterStatus: string;
  setProjects: (projects: Project[], pagination?: PaginationMeta) => void;
  setLoading: (v: boolean) => void;
  setSearch: (v: string) => void;
  setFilterStatus: (v: string) => void;
  addProject: (p: Project) => void;
  updateProject: (id: number, p: Project) => void;
  deleteProject: (id: number) => void;
};

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  pagination: null,
  loading: false,
  search: "",
  filterStatus: "All",
  setProjects: (projects, pagination) => set({ projects, ...(pagination ? { pagination } : {}) }),
  setLoading: (loading) => set({ loading }),
  setSearch: (v) => set({ search: v }),
  setFilterStatus: (v) => set({ filterStatus: v }),
  addProject: (p) => set((s) => ({ projects: [p, ...s.projects] })),
  updateProject: (id, p) => set((s) => ({ projects: s.projects.map((x) => (x.id === id ? p : x)) })),
  deleteProject: (id) => set((s) => ({ projects: s.projects.filter((x) => x.id !== id) })),
}));
