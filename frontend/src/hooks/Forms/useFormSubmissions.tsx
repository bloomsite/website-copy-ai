import { useState } from "react";
import apiClient from "../../services/apiClient";
import { AxiosError } from "axios";

// maybe add the version of the submitted form later

interface Submission {
  formId: string;
  formName: string;
  email: string;
  firstName: string;
  lastName: string;
  userId: string;
  answers: string;
  id: number;
}

export const useFromSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [success, setSuccess] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchSubmissions = async () => {
    // Prevent multiple concurrent requests

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<Submission[]>(
        "/api/forms/submissions/"
      );
      setSubmissions(response.data);
      setSuccess(true);
    } catch (error) {
      setError(error as AxiosError);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    submissions,
    success,
    loading,
    error,
    fetchSubmissions,
    refetch: fetchSubmissions, // Alias for manual refetching
  };
};
