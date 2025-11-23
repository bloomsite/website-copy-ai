import { useState } from "react";
import apiAgenticClient from "../../services/apiAgenticClient";

interface UpdateAgentInstructionsRequest {
  agent_id: string;
  new_instruction: string;
}

interface UpdateAgentInstructionsResponse {
  detail: string;
}

interface UpdateAgentState {
  isLoading: boolean;
  error?: string;
  success: boolean;
}

export const useUpdateAgent = () => {
  const [state, setState] = useState<UpdateAgentState>({
    isLoading: false,
    error: undefined,
    success: false,
  });

  const updateAgentInstructions = async (
    agentId: string,
    newInstruction: string
  ) => {
    setState({ isLoading: true, error: undefined, success: false });

    try {
      const isSpecialAgent =
        agentId === "content-structure-agent" ||
        agentId === "tone-of-voice-agent";

      const endpoint = isSpecialAgent
        ? "api/agents/update-special-agent-instructions/"
        : "api/agents/update-instructions/";

      const response =
        await apiAgenticClient.post<UpdateAgentInstructionsResponse>(endpoint, {
          agent_id: agentId,
          new_instruction: newInstruction,
        } as UpdateAgentInstructionsRequest);

      setState({ isLoading: false, error: undefined, success: true });
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while updating agent instructions. Please try again";

      setState({ isLoading: false, error: errorMessage, success: false });
      throw err;
    }
  };

  const resetState = () => {
    setState({ isLoading: false, error: undefined, success: false });
  };

  return {
    updateAgentInstructions,
    resetState,
    isLoading: state.isLoading,
    error: state.error,
    success: state.success,
  };
};
