import React, { useState } from "react";
import Card from "../../core/Card/Card";
import type { FormSubmission } from "../../../hooks/Users/useUserDetail";
import "./UserFormsCards.css";

interface UserFormsCardsProps {
  forms: FormSubmission[];
  onViewForm: (form: FormSubmission) => void;
}

const ITEMS_PER_PAGE = 9;

export const UserFormsCards: React.FC<UserFormsCardsProps> = ({
  forms,
  onViewForm,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(forms.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentForms = forms.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the grid when page changes
    document
      .querySelector(".user-forms-cards")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("nl-NL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (forms.length === 0) {
    return (
      <div className="user-forms-cards">
        <div className="user-forms-cards__empty">
          Geen ingevulde formulieren
        </div>
      </div>
    );
  }

  return (
    <div className="user-forms-cards">
      <div className="user-forms-cards__grid">
        {currentForms.map((form) => (
          <Card key={form.submissionId} size="medium" hoverable>
            <div className="form-card__content">
              <h3 className="form-card__title">{form.formName}</h3>
              <p className="form-card__date">
                Ingediend op {formatDate(form.submittedAt)}
              </p>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => onViewForm(form)}
                style={{
                  width: "100%",
                  padding: "0.5rem 1rem",
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Bekijken
              </button>
            </div>
          </Card>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="user-forms-cards__pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`pagination-button ${
                  pageNum === currentPage ? "active" : ""
                }`}
              >
                {pageNum}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};
