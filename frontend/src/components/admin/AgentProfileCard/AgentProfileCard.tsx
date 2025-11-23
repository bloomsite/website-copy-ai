import React from "react";
import { Bot } from "lucide-react";
import Button from "../../core/Button/Button";
import "./AgentProfileCard.css";

interface Agent {
  id: string;
  agent_name: string;
  description: string;
  instructions: string;
  enabled: boolean;
  temperature: number;
}

interface AgentProfileCardProps {
  agent: Agent;
  onTryOut?: () => void;
}

export const AgentProfileCard: React.FC<AgentProfileCardProps> = ({
  agent,
  onTryOut,
}) => {
  return (
    <div className="agent-profile-card">
      <div className="agent-profile-card__header">
        <div className="agent-profile-card__avatar">
          <Bot size={32} />
        </div>
        <div className="agent-profile-card__name-section">
          <p className="agent-profile-card__status">
            {agent.enabled ? "Actief" : "Inactief"}
          </p>
        </div>
      </div>

      <div className="agent-profile-card__info">
        <div className="agent-profile-card__info-item">
          <span className="agent-profile-card__info-label">Agent ID</span>
          <span className="agent-profile-card__info-value">{agent.id}</span>
        </div>
        <div className="agent-profile-card__info-item">
          <span className="agent-profile-card__info-label">Beschrijving</span>
          <span className="agent-profile-card__info-value">
            {agent.description}
          </span>
        </div>
        <div className="agent-profile-card__info-item">
          <span className="agent-profile-card__info-label">Temperature</span>
          <span className="agent-profile-card__info-value">
            {agent.temperature}
          </span>
        </div>
        <div className="agent-profile-card__info-item">
          <span className="agent-profile-card__info-label">Status</span>
          <span className="agent-profile-card__info-value">
            <span
              className={`status-badge ${
                agent.enabled ? "enabled" : "disabled"
              }`}
            >
              {agent.enabled ? "Actief" : "Inactief"}
            </span>
          </span>
        </div>
      </div>

      <div className="agent-profile-card__actions">
        <Button text="Uitproberen" onClick={onTryOut} />
      </div>
    </div>
  );
};
