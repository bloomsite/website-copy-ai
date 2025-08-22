import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "../../../hooks/Forms/useForm";
import "./FormDetailView.css";
import Card from "../../core/Card/Card";
import TextField from "../../core/TextField/TextField";
import Button from "../../core/Button/Button";

interface FieldValue {
  [sectionIndex: number]: {
    [fieldIndex: number]: string;
  };
}

const FormDetailView: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const { form, isLoading, error } = useForm(formId ?? "");
  const [fieldValues, setFieldValues] = useState<FieldValue>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return <div className="form-detail-loading">Laden...</div>;
  }

  if (error) {
    return <div className="form-detail-error">{error}</div>;
  }

  if (!form) {
    return <div className="form-detail-empty">Geen vragenlijst gevonden.</div>;
  }

  const handleFieldChange = (
    sectionIdx: number,
    fieldIdx: number,
    value: string
  ) => {
    setFieldValues((prev) => ({
      ...prev,
      [sectionIdx]: {
        ...prev[sectionIdx],
        [fieldIdx]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // You can process or send fieldValues here
    setTimeout(() => {
      setIsSubmitting(false);
      console.log("Form submitted:", fieldValues);
      alert("Form submitted! Check console for values.");
    }, 800);
  };

  return (
    <div className="form-detail-container">
      <Card title={form.title} subtitle={`Version: ${form.version}`}>
        <p className="form-detail-description">{form.description}</p>
        <p className="form-detail-short">{form.shortDescription}</p>
        <form className="form-detail-form" onSubmit={handleSubmit}>
          {Array.isArray(form.sections) &&
            form.sections.map((section: any, sectionIdx: number) => (
              <div key={sectionIdx} className="form-section">
                <h4 className="form-section-title">{section.title}</h4>
                {section.description && (
                  <p className="form-section-description">
                    {section.description}
                  </p>
                )}
                {Array.isArray(section.fields) &&
                  section.fields.map((field: any, fieldIdx: number) => (
                    <div key={fieldIdx} className="form-field-row">
                      <TextField
                        helperText={field.description}
                        size={"large"}
                        id={`section-${sectionIdx}-field-${fieldIdx}`}
                        label={field.label}
                        value={fieldValues[sectionIdx]?.[fieldIdx] ?? ""}
                        onChange={(value) =>
                          handleFieldChange(sectionIdx, fieldIdx, value)
                        }
                        type={field.type}
                        required={field.required}
                        className="form-field-input"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
              </div>
            ))}
          <Button
            text={isSubmitting ? "Aan het verzenden..." : "Verzenden"}
            type="submit"
            isLoading={isSubmitting}
            className="form-detail-submit"
          />
        </form>
      </Card>
    </div>
  );
};

export default FormDetailView;
