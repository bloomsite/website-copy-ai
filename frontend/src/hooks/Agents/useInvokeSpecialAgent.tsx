import { useState } from "react";
import apiAgenticClient from "../../services/apiAgenticClient";

interface InvokeAgentRequest {
  special_agent: string;
  message: string;
}

interface InvokeSpecialAgentResponse {
  specialist_id: string;
  response: string;
}

interface InvokeSpecialAgentState {
  isLoading: boolean;
  error?: string;
  response?: string;
}

export const useInvokeSpecialAgent = () => {
  const [state, setState] = useState<InvokeSpecialAgentState>({
    isLoading: false,
    error: undefined,
    response: undefined,
  });

  const invokeSpecialAgent = async (
    specialAgentID: string,
    message: string
  ) => {
    setState({ isLoading: true, error: undefined, response: undefined });

    try {
      const requestData: InvokeAgentRequest = {
        special_agent: specialAgentID,
        message: message,
      };

      const response = await apiAgenticClient.post<InvokeSpecialAgentResponse>(
        "api/agents/invoke-special-agent/",
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
    invokeSpecialAgent,
    resetState,
    isLoading: state.isLoading,
    error: state.error,
    response: state.response,
  };
};
