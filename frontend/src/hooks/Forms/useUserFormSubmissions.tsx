import { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";

interface submission {
  formId: string;
  formName: string;
  formVersion: string;
}

export const useUserFormSubmissions = () => {
  const isFormSubmitted = (formId: string) => {
    return submissions.some((sub) => sub.formId === formId);
  };
  const [submissions, setSubmissions] = useState<submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get("/api/forms/submissions/");
        setSubmissions(response.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to fetch form submissions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const refetchSubmissions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/api/forms/submissions/");
      setSubmissions(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to fetch form submissions"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    submissions,
    loading,
    error,
    refetchSubmissions,
    isFormSubmitted,
  };
};
