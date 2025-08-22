import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { companyTypes } from "../../core/Constants/companyTypes";

interface CompanyInfo {
  companyType: string;
  companyGoal: string;
  targetAudience: string;
}

interface OnboardingState {
  isLoading: boolean;
  error?: string;
}

export const useOnboarding = () => {
  const navigate = useNavigate();

  const [state, setState] = useState<OnboardingState>({
    isLoading: false,
    error: undefined,
  });

  const submitOnboarding = async (formData: CompanyInfo) => {
    setState({ isLoading: true, error: undefined });

    try {
      await apiClient.post("/api/users/onboarding/", formData);
      navigate("/dashboard/forms");
    } catch (err) {
      setState({
        isLoading: false,
        error:
          err instanceof Error
            ? err.message
            : "An error occurred. Please try again.",
      });
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return {
    submitOnboarding,
    companyTypes,
    isLoading: state.isLoading,
    error: state.error,
  };
};
