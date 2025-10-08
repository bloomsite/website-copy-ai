import React, { useState } from "react";
import "./Select.css";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  // Basic props
  id: string;
  label: string;
  value: string;
  onChange: (value: string, option?: SelectOption) => void;
  options: SelectOption[];

  // Optional props
  placeholder?: string;
  helperText?: string;
  validationState?: "success" | "error" | "warning";
  error?: string; // Error message to display
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  required?: boolean;
  className?: string;

  // Extra handlers
  onFocus?: () => void;
  onBlur?: () => void;
}

const Select: React.FC<SelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Selecteer een optie...",
  helperText,
  validationState,
  error,
  size = "medium",
  disabled = false,
  required = false,
  className = "",
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedOption = options.find(
      (option) => option.value === selectedValue
    );
    onChange(selectedValue, selectedOption);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const containerClasses = [
    "select-container",
    `select-${size}`,
    (validationState || (error ? "error" : undefined)) &&
      `select-${validationState || "error"}`,
    isFocused && "select-focused",
    disabled && "select-disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      <label htmlFor={id} className="select-label">
        {label}
        {required && <span className="select-required">*</span>}
      </label>

      <div className="select-input-container">
        <select
          id={id}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          className="select-input"
          aria-invalid={validationState === "error"}
          aria-describedby={helperText ? `${id}-helper-text` : undefined}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="select-arrow">▼</div>
      </div>

      {(error || helperText) && (
        <div
          id={`${id}-helper-text`}
          className={`select-helper-text ${
            error
              ? "select-helper-error"
              : validationState
              ? `select-helper-${validationState}`
              : ""
          }`}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default Select;
