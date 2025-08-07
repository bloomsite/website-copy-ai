import React from "react";
import { Sparkles } from "lucide-react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  links?: NavLink[];
  showLogo?: boolean;
  className?: string;
  onLogoClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  links = [],
  showLogo = true,
  className = "",
  onLogoClick,
}) => {
  const location = useLocation();

  const isLinkActive = (href: string): boolean => {
    return location.pathname === href;
  };

  return (
    <nav className={`navbar ${className}`}>
      <div className="nav-container">
        {showLogo && (
          <div
            className="logo"
            onClick={onLogoClick}
            style={{ cursor: onLogoClick ? "pointer" : "default" }}
          >
            <Sparkles className="logo-icon" />
            Webcopy AI
          </div>
        )}

        {links.length > 0 && (
          <div className="nav-links">
            {links.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className={`nav-link ${
                  isLinkActive(link.href) ? "nav-link-active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
