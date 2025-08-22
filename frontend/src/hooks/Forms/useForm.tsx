import { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";

export interface FormDetail {
  formId: string;
  title: string;
  description: string;
  shortDescription: string;
  version: string;
  sections?: string;
}

export const useForm = (formId: string) => {
  const [form, setForm] = useState<FormDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!formId) return;
    setIsLoading(true);
    setError(undefined);
    apiClient
      .get<FormDetail>(`api/forms/${formId}`)
      .then((response) => {
        setForm(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to fetch form details."
        );
        setIsLoading(false);
      });
  }, [formId]);

  return { form, isLoading, error };
};
