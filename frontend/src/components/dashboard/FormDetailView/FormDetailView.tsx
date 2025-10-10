import React, { useEffect, useState } from "react";
import { useSubmitForm } from "../../../hooks/Forms/useSubmitForm";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "../../../hooks/Forms/useForm";
import "./FormDetailView.css";
import Card from "../../core/Card/Card";
import Button from "../../core/Button/Button";
import Modal from "../../core/Modal/Modal";
import FormDetailSection from "./FormDetailSection";
import { useFormProgress } from "../../../hooks/Database/useFormProgress";
import { useUserFormSubmissions } from "../../../hooks/Forms/useUserFormSubmissions";

interface SectionInstances {
  [sectionIndex: number]: number;
}

const FormDetailView: React.FC = () => {
  const navigate = useNavigate();
  const [sectionInstances, setSectionInstances] = useState<SectionInstances>(
    {}
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [sectionIdx: number]: {
      [instanceIdx: number]: {
        [fieldIdx: number]: string;
      };
    };
  }>({});

  const { isFormSubmitted } = useUserFormSubmissions();
  const { formId } = useParams<{ formId: string }>();
  const { form, isLoading, error: formError } = useForm(formId ?? "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(false);

  const {
    submitForm,
    error,
    success,
    isSubmitting: isApiSubmitting,
  } = useSubmitForm();

  useEffect(() => {}, [form?.version]);

  const { answers, setAnswers, setOneAnswer } = useFormProgress({
    userId: window.localStorage.getItem("user_uuid"),
    formId: formId ?? "",
    formVersion: form?.version || "0",
    token: window.localStorage.getItem("access_token"),
    debounceMs: 800,
  });

  useEffect(() => {
    if (typeof form?.formId === "string") {
      const checkSubmitStatus = isFormSubmitted(form.formId);
      setSubmitStatus(checkSubmitStatus);
    }
    // Only process answers if we have a valid form version
    if (form?.version && Array.isArray(form.sections)) {
      const inst: SectionInstances = {};

      // For each section, count the number of instances from the answers
      Object.entries(answers || {}).forEach(([sectionIdxStr, sectionData]) => {
        const sectionIdx = Number(sectionIdxStr);
        const instanceCount = Object.keys(sectionData || {}).length;
        if (instanceCount > 0) {
          inst[sectionIdx] = instanceCount - 1; // Subtract 1 because first instance is not counted
        } else {
          inst[sectionIdx] = 0;
        }
      });

      // Make sure all sections are initialized
      form.sections.forEach((_, idx: number) => {
        if (!(idx in inst)) {
          inst[idx] = 0;
        }
      });

      setSectionInstances(inst);
    }
  }, [form?.version, answers]);

  if (isLoading) {
    return <div className="form-detail-loading">Laden...</div>;
  }

  if (formError) {
    return <div className="form-detail-error">{formError}</div>;
  }

  if (!form) {
    return <div className="form-detail-empty">Geen vragenlijst gevonden.</div>;
  }

  const handleRemoveInstance = (sectionIdx: number, instanceIdx: number) => {
    setSectionInstances((prev) => {
      const currentInstances = prev[sectionIdx] || 0;
      return {
        ...prev,
        [sectionIdx]: currentInstances - 1,
      };
    });

    // Clear the field values for this instance and shift the remaining values
    setAnswers((prev) => {
      const next = { ...(prev || {}) };

      const sectionBlock = { ...(next[sectionIdx] || {}) };
      const instanceKeys = Object.keys(sectionBlock)
        .map(Number)
        .sort((a, b) => a - b);

      // shift left from removed index
      for (let i = instanceIdx; i < instanceKeys.length - 1; i++) {
        sectionBlock[i] = sectionBlock[i + 1];
      }
      // remove the last one (now duplicated)
      delete sectionBlock[instanceKeys.length - 1];

      next[sectionIdx] = sectionBlock;
      return next;
    });
  };

  const handleFieldChange = (
    sectionIdx: number,
    instanceIdx: number,
    fieldIdx: number,
    value: string
  ) => {
    // Clear validation error for this field when user starts typing
    if (validationErrors[sectionIdx]?.[instanceIdx]?.[fieldIdx]) {
      setValidationErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (newErrors[sectionIdx]?.[instanceIdx]?.[fieldIdx]) {
          delete newErrors[sectionIdx][instanceIdx][fieldIdx];

          // Clean up empty objects
          if (Object.keys(newErrors[sectionIdx][instanceIdx]).length === 0) {
            delete newErrors[sectionIdx][instanceIdx];
          }
          if (Object.keys(newErrors[sectionIdx]).length === 0) {
            delete newErrors[sectionIdx];
          }
        }
        return newErrors;
      });
    }

    setOneAnswer(sectionIdx, instanceIdx, fieldIdx, value);
  };

  const addSectionInstance = (sectionIdx: number) => {
    setSectionInstances((prev) => {
      const currentInstances = prev[sectionIdx] || 0;
      const section: any = form?.sections?.[sectionIdx];
      const repeatableCount = section?.repeatableCount || 1;

      if (currentInstances + 1 >= repeatableCount) {
        alert(`Je kunt deze sectie maximaal ${repeatableCount} keer herhalen.`);
        return prev;
      }

      const newCount = currentInstances + 1;
      return {
        ...prev,
        [sectionIdx]: newCount,
      };
    });

    // Initialize empty fields for the new instance if needed
    const currentAnswers = answers?.[sectionIdx] || {};
    const nextInstanceIdx = Object.keys(currentAnswers).length;
    if (!currentAnswers[nextInstanceIdx]) {
      setAnswers((prev) => ({
        ...prev,
        [sectionIdx]: {
          ...currentAnswers,
          [nextInstanceIdx]: {},
        },
      }));
    }
  };

  const validateForm = () => {
    // console.log("=== VALIDATION START ===");
    const errors: {
      [sectionIdx: number]: {
        [instanceIdx: number]: {
          [fieldIdx: number]: string;
        };
      };
    } = {};

    let hasErrors = false;

    if (Array.isArray(form.sections)) {
      // console.log("Form has", form.sections.length, "sections");
      form.sections.forEach((section: any, sectionIdx: number) => {
        // console.log(`Checking section ${sectionIdx}:`, section.title);
        // Get number of instances for this section (at least 1)
        const instanceCount = Math.max(
          1,
          (sectionInstances[sectionIdx] || 0) + 1
        );
        // console.log(`Section ${sectionIdx} has ${instanceCount} instances`);

        for (let instanceIdx = 0; instanceIdx < instanceCount; instanceIdx++) {
          // console.log(`Checking instance ${instanceIdx}`);
          if (Array.isArray(section.fields)) {
            section.fields.forEach((field: any, fieldIdx: number) => {
              // console.log(
              //   `Checking field ${fieldIdx}: ${field.label}, required: ${field.required}`
              // );
              if (field.required) {
                const fieldValue =
                  answers?.[sectionIdx]?.[instanceIdx]?.[fieldIdx];
                // console.log(`Field value:`, fieldValue);

                if (!fieldValue || fieldValue.trim() === "") {
                  // console.log(
                  //   `ERROR: Required field "${field.label}" is empty`
                  // );
                  if (!errors[sectionIdx]) errors[sectionIdx] = {};
                  if (!errors[sectionIdx][instanceIdx])
                    errors[sectionIdx][instanceIdx] = {};

                  errors[sectionIdx][instanceIdx][
                    fieldIdx
                  ] = `${field.label} is verplicht`;
                  hasErrors = true;
                } else {
                  // console.log(`Field "${field.label}" is valid`);
                }
              }
            });
          }
        }
      });
    }

    // console.log("Final errors object:", errors);
    // console.log("Has errors:", hasErrors);
    setValidationErrors(errors);
    // console.log("=== VALIDATION END ===");
    return !hasErrors;
  };

  const handleSubmitConfirm = async () => {
    // Double-check validation before final submission
    const isValid = validateForm();
    // console.log("Final validation before submission:", isValid);

    if (!isValid) {
      // console.log("Validation failed on confirmation, closing modal");
      setShowConfirmModal(false);
      // Scroll to first error field
      setTimeout(() => {
        const firstErrorElement = document.querySelector(
          ".input-container.error, .textfield-error, .select-error, .multiselect-error"
        );
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
      return;
    }
    setIsSubmitting(true);
    try {
      await submitForm(formId ?? "", form.title, formDataToSubmit);
      setShowConfirmModal(false);
      navigate("/dashboard/forms");
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // console.log("Form submission started...");
    // console.log("Current answers:", answers);
    // console.log("Current form sections:", form?.sections);

    // Validate form before submission
    const isValid = validateForm();
    // console.log("Validation result:", isValid);
    // console.log("Validation errors after validation:", validationErrors);

    if (!isValid) {
      // console.log("Validation failed, preventing submission");
      // Scroll to first error field if validation fails
      setTimeout(() => {
        const firstErrorElement = document.querySelector(
          ".input-container.error, .textfield-error, .select-error, .multiselect-error"
        );
        // console.log("First error element found:", firstErrorElement);
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          // Try to focus the input within the error element
          const inputElement = firstErrorElement.querySelector(
            "input, select, textarea"
          );
          if (
            inputElement &&
            typeof (inputElement as HTMLElement).focus === "function"
          ) {
            (inputElement as HTMLElement).focus();
          }
        }
      }, 100); // Small delay to ensure DOM is updated
      return;
    }

    // console.log("Validation passed, proceeding with submission");    // Clear any previous validation errors since form is valid
    setValidationErrors({});

    // Restore answers grouped under section titles, with instances and field labels
    const final: any = {};
    if (Array.isArray(form.sections)) {
      form.sections.forEach((section: any, sectionIdx: number) => {
        const sectionFieldValues = answers?.[sectionIdx] || {};
        const sectionTitle = section.title || `Section ${sectionIdx + 1}`;
        final[sectionTitle] = {};
        Object.entries(sectionFieldValues).forEach(([instanceIdx, fields]) => {
          const instanceLabel = `Instance ${parseInt(instanceIdx) + 1}`;
          final[sectionTitle][instanceLabel] = {};
          Object.entries(fields).forEach(([fieldIdx, value]) => {
            const field = section.fields?.[parseInt(fieldIdx)];
            const label = field?.label || `Field ${fieldIdx}`;
            final[sectionTitle][instanceLabel][label] = value;
          });
        });
      });
    }

    setFormDataToSubmit(final);
    setShowConfirmModal(true);
  };

  return (
    <div className="form-detail-container">
      <Card title={form.title} className="form-card">
        <p className="form-detail-description">{form.description}</p>
        <p className="form-detail-short">{form.shortDescription}</p>
        <form className="form-detail-form" onSubmit={handleSubmit}>
          {Array.isArray(form.sections) &&
            form.sections.map((section: any, sectionIdx: number) => (
              <FormDetailSection
                key={sectionIdx}
                section={section}
                sectionIdx={sectionIdx}
                instances={sectionInstances[sectionIdx] || 0}
                fieldValues={answers?.[sectionIdx] || {}}
                validationErrors={(() => {
                  const sectionErrors = validationErrors?.[sectionIdx] || {};
                  // console.log(
                  //   `Passing validation errors for section ${sectionIdx}:`,
                  //   sectionErrors
                  // );
                  return sectionErrors;
                })()}
                onFieldChange={(
                  instanceIdx: number,
                  fieldIdx: number,
                  value: string
                ) =>
                  handleFieldChange(sectionIdx, instanceIdx, fieldIdx, value)
                }
                onAddInstance={() => addSectionInstance(sectionIdx)}
                onRemoveInstance={(instanceIdx: number) =>
                  handleRemoveInstance(sectionIdx, instanceIdx)
                }
              />
            ))}
          <Button
            onClick={() => validateForm()}
            text={
              isSubmitting || isApiSubmitting
                ? "Aan het verzenden..."
                : "Verzenden"
            }
            type="submit"
            isLoading={isSubmitting || isApiSubmitting}
            className="form-detail-submit"
            disabled={submitStatus}
          />
          {error && <div className="form-detail-error">{error}</div>}
          {success && (
            <div className="form-detail-success">
              Formulier succesvol verzonden!
            </div>
          )}
        </form>
      </Card>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSubmitConfirm}
        title="Formulier Bevestigen"
      >
        <p>
          Weet u zeker dat u dit formulier wilt verzenden? Na verzending kunt u
          geen wijzigingen meer aanbrengen.
        </p>
      </Modal>
    </div>
  );
};

export default FormDetailView;
