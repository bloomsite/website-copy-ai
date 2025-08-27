import React, { useState } from "react";
import { useSubmitForm } from "../../../hooks/Forms/useSubmitForm";
import { useParams } from "react-router-dom";
import { useForm } from "../../../hooks/Forms/useForm";
import "./FormDetailView.css";
import Card from "../../core/Card/Card";
import Button from "../../core/Button/Button";
import FormDetailSection from "./FormDetailSection";

interface FieldValue {
  [sectionIndex: number]: {
    [instanceIndex: number]: {
      [fieldIndex: number]: string;
    };
  };
}

interface SectionInstances {
  [sectionIndex: number]: number; // number of instances for each section
}

const FormDetailView: React.FC = () => {
  const [sectionInstances, setSectionInstances] = useState<SectionInstances>(
    {}
  );
  const { formId } = useParams<{ formId: string }>();
  const { form, isLoading, error: formError } = useForm(formId ?? "");

  const [fieldValues, setFieldValues] = useState<FieldValue>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    submitForm,
    error,
    success,
    isSubmitting: isApiSubmitting,
  } = useSubmitForm();

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
    setFieldValues((prev) => {
      const sectionValues = { ...prev[sectionIdx] };
      for (
        let i = instanceIdx;
        i < Object.keys(sectionValues).length - 1;
        i++
      ) {
        sectionValues[i] = sectionValues[i + 1];
      }
      delete sectionValues[Object.keys(sectionValues).length - 1];
      return {
        ...prev,
        [sectionIdx]: sectionValues,
      };
    });
  };

  const handleFieldChange = (
    sectionIdx: number,
    instanceIdx: number,
    fieldIdx: number,
    value: string
  ) => {
    setFieldValues((prev) => ({
      ...prev,
      [sectionIdx]: {
        ...prev[sectionIdx],
        [instanceIdx]: {
          ...prev[sectionIdx]?.[instanceIdx],
          [fieldIdx]: value,
        },
      },
    }));
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

      return {
        ...prev,
        [sectionIdx]: currentInstances + 1,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Restore answers grouped under section titles, with instances and field labels
    const answers: any = {};
    if (Array.isArray(form.sections)) {
      form.sections.forEach((section: any, sectionIdx: number) => {
        const sectionFieldValues = fieldValues[sectionIdx] || {};
        const sectionTitle = section.title || `Section ${sectionIdx + 1}`;
        answers[sectionTitle] = {};
        Object.entries(sectionFieldValues).forEach(([instanceIdx, fields]) => {
          const instanceLabel = `Instance ${parseInt(instanceIdx) + 1}`;
          answers[sectionTitle][instanceLabel] = {};
          Object.entries(fields).forEach(([fieldIdx, value]) => {
            const field = section.fields?.[parseInt(fieldIdx)];
            const label = field?.label || `Field ${fieldIdx}`;
            answers[sectionTitle][instanceLabel][label] = value;
          });
        });
      });
    }

    console.log(answers);

    submitForm(formId ?? "", form.title, answers)
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
                fieldValues={fieldValues[sectionIdx] || {}}
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
