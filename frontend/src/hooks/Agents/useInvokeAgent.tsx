import { useState } from "react";
import apiAgenticClient from "../../services/apiAgenticClient";

interface InvokeAgentRequest {
  specialist_id: string;
  message: string;
}

interface InvokeAgentResponse {
  specialist_id: string;
  response: string;
}

interface InvokeAgentState {
  isLoading: boolean;
  error?: string;
  response?: string;
}

export const useInvokeAgent = () => {
  const [state, setState] = useState<InvokeAgentState>({
    isLoading: false,
    error: undefined,
    response: undefined,
  });

  const invokeAgent = async (specialistId: string, message: string) => {
    setState({ isLoading: true, error: undefined, response: undefined });

    try {
      const requestData: InvokeAgentRequest = {
        specialist_id: specialistId,
        message: message,
      };

      const response = await apiAgenticClient.post<InvokeAgentResponse>(
        "api/agents/invoke-specialist/",
        requestData
      );

      setState({
        isLoading: false,
        error: undefined,
        response: response.data.response,
      });

      return response.data.response;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to invoke agent";

      setState({
        isLoading: false,
        error: errorMessage,
        response: undefined,
      });

      throw new Error(errorMessage);
    }
  };

  const resetState = () => {
    setState({
      isLoading: false,
      error: undefined,
      response: undefined,
    });
  };

  return {
    invokeAgent,
    resetState,
    isLoading: state.isLoading,
    error: state.error,
    response: state.response,
  };
};
