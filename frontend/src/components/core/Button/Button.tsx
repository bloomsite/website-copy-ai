import React from "react";
import "./Button.css";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  isLoading?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  isLoading = false,
  isActive = false,
  disabled = false,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`button ${isActive ? "active" : ""} ${
        isLoading ? "loading" : ""
      } ${className}`}
    >
      {isLoading ? (
        <div className="spinner"></div>
      ) : (
        <span className="button-text">{text}</span>
      )}
    </button>
  );
};

export default Button;
