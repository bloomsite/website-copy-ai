import React, { useState } from "react";
import "./TextField.css";

type ValidationState = "success" | "error" | "warning" | undefined;
type Size = "small" | "medium" | "large";

interface TextFieldProps {
  // Basic props
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;

  // Optional props
  type?: "text" | "password" | "email" | "number" | "search" | "tel" | "url";
  placeholder?: string;
  helperText?: string;
  validationState?: ValidationState;
  size?: Size;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  className?: string;

  // Icons
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;

  // Features
  clearable?: boolean;
  multiline?: boolean;
  rows?: number;

  // Extra handlers
  onFocus?: () => void;
  onBlur?: () => void;
}

const TextField: React.FC<TextFieldProps> = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  helperText,
  validationState,
  size = "medium",
  disabled = false,
  readOnly = false,
  required = false,
  className = "",
  startIcon,
  endIcon,
  clearable = false,
  multiline = false,
  rows = 3,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleClear = () => {
    onChange("");
  };

  const containerClasses = [
    "textfield-container",
    `textfield-${size}`,
    validationState && `textfield-${validationState}`,
    isFocused && "textfield-focused",
    disabled && "textfield-disabled",
    readOnly && "textfield-readonly",
    startIcon && "textfield-with-start-icon",
    endIcon && "textfield-with-end-icon",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inputProps = {
    id,
    value,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    disabled,
    readOnly,
    required,
    placeholder,
    type,
    "aria-invalid": validationState === "error",
    "aria-describedby": helperText ? `${id}-helper-text` : undefined,
  };

  return (
    <div className={containerClasses}>
      <label htmlFor={id} className="textfield-label">
        {label}
        {required && <span className="textfield-required">*</span>}
      </label>

      <div className="textfield-input-container">
        {startIcon && (
          <div className="textfield-icon textfield-start-icon">{startIcon}</div>
        )}

        {multiline ? (
          <textarea
            {...inputProps}
            rows={rows}
            className="textfield-input textfield-textarea"
          />
        ) : (
          <input {...inputProps} className="textfield-input" />
        )}

        {endIcon && (
          <div className="textfield-icon textfield-end-icon">{endIcon}</div>
        )}

        {clearable && value && !disabled && !readOnly && (
          <button
            type="button"
            className="textfield-clear-button"
            onClick={handleClear}
            aria-label="Clear input"
          >
            ✕
          </button>
        )}
      </div>

      {helperText && (
        <div
          id={`${id}-helper-text`}
          className={`textfield-helper-text ${
            validationState ? `textfield-helper-${validationState}` : ""
          }`}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

export default TextField;
