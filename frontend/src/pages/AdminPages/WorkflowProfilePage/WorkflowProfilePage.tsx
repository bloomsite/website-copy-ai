import React, { useState } from "react";
import NavigationSidebar from "../../../components/custom/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsAdmin";
import Button from "../../../components/core/Button/Button";
import { useWorkflow } from "../../../hooks/Agents/useWorkflow";
import "./WorkflowProfilePage.css";

const WorkflowProfilePage: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const { runContentGenWorkflow, isLoading, error, result } = useWorkflow();

  const handleRunWorkflow = async () => {
    if (!userInput.trim()) return;

    try {
      await runContentGenWorkflow(userInput);
    } catch (err) {
      console.error("Error running workflow:", err);
    }
  };

  // Extract final text from the result
  const getFinalText = () => {
    if (!result) return null;

    try {
      // Parse the result if it's a JSON string
      const parsed = JSON.parse(result);
      
      // If it's an array, find the text between markers
      if (Array.isArray(parsed)) {
        const startIndex = parsed.findIndex(item => item === '=== FINAL COMPLETE TEXT ===');
        const endIndex = parsed.findIndex(item => item === '=== END OF TEXT ===');
        
        if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
          return parsed[startIndex + 1];
        }
      }
      
      return result;
    } catch {
      // If not JSON, check if it's the raw array string
      if (result.includes('=== FINAL COMPLETE TEXT ===')) {
        const match = result.match(/=== FINAL COMPLETE TEXT ==='\s*,\s*'([\s\S]*?)'\s*,\s*'=== END OF TEXT ===/);
        if (match && match[1]) {
          return match[1];
        }
      }
      return result;
    }
  };

  const finalText = getFinalText();

  return (
    <>
      <NavigationSidebar sidebarItems={sidebarItems} sidebarTitle="Admin" />
      <div className="workflow-profile-page">
        <h1 className="workflow-profile-page__title">
          Content Generation Workflow
        </h1>

        <div className="workflow-profile-page__container">
          <div className="workflow-profile-page__card">
            <h2 className="workflow-profile-page__card-title">Input</h2>
            <textarea
              className="workflow-profile-page__textarea"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Voer je content verzoek in..."
              disabled={isLoading}
            />
            <div className="workflow-profile-page__button-container">
              <Button
                text="Run Workflow"
                onClick={handleRunWorkflow}
                isLoading={isLoading}
                disabled={!userInput.trim() || isLoading}
              />
            </div>
          </div>

          <div className="workflow-profile-page__card">
            <h2 className="workflow-profile-page__card-title">Result</h2>
            <div className="workflow-profile-page__result">
              {isLoading && <p>Workflow wordt uitgevoerd...</p>}
              {error && (
                <p className="workflow-profile-page__error">Fout: {error}</p>
              )}
              {!isLoading && !error && !result && (
                <p className="workflow-profile-page__placeholder">
                  Trigger the workflow to see the results
                </p>
              )}
              {!isLoading && finalText && (
                <div className="workflow-profile-page__result-content">
                  {finalText.split("\\n").map((line: string, index: number) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < finalText.split("\\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowProfilePage;
