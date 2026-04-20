import { useState } from "react";
import { sendContactMessage } from "../services/contact";
import { toast } from "react-toastify";

export default function useContact() {
  const [loading, setLoading] = useState(false);

  const submitContact = async (name: string, email: string, subject: string, message: string) => {
    try {
      setLoading(true);
      await sendContactMessage(name, email, subject, message);
      toast.success("Message sent! I'll get back to you within 24 hours.");
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to send message. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitContact, loading };
}
