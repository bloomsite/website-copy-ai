import React, { useState, useEffect } from "react";
import Button from "../../core/Button/Button";
import Card from "../../core/Card/Card";
import Select from "../../core/Select/Select";
import TextField from "../../core/TextField/TextField";
import { useFormsOverview } from "../../../hooks/Forms/useFormsOverview";
import { useFormConfirmProgress } from "../../../hooks/Database/useFormConfirmProgress";

interface FormSubmissionCardProps {
  userId: string;
  onClose: () => void;
}

interface QuestionAnswer {
  question: string;
  answer: string;
}

export const FormSubmissionCard: React.FC<FormSubmissionCardProps> = ({
  userId,
  onClose,
}) => {
  const [formData, setFormData] = useState<{
    formId: string;
    submissionData: string;
    formVersion: string;
  }>({
    formId: "",
    submissionData: "",
    formVersion: "1",
  });
  const [generatedFormOptions, setGeneratedFormOptions] = useState<
    { label: string; value: string; version: string }[]
  >([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { retrieveForms } = useFormsOverview();
  const token = window.localStorage.getItem("access_token") ?? "";

  useEffect(() => {
    retrieveForms("ai_generated").then((forms) => {
      setGeneratedFormOptions(
        forms.map((form) => ({
          label: form.title,
          value: form.formId,
          version: form.version,
        }))
      );
    });
  }, []);

  const { saving, error, saveProgressNow } = useFormConfirmProgress({
    userId,
    token,
    formId: formData.formId,
    debounceMs: 0, // Disable auto-save
    skipFetch: true, // Don't fetch existing progress
  });

  const validateJsonData = (jsonString: string): string | null => {
    if (!jsonString.trim()) return null; // Empty is valid

    try {
      const parsed = JSON.parse(jsonString);

      // Check if it's an array
      if (!Array.isArray(parsed)) {
        return "Data must be an array of question-answer objects";
      }

      // Check if array items have correct structure
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (typeof item !== "object" || item === null) {
          return `Item ${i + 1} must be an object`;
        }
        if (
          !item.hasOwnProperty("question") ||
          !item.hasOwnProperty("answer")
        ) {
          return `Item ${i + 1} must have "question" and "answer" properties`;
        }
        if (
          typeof item.question !== "string" ||
          typeof item.answer !== "string"
        ) {
          return `Item ${i + 1}: "question" and "answer" must be strings`;
        }
      }

      return null; // Valid
    } catch (error) {
      return "Invalid JSON format";
    }
  };

  const handleSubmissionDataChange = (value: string) => {
    setFormData((prev) => ({ ...prev, submissionData: value }));
    const error = validateJsonData(value);
    setValidationError(error);
  };

  const handleSubmitForm = async () => {
    if (!formData.submissionData || !formData.formId) return;

    try {
      const questionAnswers: QuestionAnswer[] = JSON.parse(
        formData.submissionData
      );

      // Convert to submission format
      const submissionAnswers = questionAnswers.reduce((acc, qa) => {
        acc[qa.question] = qa.answer;
        return acc;
      }, {} as { [key: string]: string });

      // Submit form for user
      await saveProgressNow(submissionAnswers);

      // Reset and close
      setFormData({ formId: "", submissionData: "", formVersion: "1" });
      onClose();
    } catch (error) {
      console.error("Error parsing submission data:", error);
    }
  };

  const handleCancel = () => {
    setFormData({ formId: "", submissionData: "", formVersion: "1" });
    onClose();
  };

  return (
    <div className="form-card-overlay">
      <Card
        title="Add Manual Form Submission"
        className="form-submission-card"
        size="large"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Select
            id="form-id-select"
            label="Formulier"
            value={formData.formId}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, formId: value }))
            }
            options={generatedFormOptions}
            placeholder="Selecteer een formulier..."
            required
          />

          <TextField
            id="submission-data"
            label="Form Answers (JSON)"
            value={formData.submissionData}
            onChange={handleSubmissionDataChange}
            placeholder='[{"question": "What do you offer?", "answer": "Specialised services"}]'
            multiline
            required
          />

          {validationError && (
            <div style={{ color: "orange", fontSize: "0.875rem" }}>
              Validation: {validationError}
            </div>
          )}

          {error && (
            <div style={{ color: "red", fontSize: "0.875rem" }}>
              Error: {error.message}
            </div>
          )}

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
              onClick={handleCancel}
              className="cancel-button"
            />
            <Button
              text={saving ? "Submitting..." : "Submit Form"}
              onClick={handleSubmitForm}
              disabled={
                saving ||
                !formData.formId ||
                !formData.submissionData ||
                validationError !== null
              }
              className="save-button"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
