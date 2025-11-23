import { useState } from "react";
import apiAgenticClient from "../../services/apiAgenticClient";

interface WorkflowRequest {
  userContent: string;
}

interface WorkflowResponse {
  detail: string;
}

interface WorkflowState {
  isLoading: boolean;
  error?: string;
  result?: string;
}

export const useWorkflow = () => {
  const [state, setState] = useState<WorkflowState>({
    isLoading: false,
    error: undefined,
    result: undefined,
  });

  const runContentGenWorkflow = async (userContent: string) => {
    setState({ isLoading: true, error: undefined, result: undefined });

    try {
      const requestData: WorkflowRequest = {
        userContent: userContent,
      };

      const response = await apiAgenticClient.post<WorkflowResponse>(
        "api/agents/content-gen/",
        requestData
      );

      setState({
        isLoading: false,
        error: undefined,
        result: response.data.detail,
      });

      return response.data.detail;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "An error occurred while running the workflow. Please try again.";

      setState({
        isLoading: false,
        error: errorMessage,
        result: undefined,
      });

      throw new Error(errorMessage);
    }
  };

  const resetState = () => {
    setState({
      isLoading: false,
      error: undefined,
      result: undefined,
    });
  };

  return {
    runContentGenWorkflow,
    resetState,
    isLoading: state.isLoading,
    error: state.error,
    result: state.result,
  };
};
