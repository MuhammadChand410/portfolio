import { create } from "zustand";

export type RoleUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Revoked";
  added: string;
};

type RolesStore = {
  users: RoleUser[];
  loading: boolean;
  search: string;
  filterRole: string;
  filterStatus: string;
  setUsers: (u: RoleUser[]) => void;
  setLoading: (v: boolean) => void;
  setSearch: (v: string) => void;
  setFilterRole: (v: string) => void;
  setFilterStatus: (v: string) => void;
  addUser: (u: RoleUser) => void;
  updateUser: (id: number, u: Partial<RoleUser>) => void;
  removeUser: (id: number) => void;
};

export const useRolesStore = create<RolesStore>((set) => ({
  users: [],
  loading: false,
  search: "",
  filterRole: "All Roles",
  filterStatus: "All Status",
  setUsers: (u) => set({ users: u }),
  setLoading: (v) => set({ loading: v }),
  setSearch: (v) => set({ search: v }),
  setFilterRole: (v) => set({ filterRole: v }),
  setFilterStatus: (v) => set({ filterStatus: v }),
  addUser: (u) => set((s) => ({ users: [...s.users, u] })),
  updateUser: (id, u) => set((s) => ({ users: s.users.map((x) => x.id === id ? { ...x, ...u } : x) })),
  removeUser: (id) => set((s) => ({ users: s.users.filter((x) => x.id !== id) })),
}));
