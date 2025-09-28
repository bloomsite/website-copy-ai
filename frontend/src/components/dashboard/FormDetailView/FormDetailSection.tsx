import React from "react";
import TextField from "../../core/TextField/TextField";
import Select from "../../core/Select/Select";
import Multiselect from "../../core/Multiselect/Multiselect";
import Input from "../../core/Input/Input";
import Button from "../../core/Button/Button";
import type { FormField } from "../../../core/Types/typeFormObject";
import "./FormDetailSection.css";

interface FormDetailSectionProps {
  section: {
    title: string;
    description?: string;
    repeatableCount?: number;
    fields: FormField[];
  };
  sectionIdx: number;
  instances: number;
  fieldValues: {
    [instanceIndex: number]: {
      [fieldIndex: number]: string;
    };
  };
  onFieldChange: (instanceIdx: number, fieldIdx: number, value: string) => void;
  onAddInstance: () => void;
  onRemoveInstance: (instanceIdx: number) => void;
}

const FormDetailSection: React.FC<FormDetailSectionProps> = ({
  section,
  sectionIdx,
  instances,
  fieldValues,
  onFieldChange,
  onAddInstance,
  onRemoveInstance,
}) => {
  const instanceArray = Array.from({ length: instances + 1 });
  const repeatableCount = section.repeatableCount || 1;

  return (
    <div className="form-section">
      <div className="form-section-header">
        <h4 className="form-section-title">{section.title}</h4>
      </div>

      {section.description && (
        <p className="form-section-description">{section.description}</p>
      )}

      {instanceArray.map((_, instanceIdx) => (
        <div key={instanceIdx} className="section-instance">
          <div className="section-instance-header">
            {instanceIdx > 0 ? (
              <>
                <h5 className="instance-title">
                  {section.title} {instanceIdx + 1}
                </h5>
                <Button
                  text="Verwijderen"
                  onClick={() => onRemoveInstance(instanceIdx)}
                  className="remove-section-button"
                />
              </>
            ) : (
              <div />
            )}
          </div>

          {Array.isArray(section.fields) &&
            section.fields.map((field: FormField, fieldIdx: number) => (
              <div key={fieldIdx} className="form-field-row">
                {field.type === "multiselect" ? (
                  <Multiselect
                    id={`section-${sectionIdx}-instance-${instanceIdx}-field-${fieldIdx}`}
                    label={field.label}
                    values={(fieldValues[instanceIdx]?.[fieldIdx] ?? "")
                      .split(",")
                      .filter(Boolean)}
                    onChange={(values) =>
                      onFieldChange(instanceIdx, fieldIdx, values.join(","))
                    }
                    options={
                      field.options?.map(
                        (opt): { value: string; label: string } =>
                          typeof opt === "object" &&
                          opt !== null &&
                          "value" in opt &&
                          "label" in opt
                            ? {
                                value: String(opt.value),
                                label: String(opt.label),
                              }
                            : { value: String(opt), label: String(opt) }
                      ) ?? []
                    }
                    helperText={field.description}
                    required={field.required}
                    className="form-field-input"
                    placeholder={field.placeholder || "Selecteer opties..."}
                    size="large"
                  />
                ) : field.type === "select" || field.type === "select_few" ? (
                  <Select
                    id={`section-${sectionIdx}-instance-${instanceIdx}-field-${fieldIdx}`}
                    label={field.label}
                    value={fieldValues[instanceIdx]?.[fieldIdx] ?? ""}
                    onChange={(value) =>
                      onFieldChange(instanceIdx, fieldIdx, value)
                    }
                    options={
                      field.options?.map(
                        (opt): { value: string; label: string } =>
                          typeof opt === "object" &&
                          opt !== null &&
                          "value" in opt &&
                          "label" in opt
                            ? {
                                value: String(opt.value),
                                label: String(opt.label),
                              }
                            : { value: String(opt), label: String(opt) }
                      ) ?? []
                    }
                    helperText={field.description}
                    required={field.required}
                    className="form-field-input"
                    placeholder={field.placeholder || "Selecteer een optie..."}
                    size="large"
                  />
                ) : field.type === "image" ? (
                  <Input
                    id={`section-${sectionIdx}-instance-${instanceIdx}-field-${fieldIdx}`}
                    label={field.label}
                    type="file"
                    accept="image/*"
                    onChange={(value) =>
                      onFieldChange(instanceIdx, fieldIdx, value)
                    }
                    onFileSelect={(file) => {
                      // TODO: Upload to Azure Blob Storage
                      console.log("File selected:", file);
                    }}
                    helperText={field.description}
                    required={field.required}
                    className="form-field-input"
                    size="large"
                  />
                ) : (
                  <TextField
                    helperText={field.description}
                    size={"large"}
                    id={`section-${sectionIdx}-instance-${instanceIdx}-field-${fieldIdx}`}
                    label={field.label}
                    value={fieldValues[instanceIdx]?.[fieldIdx] ?? ""}
                    onChange={(value) =>
                      onFieldChange(instanceIdx, fieldIdx, value)
                    }
                    multiline={field.type === "text_area"}
                    required={field.required}
                    className="form-field-input"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
        </div>
      ))}

      {repeatableCount > 1 && instances + 1 < repeatableCount && (
        <div className="add-section-container">
          <Button
            text="+"
            onClick={onAddInstance}
            className="add-section-button"
          />
        </div>
      )}
    </div>
  );
};

export default FormDetailSection;
