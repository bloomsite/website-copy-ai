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

interface AgentResponse {
  agents: Agent[];
  total_count: number;
  enabled_count: number;
}

interface AgentState {
  isLoading: boolean;
  error?: string;
}

export const useAgentDetail = () => {
  const [state, setState] = useState<AgentState & { agent: Agent | null }>({
    isLoading: false,
    error: undefined,
    agent: null,
  });

  const retrieveAgent = async (agentName: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: undefined }));
    try {
      const response = await apiAgenticClient.get<AgentResponse>(
        `api/agents/available-agents/?name=${agentName}`
      );

      // Extract the first agent from the agents array
      const agent = response.data.agents[0] || null;

      setState((prev) => ({
        ...prev,
        agent: agent,
        isLoading: false,
      }));
      return agent;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching agent details. Please try again";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw err;
    }
  };

  return {
    retrieveAgent,
    agent: state.agent,
    isLoading: state.isLoading,
    error: state.error,
  };
};
