import React, { useEffect, useState } from "react";
import { useSubmitForm } from "../../../hooks/Forms/useSubmitForm";
import { useParams } from "react-router-dom";
import { useForm } from "../../../hooks/Forms/useForm";
import "./FormDetailView.css";
import Card from "../../core/Card/Card";
import Button from "../../core/Button/Button";
import FormDetailSection from "./FormDetailSection";
import { useFormProgress } from "../../../hooks/Database/useFormProgress";

interface SectionInstances {
  [sectionIndex: number]: number;
}

const FormDetailView: React.FC = () => {
  const [sectionInstances, setSectionInstances] = useState<SectionInstances>(
    {}
  );
  const { formId } = useParams<{ formId: string }>();
  const { form, isLoading, error: formError } = useForm(formId ?? "");

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    formVersion: form?.version || "7",
    token: window.localStorage.getItem("access_token"),
    debounceMs: 800,
  });

  useEffect(() => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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

    submitForm(formId ?? "", form.title, final)
      .then(() => {
        setIsSubmitting(false);
      })
      .catch(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="form-detail-container">
      <Card
        title={form.title}
        subtitle={`Version: ${form.version}`}
        className="form-card"
      >
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
            text={
              isSubmitting || isApiSubmitting
                ? "Aan het verzenden..."
                : "Verzenden"
            }
            type="submit"
            isLoading={isSubmitting || isApiSubmitting}
            className="form-detail-submit"
          />
          {error && <div className="form-detail-error">{error}</div>}
          {success && (
            <div className="form-detail-success">
              Formulier succesvol verzonden!
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default FormDetailView;
