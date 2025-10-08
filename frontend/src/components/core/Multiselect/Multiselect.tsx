import React, { useState, useRef, useEffect } from "react";
import "./Multiselect.css";

export interface MultiselectOption {
  value: string;
  label: string;
}

interface MultiselectProps {
  // Basic props
  id: string;
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: MultiselectOption[];

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

const Multiselect: React.FC<MultiselectProps> = ({
  id,
  label,
  values,
  onChange,
  options,
  placeholder = "Selecteer opties...",
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
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleOption = (value: string) => {
    if (disabled) return;

    const newValues = values.includes(value)
      ? values.filter((v) => v !== value)
      : [...values, value];
    onChange(newValues);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const containerClasses = [
    "multiselect-container",
    `multiselect-${size}`,
    (validationState || (error ? "error" : undefined)) &&
      `multiselect-${validationState || "error"}`,
    isFocused && "multiselect-focused",
    isOpen && "multiselect-open",
    disabled && "multiselect-disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const selectedLabels = options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label)
    .join(", ");

  return (
    <div className={containerClasses} ref={containerRef}>
      <label htmlFor={id} className="multiselect-label">
        {label}
        {required && <span className="multiselect-required">*</span>}
      </label>

      <div className="multiselect-input-container">
        <div
          className="multiselect-input"
          onClick={toggleDropdown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${id}-listbox`}
          aria-labelledby={`${id}-label`}
        >
          {selectedLabels || (
            <span className="multiselect-placeholder">{placeholder}</span>
          )}
          <div className="multiselect-arrow">▼</div>
        </div>

        {isOpen && (
          <ul
            className="multiselect-options"
            id={`${id}-listbox`}
            role="listbox"
            aria-multiselectable="true"
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={`multiselect-option ${
                  values.includes(option.value) ? "selected" : ""
                }`}
                onClick={() => handleToggleOption(option.value)}
                role="option"
                aria-selected={values.includes(option.value)}
              >
                <div className="multiselect-checkbox">
                  <input
                    type="checkbox"
                    checked={values.includes(option.value)}
                    readOnly
                  />
                  <span className="checkbox-custom" />
                </div>
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {(error || helperText) && (
        <div
          id={`${id}-helper-text`}
          className={`multiselect-helper-text ${
            error
              ? "multiselect-helper-error"
              : validationState
              ? `multiselect-helper-${validationState}`
              : ""
          }`}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default Multiselect;
