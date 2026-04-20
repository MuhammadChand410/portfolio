import { create } from "zustand";

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
  loading: boolean;
  search: string;
  filterStatus: string;
  setProjects: (projects: Project[]) => void;
  setLoading: (v: boolean) => void;
  setSearch: (v: string) => void;
  setFilterStatus: (v: string) => void;
  addProject: (p: Project) => void;
  updateProject: (id: number, p: Project) => void;
  deleteProject: (id: number) => void;
};

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  loading: false,
  search: "",
  filterStatus: "All",
  setProjects: (projects) => set({ projects }),
  setLoading: (loading) => set({ loading }),
  setSearch: (v) => set({ search: v }),
  setFilterStatus: (v) => set({ filterStatus: v }),
  addProject: (p) => set((s) => ({ projects: [p, ...s.projects] })),
  updateProject: (id, p) => set((s) => ({ projects: s.projects.map((x) => (x.id === id ? p : x)) })),
  deleteProject: (id) => set((s) => ({ projects: s.projects.filter((x) => x.id !== id) })),
}));
