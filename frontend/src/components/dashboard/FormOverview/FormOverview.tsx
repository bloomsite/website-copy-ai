import React from "react";
import { useParams } from "react-router-dom";
import { useForm } from "../../../hooks/Forms/useForm";
import Card from "../../core/Card/Card";
import "./FormOverview.css";

const FormOverview: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const { form, isLoading, error } = useForm(formId ?? "");

  if (isLoading) {
    return <div className="form-detail-loading">Loading...</div>;
  }

  if (error) {
    return <div className="form-detail-error">{error}</div>;
  }

  if (!form) {
    return <div className="form-detail-empty">No form found.</div>;
  }

  return (
    <div className="form-detail-container">
      <Card title={form.title} subtitle={`Version: ${form.version}`}>
        <p className="form-detail-description">{form.description}</p>
        <p className="form-detail-short">{form.shortDescription}</p>
        {/* Add more form details here as needed */}
      </Card>
    </div>
  );
};

export default FormOverview;
