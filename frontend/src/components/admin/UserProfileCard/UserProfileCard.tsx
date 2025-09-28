import React, { useState } from "react";
import type { UserDetail } from "../../../hooks/Users/useUserDetail";
import Button from "../../core/Button/Button";
import Card from "../../core/Card/Card";
import Select from "../../core/Select/Select";
import TextField from "../../core/TextField/TextField";
import "./UserProfileCard.css";
import { useFormsOverview } from "../../../hooks/Forms/useFormsOverview";

interface UserProfileCardProps {
  user: UserDetail;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  const [showFormCard, setShowFormCard] = useState(false);
  const [formData, setFormData] = useState({
    formId: "",
    submissionData: "",
  });

  // Dummy form options
  const formOptions = [
    { value: "form_1", label: "Contactformulier" },
    { value: "form_2", label: "Aanmeldingsformulier" },
    { value: "form_3", label: "Feedbackformulier" },
    { value: "form_4", label: "Evaluatieformulier" },
  ];

  const { retrieveForms } = useFormsOverview();

  const handleSaveSubmission = () => {
    // Add your save logic here
    console.log("Saving form submission:", {
      userId: user.uuid,
      formId: formData.formId,
      submissionData: formData.submissionData,
    });

    // Reset form and close card
    setFormData({ formId: "", submissionData: "" });
    setShowFormCard(false);
  };

  // Create initials from first and last name
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  // Format date to local string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("nl-NL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="user-profile-card">
      <div className="user-profile-card__header">
        <div className="user-profile-card__avatar">{initials}</div>
        <div className="user-profile-card__name-section">
          <h2 className="user-profile-card__name">
            {user.firstName} {user.lastName}
          </h2>
          {user.companyName && (
            <p className="user-profile-card__company">{user.companyName}</p>
          )}
        </div>
      </div>

      <div className="user-profile-card__info">
        <div className="user-profile-card__info-item">
          <span className="user-profile-card__info-label">Email</span>
          <span className="user-profile-card__info-value">{user.email}</span>
        </div>
        <div className="user-profile-card__info-item">
          <span className="user-profile-card__info-label">UUID</span>
          <span className="user-profile-card__info-value">{user.uuid}</span>
        </div>
        <div className="user-profile-card__info-item">
          <span className="user-profile-card__info-label">Lid sinds</span>
          <span className="user-profile-card__info-value">
            {formatDate(user.dateJoined)}
          </span>
        </div>
        {user.lastLogin && (
          <div className="user-profile-card__info-item">
            <span className="user-profile-card__info-label">Laatste Login</span>
            <span className="user-profile-card__info-value">
              {formatDate(user.lastLogin)}
            </span>
          </div>
        )}
      </div>

      <div className="user-profile-card__stats">
        <div className="user-profile-card__stat">
          <div className="user-profile-card__stat-value">
            {user.formsFilled.length}
          </div>
          <div className="user-profile-card__stat-label">
            Formulieren ingeleverd
          </div>
        </div>
      </div>

      <div className="user-profile-card__actions">
        <Button
          text="Nieuwe Inzending"
          onClick={() => setShowFormCard(true)}
          className="user-profile-card__edit-button"
        />
      </div>

      {showFormCard && (
        <div className="form-card-overlay">
          <Card
            title="Nieuwe Formulier Inzending"
            className="form-submission-card"
            size="large"
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Select
                id="form-id-select"
                label="Formulier"
                value={formData.formId}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, formId: value }))
                }
                options={formOptions}
                placeholder="Selecteer een formulier..."
                required
              />

              <TextField
                id="submission-data"
                label="Inzending Data"
                value={formData.submissionData}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, submissionData: value }))
                }
                placeholder="Voer de inzending data in..."
                multiline
                required
              />

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "flex-end",
                  marginTop: "1rem",
                }}
              >
                <Button
                  text="Annuleren"
                  onClick={() => {
                    setFormData({ formId: "", submissionData: "" });
                    setShowFormCard(false);
                  }}
                  className="cancel-button"
                />
                <Button
                  text="Opslaan"
                  onClick={handleSaveSubmission}
                  className="save-button"
                />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
