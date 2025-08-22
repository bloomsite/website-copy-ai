import React from "react";
import "./Card.css";

interface CardProps {
  // Basic props
  children: React.ReactNode;

  // Optional props
  variant?: "default" | "outline" | "filled";
  size?: "small" | "medium" | "large";
  className?: string;
  elevation?: "none" | "low" | "medium" | "high";

  // Interactive props
  onClick?: () => void;
  hoverable?: boolean;

  // Header props
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  icon?: React.ReactNode;

  // Footer props
  footer?: React.ReactNode;

  // Visual props
  noPadding?: boolean;
  centered?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  size = "medium",
  className = "",
  elevation = "low",
  onClick,
  hoverable = false,
  title,
  subtitle,
  headerAction,
  icon,
  footer,
  noPadding = false,
  centered = false,
}) => {
  const cardClasses = [
    "card",
    `card-${variant}`,
    `card-${size}`,
    `card-elevation-${elevation}`,
    hoverable && "card-hoverable",
    centered && "card-centered",
    noPadding && "card-no-padding",
    onClick && "card-clickable",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const hasHeader = title || subtitle || headerAction;

  return (
    <div className={cardClasses} onClick={onClick}>
      {hasHeader && (
        <div className="card-header">
          <div className="card-header-content">
            <div className="card-text-content">
              {icon && <div className="card-icon">{icon}</div>}
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
          </div>
          {headerAction && (
            <div className="card-header-action">{headerAction}</div>
          )}
        </div>
      )}

      <div className="card-content">{children}</div>

      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
