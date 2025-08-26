import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getIcon } from "../../../core/Utils/getIcon";
import { useFormsOverview } from "../../../hooks/Forms/useFormsOverview";
import Card from "../../core/Card/Card";
import Button from "../../core/Button/Button";
import "./FormOverview.css";

const FormOverview: React.FC = () => {
  const navigate = useNavigate();
  const { retrieveForms, forms, isLoading, error } = useFormsOverview();

  useEffect(() => {
    retrieveForms().catch((err) => {
      console.error("Error fetching forms:", err);
    });
  }, []);

  const handleFillForm = (formId: string, formVersion: string) => {
    navigate(`/forms/${formId}/v/${formVersion}`);
  };

  if (error) {
    return (
      <Card variant="outline" className="error-card">
        <p className="error-message">{error}</p>
        <Button text="Try Again" onClick={() => retrieveForms()} />
      </Card>
    );
  }

  return (
    <div className="form-overview">
      <h1 className="form-overview-title">Informatie velden</h1>

      <div className="forms-grid">
        {isLoading
          ? Array(6)
              .fill(null)
              .map((_, index) => (
                <Card key={`skeleton-${index}`} className="form-card skeleton">
                  <div className="skeleton-icon"></div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-description"></div>
                  <div className="skeleton-button"></div>
                </Card>
              ))
          : forms.map((form) => (
              <Card
                // icon={getIcon(form.icon, 35)} even dedeactiveerd voor nu
                key={form.formId}
                className="form-card"
                title={form.title}
              >
                <p className="form-description">{form.shortDescription}</p>
                <div className="form-footer">
                  <Button
                    text="Invullen"
                    onClick={() => handleFillForm(form.formId, form.version)}
                    className="fill-form-button"
                  />
                </div>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default FormOverview;
