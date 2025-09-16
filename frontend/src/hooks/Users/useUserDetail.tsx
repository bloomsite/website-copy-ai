import { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";

export interface FormSubmission {
  submissionId: string;
  formId: string;
  formName: string;
  formVersion: string;
  submittedAt: string;
  formData: {
    [section: string]: {
      [instance: string]: {
        [field: string]: string;
      };
    };
  };
}

/**
 * Represents the detailed information of a user
 * @property formsFilled - Array of form submissions. Can be empty if user has no submissions.
 */
export interface UserDetail {
  firstName: string;
  lastName: string;
  email: string;
  uuid: string;
  dateJoined: string;
  lastLogin: string | null;
  companyName: string;
  formsFilled: FormSubmission[];
}

export function useUserDetail(userId: string | undefined) {
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError("User ID is required");
      return;
    }

    const fetchUserDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(
          `/api/users/fetch/user/?user_id=${userId}`
        );
        setUserDetail(response.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to fetch user details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId]);

  return { userDetail, loading, error };
}
