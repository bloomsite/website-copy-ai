import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  role: string;
  email: string;
  name: string;
  uuid: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const login = async (credentials: LoginData) => {
    setIsLoading(true);
    setError(null);

    try {
      const loginResponse = await apiClient.post<LoginResponse>(
        "/api/users/token/",
        {
          username: credentials.email,
          password: credentials.password,
        }
      );

      const { access, refresh, role, email, name, uuid } = loginResponse.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user_role", role);
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_name", name);
      localStorage.setItem("user_uuid", uuid);

      // Redirect based on role
      if (role === "client") {
        navigate("/dashboard/forms");
      } else {
        navigate("/admin");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.message ||
        "An error occurred during login";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
};

export default useLogin;
