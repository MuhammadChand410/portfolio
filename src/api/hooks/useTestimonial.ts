import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTestimonialStore } from "@/src/store/useTestimonialStore";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "../services/testimonial";

export default function useTestimonial() {
  const { setTestimonials, setLoading, addTestimonial, updateTestimonial: storeUpdate, deleteTestimonial: storeDelete } = useTestimonialStore();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async (page?: number, status?: string) => {
    setLoading(true);
    try {
      const data = await getTestimonials(page, status);
      const raw = Array.isArray(data) ? data : data.results ?? [];
      setTestimonials(
        raw.map((t: any) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          company: t.company,
          rating: t.rating,
          text: t.review_text ?? t.review ?? t.text,
          status: t.status === "published" ? "Published" : t.status === "hidden" ? "Hidden" : t.status,
        })),
        data.pagination ?? undefined
      );
    } catch {
      toast.error("Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: Record<string, string | number>) => {
    try {
      const created = await createTestimonial(data);
      addTestimonial({
        name: created.name,
        role: created.role,
        company: created.company,
        rating: created.rating,
        text: created.review_text ?? created.review ?? created.text,
        status: created.status === "Published" ? "Published" : "Hidden",
      });
      toast.success("Testimonial added.");
      return true;
    } catch (err: any) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : "Failed to add testimonial.";
      toast.error(msg);
      return false;
    }
  };

  const handleUpdate = async (id: number, data: Record<string, string | number>) => {
    try {
      const updated = await updateTestimonial(id, data);
      storeUpdate(id, {
        name: updated.name,
        role: updated.role,
        company: updated.company,
        rating: updated.rating,
        text: updated.review_text ?? updated.review ?? updated.text,
        status: updated.status === "Published" ? "Published" : "Hidden",
      });
      toast.success("Testimonial updated.");
      return true;
    } catch {
      toast.error("Failed to update testimonial.");
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTestimonial(id);
      storeDelete(id);
      toast.success("Testimonial deleted.");
      return true;
    } catch {
      toast.error("Failed to delete testimonial.");
      return false;
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Published" ? "Hidden" : "Published";
    try {
      const updated = await updateTestimonial(id, { status: newStatus });
      storeUpdate(id, {
        name: updated.name,
        role: updated.role,
        company: updated.company,
        rating: updated.rating,
        text: updated.review_text ?? updated.review ?? updated.text,
        status: updated.status === "Published" ? "Published" : "Hidden",
      });
    } catch {
      toast.error("Failed to update status.");
    }
  };

  return { handleAdd, handleUpdate, handleDelete, handleToggleStatus, fetchTestimonials };
}
