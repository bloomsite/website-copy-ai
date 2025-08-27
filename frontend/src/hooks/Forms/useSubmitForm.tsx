import { useState } from "react";
import apiClient from "../../services/apiClient";

// Accepts nested answers object
export interface NestedAnswers {
  [section: string]: {
    [instance: string]: {
      [label: string]: string;
    };
  };
}

export interface FormSubmission {
  formId: string;
  formName: string;
  answers: {
    [key: string]: string;
  };
}

export function useSubmitForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Accepts nested answers object and submits as-is
  const submitForm = async (
    formId: string,
    formName: string,
    nestedAnswers: NestedAnswers
  ) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const payload = {
      formId,
      formName,
      answers: nestedAnswers,
    };

    try {
      console.log(payload);
      const res = await apiClient.post("/api/forms/submit/", payload);
      if (res.status !== 200 && res.status !== 201)
        throw new Error("Failed to submit form");
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, error, success, submitForm };
}
