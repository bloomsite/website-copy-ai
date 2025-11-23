import React, { useState } from "react";
import Button from "../../core/Button/Button";
import { useInvokeAgent } from "../../../hooks/Agents/useInvokeAgent";
import "./AgentResponseModal.css";
import { useInvokeSpecialAgent } from "../../../hooks/Agents/useInvokeSpecialAgent";

interface AgentResponseModalProps {
  agentId: string;
  agentName: string;
  onClose: () => void;
}

const AgentResponseModal: React.FC<AgentResponseModalProps> = ({
  agentId,
  agentName,
  onClose,
}) => {
  const [prompt, setPrompt] = useState("");
  const { invokeAgent, isLoading, error, response } = useInvokeAgent();
  const {
    invokeSpecialAgent,
    isLoading: specialIsLoading,
    error: specialError,
    response: specialResponse,
  } = useInvokeSpecialAgent();

  const isSpecialAgent =
    agentId === "content-structure-agent" || agentId === "tone-of-voice-agent";

  const currentIsLoading = isSpecialAgent ? specialIsLoading : isLoading;
  const currentError = isSpecialAgent ? specialError : error;
  const currentResponse = isSpecialAgent ? specialResponse : response;

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    try {
      if (isSpecialAgent) {
        await invokeSpecialAgent(agentId, prompt);
      } else {
        await invokeAgent(agentId, prompt);
      }
    } catch (err) {
      console.error("Error invoking agent:", err);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="agent-response-modal-overlay" onClick={handleBackdropClick}>
      <div className="agent-response-modal">
        <div className="agent-response-modal__header">
          <h2 className="agent-response-modal__title">Test {agentName}</h2>
        </div>

        <div className="agent-response-modal__content">
          <div className="agent-response-modal__input-section">
            <label className="agent-response-modal__label">Prompt</label>
            <textarea
              className="agent-response-modal__textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Voer je prompt in..."
              disabled={currentIsLoading}
            />
          </div>

          <div className="agent-response-modal__submit">
            <Button
              text="Versturen"
              onClick={handleSubmit}
              isLoading={currentIsLoading}
              disabled={!prompt.trim() || currentIsLoading}
            />
          </div>

          {currentIsLoading && (
            <div className="agent-response-modal__loading">
              <p>Agent aan het verwerken...</p>
            </div>
          )}

          {currentError && (
            <div className="agent-response-modal__error">
              <p>Fout: {currentError}</p>
            </div>
          )}

          {currentResponse && !currentIsLoading && (
            <div className="agent-response-modal__response-section">
              <label className="agent-response-modal__label">Response</label>
              <div className="agent-response-modal__response">
                {currentResponse}
              </div>
            </div>
          )}
        </div>

        <div className="agent-response-modal__actions">
          <Button
            text="Sluiten"
            onClick={onClose}
            className="agent-response-modal__close-button"
          />
        </div>
      </div>
    </div>
  );
};

export default AgentResponseModal;
