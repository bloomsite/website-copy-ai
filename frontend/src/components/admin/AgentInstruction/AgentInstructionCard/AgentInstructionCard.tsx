import React, { useState } from "react";
import Card from "../../../core/Card/Card";
import Button from "../../../core/Button/Button";
import AgentInstructionModal from "../AgentInstructionModal/AgentInstructionModal";
import "./AgentInstructionCard.css";

interface AgentInstructionCardProps {
  agentId: string;
  instruction: string;
  onSave: (newInstruction: string) => void;
}

const AgentInstructionCard: React.FC<AgentInstructionCardProps> = ({
  agentId,
  instruction,
  onSave,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (newInstruction: string) => {
    onSave(newInstruction);
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className="agent-instruction-card" size="large">
        <div className="agent-instruction-card__content">
          <p className="agent-instruction-card__text">{instruction}</p>
        </div>
        <div className="agent-instruction-card__actions">
          <Button text="Aanpassen" onClick={handleOpenModal} />
        </div>
      </Card>

      {isModalOpen && (
        <AgentInstructionModal
          instruction={instruction}
          onSave={handleSave}
          onClose={handleCloseModal}
          agentId={agentId}
        />
      )}
    </>
  );
};

export default AgentInstructionCard;
