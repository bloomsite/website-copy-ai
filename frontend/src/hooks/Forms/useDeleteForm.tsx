import { useState } from "react";
import apiClient from "../../services/apiClient";

export function useDeleteForm() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Accepts nested answers object and submits as-is
  const deleteForm = async (formId: string, userId: string) => {
    setIsDeleting(true);
    setError(null);
    setSuccess(false);

    const payload = {
      formId,
      userId,
    };

    try {
      const res = await apiClient.delete("/api/forms/delete/", {
        data: payload,
      });
      if (res.status !== 200 && res.status !== 201)
        throw new Error("Failed to delete form");
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || "Unknown error");
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, error, success, deleteForm };
}
