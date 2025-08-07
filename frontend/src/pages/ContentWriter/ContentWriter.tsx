import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./ContentWriter.css";
import useGenerateContent from "../../hooks/ContentGeneration/useGenerateContent";
import Button from "../../components/core/Button/Button";
import TextField from "../../components/core/TextField/TextField";
import Select from "../../components/core/Select/Select";

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

const ContentWriter: React.FC = () => {
  const { pageType } = useParams<{ pageType: string }>();

  const [extraInput, setExtraInput] = useState("");
  const [submittedExtraInputs, setSubmittedExtraInputs] = useState<string[]>(
    []
  );

  const handleExtraInputSubmit = () => {
    if (extraInput.trim()) {
      setSubmittedExtraInputs((prev) => [...prev, extraInput.trim()]);
      setExtraInput("");
    }
  };

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

  // State to control when to trigger the API call
  const [submitPayload, setSubmitPayload] = useState<any>(null);

  // Use the hook with the payload
  const {
    data: generatedContent,
    loading: isGenerating,
    error: generateError,
  } = useGenerateContent(submitPayload);

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
      const submitData = { ...formData, ...(pageType && { pageType }) };

      // Trigger the API call by setting the payload
      setSubmitPayload(submitData);
    }
  };

  const isFormValid =
    formData.tone &&
    formData.audience &&
    formData.goal &&
    formData.description &&
    !validateDescription(formData.description);

  return (
    <>
      <div className="content-writer-items">
        <div className="content-writer-page">
          <div className="page-header">
            <h1>Geef Details Voor Uw Content</h1>
            <p className="page-subtitle">
              Help ons uw behoeften te begrijpen zodat we de perfecte content
              voor uw doelgroep kunnen genereren.
              {pageType && <span className="page-type-badge">{pageType}</span>}
            </p>
          </div>

          <div className="content-writer-layout">
            {/* Left Column - Form */}
            <div className="content-form-column">
              <form className="content-form" onSubmit={handleSubmit}>
                <div className="field-group">
                  <label htmlFor="tone" className="field-label">
                    Toon van Stem
                  </label>
                  <p className="field-help">
                    Kies de stijl waarin uw content geschreven wordt.
                  </p>
                  <TextField
                    id="tone"
                    value={formData.tone}
                    onChange={(value) => handleChange("tone", value)}
                    label="Toon van Stem"
                    placeholder="Selecteer een toon..."
                    disabled={isGenerating}
                    type="text"
                    validationState={errors.tone ? "error" : undefined}
                    helperText={errors.tone}
                    required
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="audience" className="field-label">
                    Doelgroep
                  </label>
                  <p className="field-help">
                    Selecteer de primaire doelgroep die u wilt bereiken.
                  </p>
                  <TextField
                    id="audience"
                    value={formData.audience}
                    onChange={(value) => handleChange("audience", value)}
                    label="Doelgroep"
                    placeholder="Selecteer een doelgroep..."
                    disabled={isGenerating}
                    type="text"
                    validationState={errors.audience ? "error" : undefined}
                    helperText={errors.audience}
                    required
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="goal" className="field-label">
                    Doel
                  </label>
                  <p className="field-help">
                    Kies het hoofddoel voor uw content.
                  </p>
                  <TextField
                    id="goal"
                    value={formData.goal}
                    onChange={(value) => handleChange("goal", value)}
                    label="Doel"
                    placeholder="Selecteer een doel..."
                    disabled={isGenerating}
                    type="text"
                    validationState={errors.goal ? "error" : undefined}
                    helperText={errors.goal}
                    required
                  />
                </div>

                <div className="field-group">
                  <Select
                    id="goal"
                    label="Doel van de gegenereerde content"
                    value={formData.goal}
                    options={goalOptions}
                    onChange={(value) => handleChange("goal", value)}
                    helperText="yo"
                  ></Select>
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
                  text={
                    isGenerating ? "Content Genereren..." : "Genereer Content"
                  }
                  disabled={!isFormValid || isGenerating}
                  isLoading={isGenerating}
                />
              </form>
            </div>

            {/* Right Column - Content Display */}
          </div>
        </div>
        <div className="content-writer-display">
          <div className="content-display-section">
            <div className="page-header">
              <h2>Gegenereerde content</h2>
            </div>

            {/* Display generated content in cards */}
            {generatedContent && (
              <div className="content-card">
                <div className="content-text">{generatedContent.content}</div>
              </div>
            )}

            {/* Display API error if any */}
            {generateError && (
              <div className="content-card content-assistant">
                <div
                  className="content-text"
                  style={{ color: "var(--color-error)" }}
                >
                  Fout bij het genereren van content: {generateError.message}
                </div>
              </div>
            )}

            {/* Extra inputs as separate cards */}
            {submittedExtraInputs.map((input, index) => (
              <div className="content-card content-user" key={index}>
                <div className="content-text">{input}</div>
              </div>
            ))}

            {generatedContent && (
              <div className="extra-input-section">
                <label htmlFor="extra-input" className="field-label">
                  Geef extra input
                </label>
                <TextField
                  id="extra-input"
                  label="Extra input"
                  placeholder="Voeg extra details of feedback toe voor de content..."
                  value={extraInput}
                  onChange={setExtraInput}
                  multiline
                  rows={3}
                />
                <Button
                  type="button"
                  onClick={handleExtraInputSubmit}
                  text="Extra input geven"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentWriter;
