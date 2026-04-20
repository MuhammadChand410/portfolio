import { useEffect } from "react";
import { toast } from "react-toastify";
import { useProjectStore } from "@/src/store/useProjectStore";
import { getPortfolios, createPortfolio, updatePortfolio, deletePortfolio } from "../services/portfolio";

export default function usePortfolio() {
  const { setProjects, setLoading, addProject, updateProject, deleteProject } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getPortfolios();
      const raw = Array.isArray(data) ? data : data.results ?? [];
      setProjects(raw.map((p: any) => ({
        ...p,
        tech: Array.isArray(p.tech) ? p.tech : (p.tech_stack ? p.tech_stack.split(",").map((t: string) => t.trim()).filter(Boolean) : []),
      })));
    } catch {
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: Record<string, string | File>) => {
    try {
      const created = await createPortfolio(data);
      addProject({ ...created, tech: created.tech_stack ? created.tech_stack.split(",").map((t: string) => t.trim()) : [] });
      toast.success("Project added.");
      return true;
    } catch {
      toast.error("Failed to add project.");
      return false;
    }
  };

  const handleUpdate = async (id: number, data: Record<string, string | File>) => {
    try {
      const updated = await updatePortfolio(id, data);
      updateProject(id, { ...updated, tech: updated.tech_stack ? updated.tech_stack.split(",").map((t: string) => t.trim()) : [] });
      toast.success("Project updated.");
      return true;
    } catch {
      toast.error("Failed to update project.");
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePortfolio(id);
      deleteProject(id);
      toast.success("Project deleted.");
      return true;
    } catch {
      toast.error("Failed to delete project.");
      return false;
    }
  };

  return { handleAdd, handleUpdate, handleDelete };
}
