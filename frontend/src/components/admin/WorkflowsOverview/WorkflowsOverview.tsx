import React from "react";
import Card from "../../core/Card/Card";
import Button from "../../core/Button/Button";
import { getIcon } from "../../../core/Utils/getIcon";
import "./WorkflowsOverview.css";
import { useNavigate } from "react-router-dom";

const WorkflowsOverview: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateSpecialAgent = (name: string) => {
    navigate(`/admin/special-agents/${name}`);
  };

  const handleNavigateWorkflow = (name: string) => {
    navigate(`/admin/workflows/${name}`);
  };
  return (
    <div className="workflows-overview">
      <Card
        title="Content Structure Agent"
        icon={getIcon("bot", 24)}
        variant="default"
        elevation="low"
        size="small"
        centered
        footer={
          <Button
            text="Bezoeken"
            onClick={() =>
              handleNavigateSpecialAgent("content-structure-agent")
            }
          />
        }
      >
        <p>Stel de content structure agent in.</p>
      </Card>

      <Card
        title="Tone of Voice Agent"
        icon={getIcon("bot", 24)}
        variant="default"
        elevation="medium"
        size="small"
        centered
        footer={
          <Button
            text="Bezoeken"
            onClick={() => handleNavigateSpecialAgent("tone-of-voice-agent")}
          />
        }
      >
        <p>Stel de tone of voice agent in.</p>
      </Card>

      <Card
        title="Content Generation Workflow"
        icon={getIcon("workflow", 24)}
        variant="default"
        elevation="low"
        size="small"
        centered
        footer={
          <Button
            text="Bezoeken"
            onClick={() =>
              handleNavigateWorkflow("content-generation-workflow")
            }
          />
        }
      >
        <p>Stel de workflow in.</p>
      </Card>
    </div>
  );
};

export default WorkflowsOverview;
