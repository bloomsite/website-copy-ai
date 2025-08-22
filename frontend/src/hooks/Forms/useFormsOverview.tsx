import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

interface Form {
  formId: string;
  title: string;
  description: string;
  shortDescription: string;
  version: string;
  icon: string;
}

interface FormOverviewState {
  isLoading: boolean;
  error?: string;
}

export const useFormsOverview = () => {
  const navigate = useNavigate();

  const [state, setState] = useState<FormOverviewState & { forms: Form[] }>({
    isLoading: false,
    error: undefined,
    forms: [],
  });

  const retrieveForms = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: undefined }));
    try {
      const response = await apiClient.get<Form[]>("api/forms/forms-overview");
      setState((prev) => ({
        ...prev,
        forms: response.data,
        isLoading: false,
      }));
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw err;
    }
  };

  return {
    retrieveForms,
    forms: state.forms,
    isLoading: state.isLoading,
    error: state.error,
  };
};
