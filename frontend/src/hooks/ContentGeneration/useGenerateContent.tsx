import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import apiClient from "../../services/apiClient";

interface ContentRequestInterface {
  tone: string;
  audience: string;
  goal: string;
  description: string;
  pageType?: string;
}

interface ContentResponse {
  content: string;
  tokens?: any;
}

const useGenerateContent = (payload: ContentRequestInterface | null) => {
  const [data, setData] = useState<ContentResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    // Don't make request if payload is null
    if (!payload) {
      return;
    }

    const generateContent = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors

        const response = await apiClient.post<ContentResponse>(
          "api/content-request/generate-content",
          payload
        );
        setData(response.data);
      } catch (error) {
        setError(error as AxiosError);
        setData(null); // Clear data on error
      } finally {
        setLoading(false);
      }
    };

    generateContent();
  }, [payload]);

  return { data, loading, error };
};

export default useGenerateContent;
