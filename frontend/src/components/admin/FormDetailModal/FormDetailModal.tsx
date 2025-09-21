import React from "react";
import type { FormSubmission } from "../../../hooks/Users/useUserDetail";
import { newExportFormToPDF } from "../../../core/Utils/newPdfExport";
import "./FormDetailModal.css";
import { useDeleteForm } from "../../../hooks/Forms/useDeleteForm";

interface FormDetailModalProps {
  form: FormSubmission;
  onClose: () => void;
  userId?: string;
}

export const FormDetailModal: React.FC<FormDetailModalProps> = ({
  form,
  onClose,
  userId,
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

  const { isDeleting, deleteForm } = useDeleteForm();

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
          <div>
            <strong>ProgressionID:</strong>{" "}
            {`form:${form.formId}version${form.formVersion}`}
          </div>
        </div>
        <div className="form-detail-modal__actions">
          <button
            className="form-detail-modal__button form-detail-modal__button--export"
            onClick={() => newExportFormToPDF(form)}
          >
            PDF Exporteren
          </button>
          <button
            className="form-detail-modal__button form-detail-modal__button--delete"
            onClick={() => {
              deleteForm(form.formId, userId || "");
              onClose();
            }}
            disabled={isDeleting}
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
