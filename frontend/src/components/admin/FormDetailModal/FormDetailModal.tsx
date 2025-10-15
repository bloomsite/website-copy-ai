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

  // Function to check if a value is an image URI
  const isImageUri = (value: string): boolean => {
    if (typeof value !== "string") return false;

    // Check if it's a blob storage URL with image-like patterns
    const isBlobUrl = value.includes("blob.core.windows.net");
    const hasImageExtension = /\.(jpg|jpeg|png|gif|bmp|webp)(\?|$)/i.test(
      value
    );
    const isBlobStorage = /\.blob\.core\.windows\.net\/images\//i.test(value);

    return isBlobUrl || hasImageExtension || isBlobStorage;
  };

  // Function to render field value (either as text or image)
  const renderFieldValue = (value: string) => {
    if (isImageUri(value)) {
      return (
        <div className="form-detail-modal__image-container">
          <img
            src={value}
            alt="Uploaded image"
            className="form-detail-modal__image"
            onError={(e) => {
              // Fallback to text if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.appendChild(document.createTextNode(value));
            }}
          />
        </div>
      );
    }
    return value;
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
            onClick={async () => {
              try {
                await newExportFormToPDF(form);
              } catch (error) {
                console.error("Error exporting PDF:", error);
                alert(
                  "Er is een fout opgetreden bij het exporteren van de PDF."
                );
              }
            }}
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
                        {renderFieldValue(value)}
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
