import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "../../../hooks/Forms/useForm";
import { useFormConfirmProgress } from "../../../hooks/Database/useFormConfirmProgress";
import TextField from "../../core/TextField/TextField";
import Card from "../../core/Card/Card";
import Button from "../../core/Button/Button";
import Modal from "../../core/Modal/Modal";
import "./FormConfirmView.css";
import { useConfirmForm } from "../../../hooks/Forms/useConfirmForm";
import { useUserFormSubmissions } from "../../../hooks/Forms/useUserFormSubmissions";

interface AnswerField {
  question: string;
  answer: string;
}

const FormConfirmView: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const { form } = useForm(formId ?? "");
  const [answerFields, setAnswerFields] = useState<AnswerField[]>([]);
  const [confirmIsSubmitted, setConfirmIsSubmitted] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    confirmForm,
    error: confirmError,
    success: confirmSuccess,
  } = useConfirmForm();

  const navigate = useNavigate();
  const { submissions, isFormConfirmed } = useUserFormSubmissions();

  const token = window.localStorage.getItem("access_token") ?? "";
  const userId = window.localStorage.getItem("user_uuid");

  const { answers, loading, saving, error, updateAnswers } =
    useFormConfirmProgress({
      userId: userId,
      formId: formId ?? "",
      token,
      debounceMs: 1000, // Auto-save after 1 second of inactivity
    });

  // Convert answers object to array of fields when answers are loaded
  useEffect(() => {
    if (answers) {
      const fields = Object.entries(answers).map(([question, answer]) => ({
        question,
        answer,
      }));
      setAnswerFields(fields);
    }
  }, [answers]);

  // check if form has already been confirmed
  useEffect(() => {
    if (typeof formId === "string") {
      setConfirmIsSubmitted(isFormConfirmed(formId));
      console.log("conf status", confirmIsSubmitted);
    }
  }, [submissions, formId]);

  const handleFieldChange = (index: number, newAnswer: string) => {
    const updatedFields = [...answerFields];
    updatedFields[index] = { ...updatedFields[index], answer: newAnswer };
    setAnswerFields(updatedFields);

    // Convert back to answers object and update
    const updatedAnswers = updatedFields.reduce((acc, field) => {
      acc[field.question] = field.answer;
      return acc;
    }, {} as { [key: string]: string });

    updateAnswers(updatedAnswers);
  };

  if (loading) {
    return (
      <div className="form-confirm-view">
        <Card title="Loading..." size="large">
          <p>Loading your form answers...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-confirm-view">
        <Card title="Error" size="large">
          <p style={{ color: "red" }}>Error loading form: {error.message}</p>
        </Card>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="form-confirm-view">
        <Card title="Form Not Found" size="large">
          <p>The requested form could not be found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="form-confirm-view">
      <Card
        title={`Confirm: ${form.title}`}
        size="large"
        className="form-confirm-card"
      >
        <div className="form-confirm-header">
          <p className="form-description">{form.description}</p>
        </div>

        <div className="form-confirm-fields">
          {answerFields.length > 0 ? (
            answerFields.map((field, index) => (
              <div key={index} className="answer-field">
                <TextField
                  id={`answer-${index}`}
                  label={field.question}
                  value={field.answer}
                  onChange={(value) => handleFieldChange(index, value)}
                  multiline={field.answer.length > 50}
                  size="large"
                  className="answer-input"
                />
              </div>
            ))
          ) : (
            <div className="no-answers">
              <p>
                No answers found for this form. Start by filling out the form
                first.
              </p>
            </div>
          )}
        </div>

        {answerFields.length > 0 && (
          <>
            <div className="form-confirm-actions">
              <Button
                text={isSubmitting ? "Bevestigen..." : "Bevestigen"}
                onClick={() => setShowConfirmModal(true)}
                isLoading={isSubmitting}
                className="confirm-button"
                disabled={confirmIsSubmitted}
              />
            </div>

            <div className="form-confirm-footer">
              {confirmError && (
                <p
                  className="error-notice"
                  style={{ color: "red", marginBottom: "1rem" }}
                >
                  Error: {confirmError.message}
                </p>
              )}
              {confirmSuccess && (
                <p
                  className="success-notice"
                  style={{ color: "green", marginBottom: "1rem" }}
                >
                  ✓ Formulier succesvol bevestigd!
                </p>
              )}
              <p className="auto-save-notice">
                {saving
                  ? "Opslaan..."
                  : "Je aanpassingen zijn automatisch opgeslagen"}
              </p>
            </div>
          </>
        )}
      </Card>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmission}
        title="Formulier Bevestigen"
      >
        <p>
          Weet je zeker dat je dit formulier wilt bevestigen? Na bevestiging
          wordt het formulier als definitief beschouwd.
        </p>
      </Modal>
    </div>
  );

  function handleConfirmSubmission() {
    setIsSubmitting(true);

    if (form?.formId && answers) {
      // Convert answers object to the expected format
      const confirmAnswers = Object.entries(answers).map(
        ([question, answer]) => ({
          question,
          answer,
        })
      );

      confirmForm(form.formId, form.title, confirmAnswers)
        .then(() => {
          setShowConfirmModal(false);
          navigate("/dashboard/forms/");
        })
        .catch((err) => {
          console.error("Confirmation failed:", err);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      setIsSubmitting(false);
      console.error("Missing form ID or answers");
    }
  }
};

export default FormConfirmView;
