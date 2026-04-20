import { create } from "zustand";
import {
  getContactQueries,
  markContactRead,
  markAllContactRead,
  deleteContactQuery,
} from "@/src/api/services/contact";

export type ContactQuery = {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  date: string;
  created_at: string;
  status: "read" | "unread";
};

type ContactQueryStore = {
  queries: ContactQuery[];
  initialLoading: boolean;
  loading: boolean;
  error: string | null;
  search: string;
  filterRead: string;
  setSearch: (v: string) => void;
  setFilterRead: (v: string) => void;
  fetchQueries: () => Promise<void>;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteQuery: (id: number) => Promise<void>;
};

export const useContactQueryStore = create<ContactQueryStore>((set, get) => ({
  queries: [],
  initialLoading: true,
  loading: false,
  error: null,
  search: "",
  filterRead: "All",

  setSearch: (v) => set({ search: v }),
  setFilterRead: (v) => set({ filterRead: v }),

  fetchQueries: async () => {
    set((s) => s.queries.length === 0 ? { loading: true, initialLoading: true, error: null } : { loading: true, error: null });
    try {
      const data = await getContactQueries();
      const raw: any[] = Array.isArray(data) ? data : data.results ?? [];
      const queries = raw.map((q) => ({
        ...q,
        date: q.created_at,
        status: q.status ?? "unread",
      }));
      set({ queries, initialLoading: false });
    } catch {
      set({ error: "Failed to load queries.", initialLoading: false });
    } finally {
      set({ loading: false });
    }
  },

  markRead: async (id) => {
    set((s) => ({ queries: s.queries.map((q) => q.id === id ? { ...q, status: "read" as const } : q) }));
    try {
      const updated = await markContactRead(id);
      if (updated?.status) {
        set((s) => ({ queries: s.queries.map((q) => q.id === id ? { ...q, ...updated, date: updated.created_at } : q) }));
      }
    } catch { await get().fetchQueries(); }
  },

  markAllRead: async () => {
    set((s) => ({ queries: s.queries.map((q) => ({ ...q, status: "read" as const })) }));
    try { await markAllContactRead(); } catch { await get().fetchQueries(); }
  },

  deleteQuery: async (id) => {
    await deleteContactQuery(id);
    set((s) => ({ queries: s.queries.filter((q) => q.id !== id) }));
  },
}));
