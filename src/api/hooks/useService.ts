import { useEffect } from "react";
import { toast } from "react-toastify";
import { useServiceStore } from "@/src/store/useServiceStore";
import { getServices, createService, updateService, deleteService } from "../services/service";

function normalize(s: any) {
  return {
    id: s.id,
    title: s.title ?? "",
    description: s.description ?? "",
    features: Array.isArray(s.features)
      ? s.features
      : (s.features ? String(s.features).split(",").map((f: string) => f.trim()).filter(Boolean) : []),
    color_gradient: s.color_gradient ?? "violet_purple",
    visible: s.visible ?? true,
  };
}

export default function useService() {
  const { setServices, setLoading, addService, updateService: updateInStore, deleteService: deleteFromStore, services } = useServiceStore();

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async (page?: number) => {
    setLoading(true);
    try {
      const data = await getServices(page);
      const raw = Array.isArray(data) ? data : data.results ?? [];
      setServices(raw.map(normalize), data.pagination ?? undefined);
    } catch {
      toast.error("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: Record<string, any>) => {
    try {
      const created = await createService(data);
      addService(normalize(created));
      toast.success("Service added.");
      return true;
    } catch {
      toast.error("Failed to add service.");
      return false;
    }
  };

  const handleUpdate = async (id: number, data: Record<string, any>) => {
    try {
      const updated = await updateService(id, data);
      updateInStore(id, normalize(updated));
      toast.success("Service updated.");
      return true;
    } catch {
      toast.error("Failed to update service.");
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteService(id);
      deleteFromStore(id);
      toast.success("Service deleted.");
      return true;
    } catch {
      toast.error("Failed to delete service.");
      return false;
    }
  };

  const handleToggleVisibility = async (id: number) => {
    const current = services.find((s) => s.id === id);
    if (!current) return false;
    // Optimistic update
    updateInStore(id, { ...current, visible: !current.visible });
    try {
      const updated = await updateService(id, { visible: !current.visible });
      updateInStore(id, normalize(updated));
      return true;
    } catch {
      // Revert
      updateInStore(id, current);
      toast.error("Failed to toggle visibility.");
      return false;
    }
  };

  return { handleAdd, handleUpdate, handleDelete, handleToggleVisibility, fetchServices };
}
