import React, { useEffect, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import "./ContentWriter.css";
import ContentWriterForm from "../../components/custom/ContentWriterForm/ContentWriterForm";
import useGenerateContent from "../../hooks/ContentGeneration/useGenerateContent";
import { AxiosError } from "axios";

interface FormData {
  tone: string;
  audience: string;
  goal: string;
  description: string;
}

interface ContentResponse {
  content: string;
  tokens?: any;
}

const ContentWriter: React.FC = () => {
  const { pageType } = useParams<{ pageType: string }>();

  const [generatedContent, setGeneratedContent] =
    useState<ContentResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<AxiosError<
    unknown,
    any
  > | null>(null);

  const [submitPayload, setSubmitPayload] = useState<FormData | null>(null);

  const { data, loading, error } = useGenerateContent(submitPayload);
  useEffect(() => {
    if (data) setGeneratedContent(data);
    if (loading !== undefined) setIsGenerating(loading);
    if (error) setGenerateError(error);
  }, [data]);

  const handleSubmit = (formData: FormData) => {
    // Add the pageType to the form data if it exists
    const submitData = {
      ...formData,
      ...(pageType && { pageType }),
    };

    setSubmitPayload(submitData);
  };

  return (
    <div className="content-writer">
      <div className="page-header">
        <h1>AI Content Writer</h1>
        <p className="page-subtitle">
          Create the perfect content for your website
          {pageType && <span className="page-type-badge">{pageType}</span>}
        </p>
      </div>

      <div className="content-layout">
        <div className="form-container">
          <ContentWriterForm
            onSubmit={handleSubmit}
            isGenerating={isGenerating}
            pageType={pageType}
          />
        </div>

        {/* Display generated content */}
        <div className="content-display">
          {generatedContent && (
            <div className="generated-content">
              <h2>Generated Content</h2>
              <div className="content-text">{generatedContent.content}</div>
            </div>
          )}

          {generateError && (
            <div className="error-message">Error: {generateError.message}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentWriter;
