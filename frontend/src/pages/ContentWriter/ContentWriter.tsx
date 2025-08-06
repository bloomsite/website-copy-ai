import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./ContentWriter.css";
import useGenerateContent from "../../hooks/ContentGeneration/useGenerateContent";

const MIN_WORDS = 30;

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
    if (wordCount === 0) return "This field is required";
    if (wordCount < MIN_WORDS) return `Use at least ${MIN_WORDS} words.`;
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
      tone: formData.tone ? "" : "This field is required",
      audience: formData.audience ? "" : "This field is required",
      goal: formData.goal ? "" : "This field is required",
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

  const getFieldClass = (fieldName: keyof FormData) => {
    if (errors[fieldName]) return "field-invalid";
    if (formData[fieldName] && fieldName !== "description")
      return "field-valid";
    if (
      fieldName === "description" &&
      formData.description &&
      !validateDescription(formData.description)
    ) {
      return "field-valid";
    }
    return "";
  };

  return (
    <>
      <div className="content-writer-items">
        <div className="content-writer-page">
          <div className="page-header">
            <h1>Provide Details For Your Content</h1>
            <p className="page-subtitle">
              Help us understand your needs so we can generate the perfect
              content for your audience.
              {pageType && <span className="page-type-badge">{pageType}</span>}
            </p>
          </div>

          <div className="content-writer-layout">
            {/* Left Column - Form */}
            <div className="content-form-column">
              <form className="content-form" onSubmit={handleSubmit}>
                <div className="field-group">
                  <label htmlFor="tone" className="field-label">
                    Tone of Voice
                  </label>
                  <p className="field-help">
                    Choose the style in which your content will be written.
                  </p>
                  <select
                    id="tone"
                    value={formData.tone}
                    onChange={(e) => handleChange("tone", e.target.value)}
                    className={`field-input ${getFieldClass("tone")}`}
                    disabled={isGenerating}
                  >
                    <option value="">Select a tone...</option>
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="persuasive">Persuasive</option>
                    <option value="informative">Informative</option>
                    <option value="casual">Casual</option>
                  </select>
                  {errors.tone && (
                    <div className="field-error">{errors.tone}</div>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor="audience" className="field-label">
                    Target Audience
                  </label>
                  <p className="field-help">
                    Select the primary audience you want to reach.
                  </p>
                  <select
                    id="audience"
                    value={formData.audience}
                    onChange={(e) => handleChange("audience", e.target.value)}
                    className={`field-input ${getFieldClass("audience")}`}
                    disabled={isGenerating}
                  >
                    <option value="">Select an audience...</option>
                    <option value="general-public">General Public</option>
                    <option value="business-owners">Business Owners</option>
                    <option value="students">Students</option>
                    <option value="parents">Parents</option>
                    <option value="tech-enthusiasts">Tech Enthusiasts</option>
                  </select>
                  {errors.audience && (
                    <div className="field-error">{errors.audience}</div>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor="goal" className="field-label">
                    Goal
                  </label>
                  <p className="field-help">
                    Choose the main goal for your content.
                  </p>
                  <select
                    id="goal"
                    value={formData.goal}
                    onChange={(e) => handleChange("goal", e.target.value)}
                    className={`field-input ${getFieldClass("goal")}`}
                    disabled={isGenerating}
                  >
                    <option value="">Select a goal...</option>
                    <option value="increase-sales">Increase Sales</option>
                    <option value="build-awareness">Build Awareness</option>
                    <option value="educate-audience">Educate Audience</option>
                    <option value="promote-event">Promote Event</option>
                    <option value="generate-leads">Generate Leads</option>
                  </select>
                  {errors.goal && (
                    <div className="field-error">{errors.goal}</div>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor="description" className="field-label">
                    Describe Your Service
                  </label>
                  <p className="field-help">
                    Briefly describe the service or product you provide.
                  </p>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className={`field-input field-textarea ${getFieldClass(
                      "description"
                    )}`}
                    placeholder="Tell us about your service or product..."
                    disabled={isGenerating}
                  />
                  {errors.description && (
                    <div className="field-error">{errors.description}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={!isFormValid || isGenerating}
                >
                  {isGenerating ? "Generating Content..." : "Generate Content"}
                </button>
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
                  Error generating content: {generateError.message}
                </div>
              </div>
            )}

            {/* Extra inputs as separate cards */}
            {submittedExtraInputs.map((input, index) => (
              <div className="content-card content-user" key={index}>
                <div className="content-text">{input}</div>
              </div>
            ))}

            <div className="extra-input-section">
              <label htmlFor="extra-input" className="field-label">
                Geef extra input
              </label>
              <textarea
                id="extra-input"
                className="field-input field-textarea"
                placeholder="Add any extra details or feedback for the content..."
                value={extraInput}
                onChange={(e) => setExtraInput(e.target.value)}
              />
              <button
                type="button"
                onClick={handleExtraInputSubmit}
                className="submit-button"
              >
                Extra input geven
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentWriter;
