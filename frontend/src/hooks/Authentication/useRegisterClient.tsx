import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  password: string;
}

interface RegisterState {
  isLoading: boolean;
  error?: string;
}

interface UseRegisterClient {
  registerClient: (
    userData: RegisterData,
    adminRegistration: boolean
  ) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export const useRegisterClient = (): UseRegisterClient => {
  const navigate = useNavigate();
  const [state, setState] = useState<RegisterState>({
    isLoading: false,
    error: undefined,
  });

  const registerClient = async (
    userData: RegisterData,
    adminRegistration: boolean
  ) => {
    setState({ isLoading: true, error: undefined });

    try {
      // Register the user
      const response = await apiClient.post("/api/users/register/", {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
        company_name: userData.companyName,
      });

      if (adminRegistration !== true) {
        const loginResponse = await apiClient.post("/api/users/token/", {
          username: userData.email,
          password: userData.password,
        });

        const { access, refresh } = loginResponse.data;
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);

        navigate("/onboarding");
      } else {
        if (response.status == 201) {
          alert("Gebruiker is aangemaakt");
        }
      }
    } catch (err) {
      setState({
        isLoading: false,
        error:
          err instanceof Error
            ? err.message
            : "An error occurred during registration. Please try again.",
      });
    } finally {
      setState({ ...state, isLoading: false });
    }
  };

  return {
    registerClient,
    isLoading: state.isLoading,
    error: state.error,
  };
};
