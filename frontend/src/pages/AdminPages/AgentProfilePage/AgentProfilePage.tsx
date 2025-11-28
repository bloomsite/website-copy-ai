import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavigationSidebar from "../../../components/core/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsAdmin";
import { AgentProfileCard } from "../../../components/admin/AgentProfileCard/AgentProfileCard";
import AgentInstructionCard from "../../../components/admin/AgentInstruction/AgentInstructionCard/AgentInstructionCard";
import AgentResponseModal from "../../../components/admin/AgentResponseModal/AgentResponseModal";
import { useAgentDetail } from "../../../hooks/Agents/useAgentDetail";
import "./AgentProfilePage.css";

const AgentProfilePage: React.FC = () => {
  const { agentName } = useParams<{ agentName: string }>();
  const { retrieveAgent, agent, isLoading, error } = useAgentDetail();
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(agentName);

  const handleSaveInstruction = (newInstruction: string) => {
    console.log("Saving new instruction:", newInstruction);
    // TODO: Implement API call to update agent instruction
  };

  useEffect(() => {
    if (agentName) {
      retrieveAgent(agentName);
    }
  }, [agentName]);

  if (isLoading) {
    return (
      <>
        <NavigationSidebar sidebarTitle="Admin" sidebarItems={sidebarItems} />
        <div className="agent-detail-page">
          <div className="agent-detail-page__header">
            <h1 className="agent-detail-page__title">Gegevens inladen...</h1>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavigationSidebar sidebarTitle="Admin" sidebarItems={sidebarItems} />
        <div className="agent-detail-page">
          <div className="agent-detail-page__header">
            <h1 className="agent-detail-page__title">Error</h1>
            <p className="agent-detail-page__subtitle">{error}</p>
          </div>
        </div>
      </>
    );
  }

  if (!agent) {
    return (
      <>
        <NavigationSidebar sidebarTitle="Admin" sidebarItems={sidebarItems} />
        <div className="agent-detail-page">
          <div className="agent-detail-page__header">
            <h1 className="agent-detail-page__title">Agent niet gevonden</h1>
            <p className="agent-detail-page__subtitle">
              De agent is niet gevonden.
            </p>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <NavigationSidebar sidebarTitle="Admin" sidebarItems={sidebarItems} />
      <div className="agent-detail-page">
        <div className="agent-detail-page__header">
          <h1 className="agent-detail-page__title">Agent Profiel</h1>
        </div>

        <div className="agent-detail-page__content">
          <div className="agent-detail-page__profile-section">
            <AgentProfileCard
              agent={agent}
              onTryOut={() => setIsModalOpen(true)}
            />
          </div>
          <div className="agent-detail-page__instruction-section">
            <AgentInstructionCard
              agentId={agent.id}
              instruction={agent.instructions}
              onSave={handleSaveInstruction}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AgentResponseModal
          agentId={agent.id}
          agentName={agent.agent_name}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default AgentProfilePage;
