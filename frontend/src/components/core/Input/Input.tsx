import React, { useState } from "react";
import { getIcon } from "../../../core/Utils/getIcon";
import apiClient from "../../../services/apiClient";
import "./Input.css";

interface InputProps {
  id: string;
  label?: string;
  type?: "text" | "email" | "file" | "password" | "number";
  value?: string;
  onChange: (value: string) => void;
  onFileSelect?: (file: File) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  className?: string;
  accept?: string; // For file inputs
  size?: "small" | "medium" | "large";
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  value = "",
  onChange,
  onFileSelect,
  placeholder,
  required = false,
  disabled = false,
  helperText,
  className = "",
  accept,
  size = "medium",
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // show filename immediately
    setSelectedFileName(file.name);
    setError(null);
    onFileSelect?.(file);

    // Upload to backend which returns a SAS URL
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("image", file);

      // adjust endpoint if your backend uses a different route
      const res = await apiClient.post("/api/forms/upload-image/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const sasUrl =
        res?.data?.url || res?.data?.blob_url || res?.data?.blobUrl || null;

      if (!sasUrl) {
        throw new Error("No upload URL returned");
      }

      // store SAS URL as the field value (so backend FormSubmitView will save it)
      onChange(sasUrl);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Upload failed");
      // clear value on failure
      onChange("");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClearFile = () => {
    setSelectedFileName("");
    setError(null);
    onChange("");
    const fileInput = document.getElementById(id) as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className={`input-container ${className} input-${size}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}

      {type === "file" ? (
        <div className="file-input-wrapper">
          <input
            id={id}
            type="file"
            onChange={handleFileChange}
            required={required}
            disabled={disabled || uploading}
            accept={accept}
            className="file-input-hidden"
          />
          <button
            type="button"
            onClick={() => document.getElementById(id)?.click()}
            disabled={disabled || uploading}
            className={`file-input-button ${
              selectedFileName ? "file-selected" : ""
            }`}
          >
            <span className="file-button-text">
              {uploading ? "Uploaden..." : "Kies een foto"}
            </span>
          </button>

          {/* status indicator */}
          {selectedFileName && !uploading && !error && (
            <div className="file-status-indicator">{getIcon("check", 20)}</div>
          )}
          {uploading && <div className="file-status-indicator uploading" />}
          {error && <div className="file-status-indicator error">⚠</div>}
        </div>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="input-field"
        />
      )}

      {type === "file" && selectedFileName && (
        <div className="selected-file-display">
          <div className="file-info">
            <span className="file-icon">📎</span>
            <span className="file-name">{selectedFileName}</span>
          </div>
          <button
            type="button"
            onClick={handleClearFile}
            className="clear-file-button"
            title="Clear selected file"
            disabled={uploading}
          >
            ✕
          </button>
        </div>
      )}

      {helperText && <div className="input-helper-text">{helperText}</div>}
      {error && <div className="upload-error-message">{error}</div>}
    </div>
  );
};

export default Input;
