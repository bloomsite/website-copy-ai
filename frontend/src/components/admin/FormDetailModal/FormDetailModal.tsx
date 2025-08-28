import React from "react";
import type { FormSubmission } from "../../../hooks/Users/useUserDetail";
import { exportFormToPDF } from "../../../core/Utils/pdfExport";
import "./FormDetailModal.css";

interface FormDetailModalProps {
  form: FormSubmission;
  onClose: () => void;
}

export const FormDetailModal: React.FC<FormDetailModalProps> = ({
  form,
  onClose,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("nl-NL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="form-detail-modal" onClick={handleBackdropClick}>
      <div className="form-detail-modal__content">
        <div className="form-detail-modal__header">
          <h2 className="form-detail-modal__title">{form.formName}</h2>
          <button
            className="form-detail-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="form-detail-modal__meta">
          <div>
            <strong>Formulier ID:</strong> {form.formId}
          </div>
          <div>
            <strong>Versie:</strong> {form.formVersion}
          </div>
          <div>
            <strong>Ingediend op:</strong> {formatDate(form.submittedAt)}
          </div>
        </div>
        <div className="form-detail-modal__actions">
          <button
            className="form-detail-modal__button form-detail-modal__button--export"
            onClick={() => exportFormToPDF(form)}
          >
            PDF Exporteren
          </button>
          <button
            className="form-detail-modal__button form-detail-modal__button--delete"
            onClick={() => {
              // TODO: Implement delete functionality
              console.log("Delete form:", form.submissionId);
            }}
          >
            Verwijderen
          </button>
        </div>{" "}
        <div className="form-detail-modal__sections">
          {Object.entries(form.formData).map(([sectionName, instances]) => (
            <div key={sectionName} className="form-detail-modal__section">
              <h3 className="form-detail-modal__section-title">
                {sectionName}
              </h3>
              {Object.entries(instances).map(([instanceKey, fields]) => (
                <div key={instanceKey} className="form-detail-modal__instance">
                  {Object.entries(fields).map(([fieldName, value]) => (
                    <div key={fieldName} className="form-detail-modal__field">
                      <div className="form-detail-modal__field-label">
                        {fieldName}
                      </div>
                      <div className="form-detail-modal__field-value">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
