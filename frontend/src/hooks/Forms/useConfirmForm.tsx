import type { AxiosError } from "axios";
import { useState } from "react";
import apiClient from "../../services/apiClient";

export interface ConfirmAnswers {
  question: string;
  answer: string;
}

export function useConfirmForm() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [success, setSuccess] = useState(false);

  const confirmForm = async (
    formId: string,
    formName: string,
    answers: ConfirmAnswers[]
  ) => {
    setIsConfirming(true);
    setError(null);
    setSuccess(false);

    const payload = {
      formId,
      formName,
      answers,
    };

    try {
      const response = await apiClient.post("api/forms/confirm/", payload);
      if (response.status !== 200) {
        throw new Error("failed to submit form");
      }
      setSuccess(true);
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setIsConfirming(false);
    }
  };

  return { isConfirming, error, success, confirmForm };
}
