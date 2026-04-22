"use client";

import { useRef, useState } from "react";
import { useServiceStore, type Service } from "@/src/store/useServiceStore";
import useService from "@/src/api/hooks/useService";
import { useUserStore } from "@/src/store/useUserStore";
import Pagination from "@/src/components/shared/Pagination";
import { getServices, searchServices } from "@/src/api/services/service";

// Must match backend expected values exactly
const GRADIENTS: { label: string; key: string; from: string; to: string }[] = [
  { label: "Violet → Purple",  key: "violet_purple",  from: "#7c3aed", to: "#9333ea" },
  { label: "Pink → Rose",      key: "pink_rose",      from: "#ec4899", to: "#f43f5e" },
  { label: "Blue → Indigo",    key: "blue_indigo",    from: "#3b82f6", to: "#6366f1" },
];

function getGradient(key: string) {
  return GRADIENTS.find((g) => g.key === key) ?? GRADIENTS[0];
}

type ServiceForm = {
  title: string;
  description: string;
  featuresInput: string;
  color_gradient: string;
  visible: boolean;
};

const empty: ServiceForm = {
  title: "",
  description: "",
  featuresInput: "",
  color_gradient: "violet_purple",
  visible: true,
};

function toForm(s: Service): ServiceForm {
  return {
    title: s.title,
    description: s.description,
    featuresInput: (s.features ?? []).join(", "),
    color_gradient: s.color_gradient ?? "violet_purple",
    visible: s.visible,
  };
}

function ServiceModal({ form, setForm, onSave, onCancel, submitLabel }: {
  form: ServiceForm;
  setForm: (f: ServiceForm) => void;
  onSave: () => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const gradient = getGradient(form.color_gradient);
  const isValid = form.title.trim() && form.description.trim() && form.featuresInput.trim();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{submitLabel === "Add Service" ? "Add Service" : "Edit Service"}</h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all" />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none" />
          </div>

          {/* Features */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Features (Comma Separated)</label>
            <input value={form.featuresInput} onChange={(e) => setForm({ ...form, featuresInput: e.target.value })}
              placeholder="React & Next.js, Tailwind CSS"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all" />
          </div>

          {/* Color Gradient Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Color Gradient</label>
            <select value={form.color_gradient} onChange={(e) => setForm({ ...form, color_gradient: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all">
              {GRADIENTS.map((g) => (
                <option key={g.key} value={g.key}>{g.label}</option>
              ))}
            </select>
            {/* Live gradient preview bar */}
            <div className="h-1.5 rounded-full" style={{ background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})` }} />
          </div>

          {/* Visible toggle */}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setForm({ ...form, visible: !form.visible })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.visible ? "bg-violet-600" : "bg-gray-600"}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.visible ? "translate-x-6" : "translate-x-1"}`} />
            </button>
            <span className="text-sm text-gray-300">Visible on landing page</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button onClick={onSave} disabled={!isValid}
              className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition-colors">
              {submitLabel}
            </button>
            <button onClick={onCancel}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-3 rounded-xl text-sm font-medium transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminServicesView() {
  const { services, loading, search, setSearch , setServices, pagination } = useServiceStore();
  const { handleAdd, handleUpdate, handleDelete: apiDelete, handleToggleVisibility, fetchServices } = useService();
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceForm>(empty);
  const user = useUserStore((state) => state.user);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearch(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = value.trim() ? await searchServices(value) : await getServices();
        const raw = Array.isArray(data) ? data : data.results ?? [];
        setServices(
          raw.map((s: any) => ({
            id: s.id,
            title: s.title ?? "",
            description: s.description ?? "",
            features: Array.isArray(s.features)
              ? s.features
              : String(s.features ?? "").split(",").map((f: string) => f.trim()).filter(Boolean),
            color_gradient: s.color_gradient ?? "violet_purple",
            visible: s.visible ?? true,
          })),
          data.pagination ?? undefined
        );
      } catch {}
    }, 400);
  }

  const filtered = services;

  const openAdd = () => { setForm(empty); setSelected(null); setModal("add"); };
  const openEdit = (s: Service) => { setSelected(s); setForm(toForm(s)); setModal("edit"); };
  const openDelete = (s: Service) => { setSelected(s); setModal("delete"); };

  const handleSave = async () => {
    const payload = {
      title: form.title,
      description: form.description,
      features: form.featuresInput,
      color_gradient: form.color_gradient,
      visible: form.visible,
    };
    const ok = modal === "add"
      ? await handleAdd(payload)
      : modal === "edit" && selected
      ? await handleUpdate(selected.id, payload)
      : false;
    if (ok) setModal(null);
  };

  const handleDelete = async () => {
    if (selected) await apiDelete(selected.id);
    setModal(null);
  };

  if (loading) return <div className="flex items-center justify-center py-24 text-gray-400">Loading services...</div>;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search services..."
          className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 w-64" />
        <button onClick={openAdd} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Service
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Service</th>
                <th className="text-left px-5 py-3">Features</th>
                <th className="text-left px-5 py-3">Gradient</th>
                <th className="text-left px-5 py-3">Visible</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400 dark:text-gray-600">No services found</td></tr>
              )}
              {filtered.map((s) => {
                const g = getGradient(s.color_gradient);
                return (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex-shrink-0" style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }} />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{s.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(s.features ?? []).slice(0, 2).map((f) => (
                          <span key={f} className="text-xs bg-violet-950/60 text-violet-300 px-2 py-0.5 rounded border border-violet-800/50 truncate max-w-[120px]">{f}</span>
                        ))}
                        {(s.features ?? []).length > 2 && <span className="text-xs text-gray-400">+{(s.features ?? []).length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-16 h-4 rounded-full" style={{ background: `linear-gradient(to right, ${g.from}, ${g.to})` }} />
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleToggleVisibility(s.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${s.visible ? "bg-violet-600" : "bg-gray-600"}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${s.visible ? "translate-x-6" : "translate-x-1"}`} />
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(s)} title="Edit"
                          className="p-1.5 text-gray-400 hover:text-violet-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => openDelete(s)} title="Delete"
                          className={`${user?.role !== "super_admin" ? "hidden" : ""} p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-400 dark:text-gray-600">
            Showing {services.length}{pagination ? ` of ${pagination.total_count}` : ""} services
          </span>
          {pagination && <Pagination meta={pagination} onPageChange={(p) => fetchServices(p)} />}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <ServiceModal form={form} setForm={setForm} onSave={handleSave} onCancel={() => setModal(null)}
          submitLabel={modal === "add" ? "Add Service" : "Save Changes"} />
      )}

      {/* Delete Modal */}
      {modal === "delete" && selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Delete Service?</h2>
            <p className="text-gray-400 text-sm mb-6">Are you sure you want to delete <span className="text-white font-medium">"{selected.title}"</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">Delete</button>
              <button onClick={() => setModal(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2.5 rounded-xl text-sm transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
