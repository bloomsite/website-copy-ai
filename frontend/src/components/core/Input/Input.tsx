import React, { useState, useEffect, useRef } from "react";
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
  error?: string; // Error message to display
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
  error,
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // show filename immediately
    setSelectedFileName(file.name);
    setUploadError(null);
    onFileSelect?.(file);

    // create local preview immediately so user sees the image before upload completes
    try {
      // revoke previous object URL if any
      if (objectUrlRef.current) {
        try {
          URL.revokeObjectURL(objectUrlRef.current);
        } catch {}
        objectUrlRef.current = null;
      }
      const localUrl = URL.createObjectURL(file);
      objectUrlRef.current = localUrl;
      setPreviewUrl(localUrl);
    } catch (err) {
      // If URL.createObjectURL isn't available, ignore and continue
      console.debug("Could not create local preview URL", err);
    }

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
      // replace local preview with the uploaded SAS URL so preview persists after upload
      setPreviewUrl(sasUrl);
    } catch (err: any) {
      setUploadError(
        err?.response?.data?.error || err.message || "Upload failed"
      );
      // clear value on failure
      onChange("");
      // clear preview if upload failed
      if (objectUrlRef.current) {
        try {
          URL.revokeObjectURL(objectUrlRef.current);
        } catch {}
        objectUrlRef.current = null;
      }
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClearFile = () => {
    setSelectedFileName("");
    setUploadError(null);
    onChange("");
    // revoke any locally created object URL
    if (objectUrlRef.current) {
      try {
        URL.revokeObjectURL(objectUrlRef.current);
      } catch {}
      objectUrlRef.current = null;
    }
    setPreviewUrl(null);
    const fileInput = document.getElementById(id) as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  };

  // If parent supplies a value (e.g. existing SAS URL), show it as preview
  useEffect(() => {
    if (value) {
      setPreviewUrl(value);
    }
  }, [value]);

  // cleanup any object URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        try {
          URL.revokeObjectURL(objectUrlRef.current);
        } catch {}
        objectUrlRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={`input-container ${className} input-${size} ${
        error ? "error" : ""
      }`}
    >
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}

      {helperText && <div className="input-helper-text">{helperText}</div>}

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
            } `}
          >
            <span className="file-button-text">
              {uploading ? "Uploaden..." : "Kies een foto"}
            </span>
          </button>

          {/* status indicator */}
          {selectedFileName && !uploading && !uploadError && (
            <div className="file-status-indicator">{getIcon("check", 20)}</div>
          )}
          {uploading && <div className="file-status-indicator uploading" />}
          {uploadError && <div className="file-status-indicator error">⚠</div>}
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

      {/* Display validation error or upload error */}
      {error && <div className="input-error-message">{error}</div>}
      {uploadError && <div className="upload-error-message">{uploadError}</div>}

      {/* image preview */}
      {type === "file" && previewUrl && (
        <div className="image-preview-wrapper">
          <img src={previewUrl} alt="Selected" className="image-preview" />
        </div>
      )}
    </div>
  );
};

export default Input;
