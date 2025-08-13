import React, { useState } from "react";
import TextField from "../../core/TextField/TextField";
import Select from "../../core/Select/Select";
import Button from "../../core/Button/Button";
import "./ContentWriterForm.css";

const toneOptions = [
  { value: "professional", label: "Professioneel" },
  { value: "friendly", label: "Vriendelijk" },
  { value: "persuasive", label: "Overtuigend" },
  { value: "informative", label: "Informatief" },
  { value: "casual", label: "Informeel" },
];

const audienceOptions = [
  { value: "men", label: "Mannen" },
  { value: "women", label: "Vrouwen" },
  { value: "students", label: "Studenten" },
  { value: "parents", label: "Ouders" },
  { value: "starting-parents", label: "Beginnende ouders" },
];

const goalOptions = [
  { value: "increase-sales", label: "Verkoop Vergroten" },
  { value: "build-awareness", label: "Bewustzijn Opbouwen" },
  { value: "educate-audience", label: "Doelgroep Informeren" },
  { value: "promote-event", label: "Evenement Promoten" },
  { value: "generate-leads", label: "Leads Genereren" },
];

const MIN_WORDS = 15;

interface FormData {
  tone: string;
  audience: string;
  goal: string;
  description: string;
}

interface ContentWriterFormProps {
  onSubmit: (data: FormData) => void;
  isGenerating: boolean;
  pageType?: string;
}

const ContentWriterForm: React.FC<ContentWriterFormProps> = ({
  onSubmit,
  isGenerating,
}) => {
  const [formData, setFormData] = useState<FormData>({
    tone: "",
    audience: "",
    goal: "",
    description: "",
  });

  const [errors, setErrors] = useState<FormData>({
    tone: "",
    audience: "",
    goal: "",
    description: "",
  });

  const validateDescription = (value: string): string => {
    const stripped = value
      .replace(/<[^>]*>/g, "")
      .trim()
      .replace(/\s+/g, " ");
    const wordCount = stripped === "" ? 0 : stripped.split(/\s+/).length;
    if (wordCount === 0) return "Dit veld is verplicht";
    if (wordCount < MIN_WORDS) return `Gebruik minimaal ${MIN_WORDS} woorden.`;
    return "";
  };

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormData = {
      tone: formData.tone ? "" : "Dit veld is verplicht",
      audience: formData.audience ? "" : "Dit veld is verplicht",
      goal: formData.goal ? "" : "Dit veld is verplicht",
      description: validateDescription(formData.description),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (!hasErrors) {
      onSubmit(formData);
    }
  };

  const isFormValid =
    formData.tone &&
    formData.audience &&
    formData.goal &&
    formData.description &&
    !validateDescription(formData.description);

  return (
    <div className="content-form-column">
      <form className="content-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="tone" className="field-label">
            Toon van Stem
          </label>
          <p className="field-help">
            Kies de stijl waarin uw content geschreven wordt.
          </p>
          <Select
            id="tone"
            label="Toon van Stem"
            value={formData.tone}
            options={toneOptions}
            onChange={(value) => handleChange("tone", value)}
            helperText={errors.tone}
          />
        </div>

        <div className="field-group">
          <label htmlFor="audience" className="field-label">
            Doelgroep
          </label>
          <p className="field-help">
            Selecteer de primaire doelgroep die u wilt bereiken.
          </p>
          <Select
            id="audience"
            label="Doelgroep"
            value={formData.audience}
            options={audienceOptions}
            onChange={(value) => handleChange("audience", value)}
            helperText={errors.audience}
          />
        </div>

        <div className="field-group">
          <label htmlFor="goal" className="field-label">
            Doel
          </label>
          <p className="field-help">Kies het hoofddoel voor uw content.</p>
          <Select
            id="goal"
            label="Doel van de gegenereerde content"
            value={formData.goal}
            options={goalOptions}
            onChange={(value) => handleChange("goal", value)}
            helperText={errors.goal}
          />
        </div>

        <div className="field-group">
          <label htmlFor="description" className="field-label">
            Beschrijf Uw Service
          </label>
          <p className="field-help">
            Beschrijf kort de service of het product dat u aanbiedt.
          </p>
          <TextField
            id="description"
            value={formData.description}
            onChange={(value) => handleChange("description", value)}
            label="Beschrijf Uw Service"
            placeholder="Vertel ons over uw service of product..."
            disabled={isGenerating}
            type="text"
            multiline
            rows={5}
            validationState={errors.description ? "error" : undefined}
            helperText={errors.description}
            required
          />
        </div>

        <Button
          type="submit"
          text={isGenerating ? "Content Genereren..." : "Genereer Content"}
          disabled={!isFormValid || isGenerating}
          isLoading={isGenerating}
        />
      </form>
    </div>
  );
};

export default ContentWriterForm;
