import React, { useEffect, useState } from "react";
import { useAgents } from "../../../hooks/Agents/useAgents";
import { useNavigate } from "react-router-dom";
import "./AgentsOverview.css";

const PAGE_SIZE = 40;

const AgentsOverview: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filterEnabled, setFilterEnabled] = useState<boolean | null>(null);
  const [agentName, setAgentName] = useState("");
  const [description, setDescription] = useState("");
  const { retrieveAgents, agents, isLoading, error } = useAgents();
  const navigate = useNavigate();

  const handleNavigate = (agentName: string) => {
    navigate(`/admin/agents/${agentName}`);
  };

  useEffect(() => {
    retrieveAgents();
  }, []);

  // Filter agents by enabled status and search terms
  const filteredAgents = agents.filter((agent) => {
    const matchesEnabled =
      filterEnabled === null || agent.enabled === filterEnabled;
    const matchesName =
      agentName === "" ||
      agent.agent_name.toLowerCase().includes(agentName.toLowerCase());
    const matchesDescription =
      description === "" ||
      agent.description.toLowerCase().includes(description.toLowerCase());
    return matchesEnabled && matchesName && matchesDescription;
  });

  // Pagination logic
  const paginatedAgents = filteredAgents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const totalPages = Math.ceil(filteredAgents.length / PAGE_SIZE);

  return (
    <div className="agents-overview-container">
      <h2 className="agents-overview-title">Agents Overzicht</h2>

      <div className="agents-filters">
        <input
          type="text"
          placeholder="Agent Naam"
          value={agentName}
          onChange={(e) => {
            setAgentName(e.target.value);
            setPage(1);
          }}
        />
        <input
          type="text"
          placeholder="Beschrijving"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setPage(1);
          }}
        />
        <div className="chip-container">
          <span
            className={`chip${filterEnabled === null ? " active" : ""}`}
            onClick={() => {
              setFilterEnabled(null);
              setPage(1);
            }}
            role="button"
            tabIndex={0}
          >
            Alle Agents
          </span>
          <span
            className={`chip${filterEnabled === true ? " active" : ""}`}
            onClick={() => {
              setFilterEnabled(true);
              setPage(1);
            }}
            role="button"
            tabIndex={0}
          >
            Actief
          </span>
          <span
            className={`chip${filterEnabled === false ? " active" : ""}`}
            onClick={() => {
              setFilterEnabled(false);
              setPage(1);
            }}
            role="button"
            tabIndex={0}
          >
            Inactief
          </span>
        </div>
      </div>

      {isLoading && <div className="agents-loading">Loading agents...</div>}
      {error && <div className="agents-error">{error}</div>}

      <table className="agents-table">
        <thead>
          <tr>
            <th>Agent Naam</th>
            <th>Beschrijving</th>
            <th>Profiel</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAgents.map((agent) => (
            <tr key={agent.id}>
              <td className="agent-name">{agent.agent_name}</td>
              <td className="agent-description">{agent.description}</td>
              <td className="actions-cell">
                <button
                  className="visit-button"
                  onClick={() => handleNavigate(agent.agent_name)}
                >
                  Bezoeken
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="agents-pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Vorige
        </button>
        <span>
          Pagina {page} van {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Volgende
        </button>
      </div>
    </div>
  );
};

export default AgentsOverview;
