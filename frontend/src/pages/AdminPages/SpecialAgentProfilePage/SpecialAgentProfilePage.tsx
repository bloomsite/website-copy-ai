import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavigationSidebar from "../../../components/custom/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsAdmin";
import { AgentProfileCard } from "../../../components/admin/AgentProfileCard/AgentProfileCard";
import AgentInstructionCard from "../../../components/admin/AgentInstruction/AgentInstructionCard/AgentInstructionCard";
import AgentResponseModal from "../../../components/admin/AgentResponseModal/AgentResponseModal";
import { useSpecialAgentDetail } from "../../../hooks/Agents/useSpecialAgentDetail";
import "./SpecialAgentProfilePage.css";

const SpecialAgentProfilePage: React.FC = () => {
  const { agentName } = useParams<{ agentName: string }>();
  const { retrieveSpecialAgent, agent, isLoading, error } =
    useSpecialAgentDetail();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveInstruction = (newInstruction: string) => {
    console.log("Saving new instruction:", newInstruction);
    // TODO: Implement API call to update special agent instruction
  };

  useEffect(() => {
    if (agentName) {
      retrieveSpecialAgent(agentName);
    }
  }, [agentName]);

  if (isLoading) {
    return (
      <>
        <NavigationSidebar sidebarTitle="Admin" sidebarItems={sidebarItems} />
        <div className="special-agent-detail-page">
          <div className="special-agent-detail-page__header">
            <h1 className="special-agent-detail-page__title">
              Gegevens inladen...
            </h1>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavigationSidebar sidebarTitle="Admin" sidebarItems={sidebarItems} />
        <div className="special-agent-detail-page">
          <div className="special-agent-detail-page__header">
            <h1 className="special-agent-detail-page__title">Error</h1>
            <p className="special-agent-detail-page__subtitle">{error}</p>
          </div>
        </div>
      </>
    );
  }

  if (!agent) {
    return (
      <>
        <NavigationSidebar sidebarTitle="Admin" sidebarItems={sidebarItems} />
        <div className="special-agent-detail-page">
          <div className="special-agent-detail-page__header">
            <h1 className="special-agent-detail-page__title">
              Special Agent niet gevonden
            </h1>
            <p className="special-agent-detail-page__subtitle">
              De special agent is niet gevonden.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Transform special agent data to match AgentProfileCard expected format
  const agentData = {
    id: agent.agent_name, // Using agent_name as id since special agents don't have numeric ids
    agent_name: agent.agent_name,
    description: agent.description,
    instructions: agent.instructions,
    temperature: agent.temperature,
    enabled: true, // Special agents are always enabled
  };

  return (
    <>
      <NavigationSidebar sidebarTitle="Admin" sidebarItems={sidebarItems} />
      <div className="special-agent-detail-page">
        <div className="special-agent-detail-page__header">
          <h1 className="special-agent-detail-page__title">
            Special Agent Profiel
          </h1>
        </div>

        <div className="special-agent-detail-page__content">
          <div className="special-agent-detail-page__profile-section">
            <AgentProfileCard
              agent={agentData}
              onTryOut={() => setIsModalOpen(true)}
            />
          </div>
          <div className="special-agent-detail-page__instruction-section">
            <AgentInstructionCard
              agentId={agentData.id}
              instruction={agent.instructions}
              onSave={handleSaveInstruction}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AgentResponseModal
          agentId={agentData.id}
          agentName={agent.agent_name}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default SpecialAgentProfilePage;
