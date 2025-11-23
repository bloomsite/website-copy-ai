import { useState } from "react";
import apiAgenticClient from "../../services/apiAgenticClient";

interface SpecialAgent {
  agent_name: string;
  description: string;
  instructions: string;
  temperature: number;
}

interface SpecialAgentResponse {
  detail: SpecialAgent;
}

interface SpecialAgentState {
  isLoading: boolean;
  error?: string;
}

export const useSpecialAgentDetail = () => {
  const [state, setState] = useState<
    SpecialAgentState & { agent: SpecialAgent | null }
  >({
    isLoading: false,
    error: undefined,
    agent: null,
  });

  const retrieveSpecialAgent = async (agentName: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: undefined }));
    try {
      const response = await apiAgenticClient.get<SpecialAgentResponse>(
        `api/agents/special-agents/?name=${agentName}`
      );

      setState((prev) => ({
        ...prev,
        agent: response.data.detail,
        isLoading: false,
      }));
      return response.data.detail;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching special agent details. Please try again";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw err;
    }
  };

  return {
    retrieveSpecialAgent,
    agent: state.agent,
    isLoading: state.isLoading,
    error: state.error,
  };
};
