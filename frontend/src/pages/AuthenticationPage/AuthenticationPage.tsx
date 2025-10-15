import { useEffect, useState } from "react";
import "./AuthenticationPage.css";

import useLogin from "../../hooks/Authentication/useLogin";
import useAuthStatus from "../../hooks/Authentication/useAuthorization";

interface AuthStatusResponse {
  timestamp: string;
  user_info: {
    is_authenticated: boolean;
    is_anonymous: boolean;
    username: string;
    user_id?: number;
    first_name: string;
    role?: string;
    email: string;
  };
  token_info: {
    has_auth_header: boolean;
    token_valid: boolean;
    token_error?: string;
    token_user_data?: {
      id: number;
      username: string;
      email: string;
      first_name: string;
      role: string;
    };
  };
  cookies: {
    csrftoken: string;
    sessionid: string;
  };
  environment_info: {
    debug_mode: boolean;
    jwt_access_token_lifetime: string;
  };
}

const EnhancedAuthenticationCheck: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["summary"])
  );

  const { fetchAuthStatus, testAuthStatusWithPost } = useAuthStatus();
  const { login: loginNew } = useLogin();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await loginNew({ email: "melissa@klik.co", password: "wachtwoord" });
      await refreshStatus();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAuthStatus();
      setAuthStatus(response);
    } finally {
      setIsLoading(false);
    }
  };

  const testWithPost = async () => {
    setIsLoading(true);
    try {
      const response = await testAuthStatusWithPost({
        test: "data",
        timestamp: new Date().toISOString(),
      });
      setAuthStatus(response);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "null";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  const getHeaderClass = (isAuthenticated: boolean, tokenValid: boolean) => {
    if (isAuthenticated && tokenValid) return "auth-header";
    if (isAuthenticated || tokenValid) return "auth-header status-warning";
    return "auth-header status-error";
  };

  if (!authStatus) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading authentication status...</p>
        </div>
      </div>
    );
  }

  const headerClass = getHeaderClass(
    authStatus.user_info.is_authenticated,
    authStatus.token_info.token_valid
  );

  return (
    <div className="auth-dashboard">
      <div className="auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className={headerClass}>
            <h1>Authentication Status Dashboard</h1>
            <p>
              Last updated: {new Date(authStatus.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="action-section">
            <div className="button-group">
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="btn btn-success"
              >
                {isLoading ? "Loading..." : "Login (Test)"}
              </button>
              <button
                onClick={refreshStatus}
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? "Loading..." : "Refresh Status"}
              </button>
              <button
                onClick={testWithPost}
                disabled={isLoading}
                className="btn btn-purple"
              >
                {isLoading ? "Loading..." : "Test POST"}
              </button>
            </div>
          </div>

          {/* Summary Section */}
          <div className="summary-section">
            <button
              onClick={() => toggleSection("summary")}
              className="section-toggle"
            >
              <span>📊 Quick Summary</span>
              <span>{expandedSections.has("summary") ? "▼" : "▶"}</span>
            </button>

            {expandedSections.has("summary") && (
              <div className="summary-grid">
                <div
                  className={`summary-card ${
                    authStatus.user_info.is_authenticated
                      ? "status-success"
                      : "status-error"
                  }`}
                >
                  <h3>Authentication Status</h3>
                  <p
                    className={`summary-value ${
                      authStatus.user_info.is_authenticated
                        ? "success"
                        : "error"
                    }`}
                  >
                    {authStatus.user_info.is_authenticated
                      ? "✅ Authenticated"
                      : "❌ Not Authenticated"}
                  </p>
                  <p className="summary-detail">
                    User: {authStatus.user_info.username || "Anonymous"}
                  </p>
                  <p className="summary-detail">
                    Role: {authStatus.user_info.role || "None"}
                  </p>
                </div>

                <div className="summary-card status-info">
                  <h3>Token Status</h3>
                  <p
                    className={`summary-value ${
                      authStatus.token_info.token_valid ? "success" : "error"
                    }`}
                  >
                    {authStatus.token_info.token_valid
                      ? "✅ Valid Token"
                      : "❌ Invalid/No Token"}
                  </p>
                  <p className="summary-detail">
                    Header:{" "}
                    {authStatus.token_info.has_auth_header
                      ? "Present"
                      : "Missing"}
                  </p>
                  {authStatus.token_info.token_error && (
                    <p className="summary-error">
                      Error: {authStatus.token_info.token_error}
                    </p>
                  )}
                </div>

                <div className="summary-card status-warning">
                  <h3>Environment</h3>
                  <p className="summary-detail">
                    Debug:{" "}
                    {authStatus.environment_info.debug_mode ? "ON" : "OFF"}
                  </p>
                  <p className="summary-detail">
                    Token Lifetime:{" "}
                    {authStatus.environment_info.jwt_access_token_lifetime}
                  </p>
                  <p className="summary-detail">
                    CSRF Token:{" "}
                    {authStatus.cookies.csrftoken !== "Not found" ? "✅" : "❌"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Sections */}
          <div className="details-section">
            {/* User Info */}
            <div className="detail-section">
              <button
                onClick={() => toggleSection("user")}
                className="detail-toggle"
              >
                <span>👤 User Information</span>
                <span>{expandedSections.has("user") ? "▼" : "▶"}</span>
              </button>
              {expandedSections.has("user") && (
                <div className="detail-content">
                  <div className="data-grid">
                    {Object.entries(authStatus.user_info).map(
                      ([key, value]) => (
                        <div key={key} className="data-row">
                          <span className="data-label">{key}:</span>
                          <span className="data-value">
                            {formatValue(value)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Token Info */}
            <div className="detail-section">
              <button
                onClick={() => toggleSection("token")}
                className="detail-toggle"
              >
                <span>🔑 Token Information</span>
                <span>{expandedSections.has("token") ? "▼" : "▶"}</span>
              </button>
              {expandedSections.has("token") && (
                <div className="detail-content">
                  <div className="token-data">
                    {Object.entries(authStatus.token_info).map(
                      ([key, value]) => (
                        <div key={key} className="token-row">
                          <span className="token-label">{key}:</span>
                          <span className="token-value">
                            {formatValue(value)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cookies & Session */}
            <div className="detail-section">
              <button
                onClick={() => toggleSection("cookies")}
                className="detail-toggle"
              >
                <span>🍪 Cookies & Session</span>
                <span>{expandedSections.has("cookies") ? "▼" : "▶"}</span>
              </button>
              {expandedSections.has("cookies") && (
                <div className="detail-content">
                  <div className="cookies-grid">
                    <div className="cookies-section">
                      <h4>Browser Cookies</h4>
                      <p>
                        <strong>CSRF Token:</strong>{" "}
                        {window.localStorage.getItem("csrftoken") ||
                          "Not found"}
                      </p>
                      <p>
                        <strong>Session ID:</strong>{" "}
                        {window.localStorage.getItem("sessionid") ||
                          "Not found"}
                      </p>
                    </div>
                    <div className="cookies-section">
                      <h4>Server-side Cookies</h4>
                      <p>
                        <strong>CSRF Token:</strong>{" "}
                        {authStatus.cookies.csrftoken}
                      </p>
                      <p>
                        <strong>Session ID:</strong>{" "}
                        {authStatus.cookies.sessionid}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Raw Data */}
            <div className="detail-section">
              <button
                onClick={() => toggleSection("raw")}
                className="detail-toggle"
              >
                <span>🔍 Raw Response Data</span>
                <span>{expandedSections.has("raw") ? "▼" : "▶"}</span>
              </button>
              {expandedSections.has("raw") && (
                <div className="detail-content">
                  <div className="raw-data">
                    {JSON.stringify(authStatus, null, 2)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAuthenticationCheck;
