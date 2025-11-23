import React, { useState, useEffect } from "react";
import Button from "../../../core/Button/Button";
import { useUpdateAgent } from "../../../../hooks/Agents/useUpdateAgent";
import "./AgentInstructionModal.css";

interface AgentInstructionModalProps {
  agentId: string;
  instruction: string;
  onSave: (newInstruction: string) => void;
  onClose: () => void;
}

const AgentInstructionModal: React.FC<AgentInstructionModalProps> = ({
  agentId,
  instruction,
  onSave,
  onClose,
}) => {
  const [editedInstruction, setEditedInstruction] = useState(instruction);
  const { updateAgentInstructions, isLoading, error, success } =
    useUpdateAgent();

  useEffect(() => {
    if (success) {
      onSave(editedInstruction);
      onClose();
    }
  }, [success, editedInstruction, onSave, onClose]);

  const handleSave = async () => {
    try {
      await updateAgentInstructions(agentId, editedInstruction);
    } catch (err) {
      console.error("Failed to update agent instructions:", err);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="agent-instruction-modal-overlay"
      onClick={handleBackdropClick}
    >
      <div className="agent-instruction-modal">
        <div className="agent-instruction-modal__header">
          <h2 className="agent-instruction-modal__title">
            Agent Instructie Bewerken
          </h2>
        </div>

        <div className="agent-instruction-modal__content">
          <textarea
            className="agent-instruction-modal__textarea"
            value={editedInstruction}
            onChange={(e) => setEditedInstruction(e.target.value)}
            placeholder="Voer de agent instructie in..."
            disabled={isLoading}
          />
          {error && (
            <div className="agent-instruction-modal__error">{error}</div>
          )}
        </div>

        <div className="agent-instruction-modal__actions">
          <Button
            text={isLoading ? "Opslaan..." : "Opslaan"}
            onClick={handleSave}
            className="agent-instruction-modal__save-button"
            disabled={isLoading}
          />
          <Button
            text="Afsluiten"
            onClick={onClose}
            className="agent-instruction-modal__close-button"
          />
        </div>
      </div>
    </div>
  );
};

export default AgentInstructionModal;
