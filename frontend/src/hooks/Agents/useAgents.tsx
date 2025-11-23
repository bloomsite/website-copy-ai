import { useState } from "react";
import apiAgenticClient from "../../services/apiAgenticClient";

interface Agent {
  id: string;
  agent_name: string;
  description: string;
  instructions: string;
  enabled: boolean;
  temperature: number;
}

interface AgentsResponse {
  agents: Agent[];
}

interface AgentsState {
  isLoading: boolean;
  error?: string;
}

export const useAgents = () => {
  const [state, setState] = useState<AgentsState & { agents: Agent[] }>({
    isLoading: false,
    error: undefined,
    agents: [],
  });

  const retrieveAgents = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: undefined }));
    try {
      const response = await apiAgenticClient.get<AgentsResponse>(
        "api/agents/available-agents/"
      );
      setState((prev) => ({
        ...prev,
        agents: response.data.agents,
        isLoading: false,
      }));
      return response.data.agents;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching agents. Please try again";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw err;
    }
  };

  return {
    retrieveAgents,
    agents: state.agents,
    isLoading: state.isLoading,
    error: state.error,
  };
};
