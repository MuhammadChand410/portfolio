import { useState } from "react";
import { sendContactMessage } from "../services/contact";

export default function useContact() {
  const [loading, setLoading] = useState(false);

  const submitContact = async (name: string, email: string, subject: string, message: string) => {
    try {
      setLoading(true);
      await sendContactMessage(name, email, subject, message);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitContact, loading };
}
