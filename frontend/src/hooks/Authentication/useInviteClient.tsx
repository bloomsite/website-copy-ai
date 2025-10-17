import { useState } from "react";
import apiClient from "../../services/apiClient";
import type { AxiosError } from "axios";

interface InviteData {
  email: string;
  firstName: string;
  lastName: string;
}

export const useInviteClient = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const inviteClient = async (userData: InviteData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("/api/users/invite/", {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
      });

      if (response.status == 201) {
        alert("Gebruiker is uitgenodigd");
      }
    } catch (error) {
      setError(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, inviteClient };
};
