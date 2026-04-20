"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import FormField from "@/src/components/shared/FormField";
import { useRolesStore, type RoleUser } from "@/src/store/useRolesStore";
import useRoles from "@/src/api/hooks/useRoles";

const ROLES = [
  { label: "Support Staff", value: "support_staff" },
  { label: "Content Creator", value: "content_creator" },
  { label: "Developer", value: "developer" },
  { label: "Manager", value: "manager" },
  { label: "Super Admin", value: "super_admin" },
];

const STATUSES = [
  { label: "Active", value: "active" },
  { label: "Revoked", value: "revoked" },
];

type RoleForm = { name: string; email: string; role: string; status: string };

const rules = {
  name: { required: "Name is required" },
  email: { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } },
  role: { required: "Role is required" },
  status: { required: "Status is required" },
};

function UserFormModal({ defaultValues, onSave, onCancel, submitLabel }: {
  defaultValues: RoleForm;
  onSave: (data: RoleForm) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const { control, handleSubmit, formState: { errors, isValid, isDirty } } = useForm<RoleForm>({ defaultValues, mode: "onChange" });
  return (
    <form onSubmit={handleSubmit(onSave)} noValidate className="space-y-3">
      <Controller control={control} name="name" rules={rules.name}
        render={({ field }) => <FormField label="Name" value={field.value} onChange={field.onChange} error={errors.name?.message} />} />
      <Controller control={control} name="email" rules={rules.email}
        render={({ field }) => <FormField label="Email" type="email" value={field.value} onChange={field.onChange} error={errors.email?.message} />} />
      <Controller control={control} name="role" rules={rules.role}
        render={({ field }) => <FormField as="select" label="Role" value={field.value} onChange={field.onChange} error={errors.role?.message}
          options={ROLES.map((r) => ({ label: r.label, value: r.value }))} />} />
      <Controller control={control} name="status" rules={rules.status}
        render={({ field }) => <FormField as="select" label="Status" value={field.value} onChange={field.onChange} error={errors.status?.message}
          options={STATUSES.map((s) => ({ label: s.label, value: s.value }))} />} />
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={!isValid || !isDirty}
          className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg text-sm transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

type ModalType = "add" | "edit" | "view" | "delete" | "revoke" | null;

export default function AdminRolesView() {
  const { users, loading, search, filterRole, filterStatus, setSearch, setFilterRole, setFilterStatus } = useRolesStore();
  const { handleAdd, handleUpdate, handleDelete: apiDelete, handleRevoke, handleActivate } = useRoles();
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<RoleUser | null>(null);

const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "All Roles" || u.role === filterRole;
    const matchStatus = filterStatus === "All Status" || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const openAdd = () => { setSelected(null); setModal("add"); };
  const openEdit = (u: RoleUser) => { setSelected(u); setModal("edit"); };
  const openView = (u: RoleUser) => { setSelected(u); setModal("view"); };
  const openDelete = (u: RoleUser) => { setSelected(u); setModal("delete"); };
  const openRevoke = (u: RoleUser) => { setSelected(u); setModal("revoke"); };

  const handleSave = async (data: RoleForm) => {
    let ok = false;
    if (modal === "add") ok = await handleAdd(data);
    else if (modal === "edit" && selected) ok = await handleUpdate(selected.id, data);
    if (ok) setModal(null);
  };

  const handleDelete = async () => {
    if (selected) await apiDelete(selected.id);
    setModal(null);
  };

  const handleRevokeConfirm = async () => {
    if (!selected) return;
    if (selected.status === "Active") await handleRevoke(selected.id);
    else await handleActivate(selected.id);
    setModal(null);
  };

  const toggleStatus = async (u: RoleUser) => {
    if (u.status === "Active") await handleRevoke(u.id);
    else await handleActivate(u.id);
  };

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  };

  const getRoleLabel = (value: string) => ROLES.find((r) => r.value === value)?.label ?? value;

  const getDefaultValues = (u?: RoleUser | null): RoleForm => ({
    name: u?.name ?? "", email: u?.email ?? "", role: u?.role ?? ROLES[0].value,
    status: u?.status ? u.status.toLowerCase() : "active",
  });

  if (loading) return <div className="flex items-center justify-center py-24 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3 flex-1 items-center">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..."
            className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 w-64" />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
            className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-violet-500">
            <option value="All Roles">All Roles</option>
            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-violet-500">
            {["All Status", "Active", "Revoked"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Added</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400 dark:text-gray-600">No users found</td></tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">{u.name}</td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2.5 py-1 rounded-full border bg-violet-900/40 text-violet-400 border-violet-800">
                      {getRoleLabel(u.role)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleStatus(u)}
                      className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer transition-opacity hover:opacity-70 ${u.status === "Active" ? "bg-emerald-900/40 text-emerald-400 border-emerald-800" : "bg-red-900/40 text-red-400 border-red-800"}`}>
                      {u.status}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-gray-400 dark:text-gray-500 text-xs whitespace-nowrap">{formatDate(u.added)}</td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* View */}
                      <button onClick={() => openView(u)} title="View"
                        className="p-1.5 text-gray-400 hover:text-cyan-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      {/* Edit */}
                      <button onClick={() => openEdit(u)} title="Edit"
                        className="p-1.5 text-gray-400 hover:text-violet-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      {/* Revoke / Activate */}
                      <button onClick={() => openRevoke(u)} title={u.status === "Active" ? "Revoke" : "Activate"}
                        className={`p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors ${u.status === "Active" ? "text-gray-400 hover:text-amber-500" : "text-gray-400 hover:text-emerald-500"}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {u.status === "Active"
                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        </svg>
                      </button>
                      {/* Delete */}
                      <button onClick={() => openDelete(u)} title="Delete"
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-600">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>

            {/* View */}
            {modal === "view" && selected && (
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selected.name}</h2>
                    <p className="text-violet-400 text-sm">{selected.email}</p>
                  </div>
                  <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Role</span>
                    <span className="text-xs px-2.5 py-1 rounded-full border bg-violet-900/40 text-violet-400 border-violet-800">{getRoleLabel(selected.role)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${selected.status === "Active" ? "bg-emerald-900/40 text-emerald-400 border-emerald-800" : "bg-red-900/40 text-red-400 border-red-800"}`}>{selected.status}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Added</span>
                    <span className="text-gray-300 dark:text-gray-400">{formatDate(selected.added)}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => openEdit(selected)} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-2 rounded-lg text-sm font-medium transition-colors">Edit</button>
                  <button onClick={() => setModal(null)} className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg text-sm transition-colors">Close</button>
                </div>
              </div>
            )}

            {/* Add / Edit */}
            {(modal === "add" || modal === "edit") && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{modal === "add" ? "Add User" : "Edit User"}</h2>
                  <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <UserFormModal
                  defaultValues={getDefaultValues(selected)}
                  onSave={handleSave}
                  onCancel={() => setModal(null)}
                  submitLabel={modal === "add" ? "Add User" : "Save Changes"}
                />
              </div>
            )}

            {/* Revoke / Activate confirm */}
            {modal === "revoke" && selected && (
              <div className="p-6 text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${selected.status === "Active" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"}`}>
                  <svg className={`w-7 h-7 ${selected.status === "Active" ? "text-amber-500 dark:text-amber-400" : "text-emerald-500 dark:text-emerald-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {selected.status === "Active"
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {selected.status === "Active" ? "Revoke Access?" : "Activate Access?"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  {selected.status === "Active"
                    ? <>Revoke access for <span className="text-gray-900 dark:text-white font-medium">{selected.name}</span>? They will no longer be able to access the system.</>
                    : <>Restore access for <span className="text-gray-900 dark:text-white font-medium">{selected.name}</span>?</>}
                </p>
                <div className="flex gap-3">
                  <button onClick={handleRevokeConfirm}
                    className={`flex-1 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors ${selected.status === "Active" ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"}`}>
                    {selected.status === "Active" ? "Revoke" : "Activate"}
                  </button>
                  <button onClick={() => setModal(null)}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg text-sm transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Delete confirm */}
            {modal === "delete" && selected && (
              <div className="p-6 text-center">
                <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Remove User?</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Remove <span className="text-gray-900 dark:text-white font-medium">{selected.name}</span> from roles? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">Remove</button>
                  <button onClick={() => setModal(null)} className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg text-sm transition-colors">Cancel</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
