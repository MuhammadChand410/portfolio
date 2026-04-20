import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRolesStore } from "@/src/store/useRolesStore";
import { getRoles, createRole, updateRole, deleteRole, revokeRole, activateRole } from "../services/roles";

function normalize(r: any) {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    status: (r.status === "active" || r.status === "Active" || r.is_active === true) ? "Active" : "Revoked" as "Active" | "Revoked",
    added: r.added_at ?? r.created_at ?? r.added ?? "",
  };
}

export default function useRoles() {
  const { setUsers, setLoading, addUser, updateUser, removeUser } = useRolesStore();

  useEffect(() => { fetchRoles(); }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await getRoles();
      const raw = Array.isArray(data) ? data : data.results ?? [];
      setUsers(raw.map(normalize));
    } catch {
      toast.error("Failed to load roles.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: Record<string, string>) => {
    try {
      const created = await createRole(data);
      addUser(normalize(created));
      toast.success("User added.");
      return true;
    } catch (err: any) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : "Failed to add user.";
      toast.error(msg);
      return false;
    }
  };

  const handleUpdate = async (id: number, data: Record<string, string>) => {
    try {
      const updated = await updateRole(id, data);
      updateUser(id, normalize(updated));
      toast.success("User updated.");
      return true;
    } catch {
      toast.error("Failed to update user.");
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id);
      removeUser(id);
      toast.success("User removed.");
      return true;
    } catch {
      toast.error("Failed to remove user.");
      return false;
    }
  };

  const handleRevoke = async (id: number) => {
    try {
      await revokeRole(id);
      updateUser(id, { status: "Revoked" });
      return true;
    } catch {
      toast.error("Failed to revoke access.");
      return false;
    }
  };

  const handleActivate = async (id: number) => {
    try {
      await activateRole(id);
      updateUser(id, { status: "Active" });
      return true;
    } catch {
      toast.error("Failed to activate access.");
      return false;
    }
  };

  return { handleAdd, handleUpdate, handleDelete, handleRevoke, handleActivate };
}
