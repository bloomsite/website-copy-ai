import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/core/Button/Button";
import TextField from "../../components/core/TextField/TextField";
import apiClient from "../../services/apiClient";
import "./SetPasswordPage.css";

export const SetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.password) {
      newErrors.push("Wachtwoord is verplicht");
    } else if (formData.password.length < 8) {
      newErrors.push("Wachtwoord moet minimaal 8 karakters bevatten");
    }

    if (!formData.confirmPassword) {
      newErrors.push("Bevestig wachtwoord is verplicht");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.push("Wachtwoorden komen niet overeen");
    }

    if (!token) {
      newErrors.push("Ongeldige token");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Use apiClient for the API call
      const response = await apiClient.post("/api/users/set-password/", {
        password: formData.password,
        confirm_password: formData.confirmPassword,
        token: token,
      });

      if (response.status === 200 || response.status === 201) {
        navigate("/login");
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        setErrors([error.response.data.error]);
      } else if (error.response?.data?.detail) {
        setErrors([error.response.data.detail]);
      } else {
        setErrors(["Er is een fout opgetreden"]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="set-password-page">
      <div className="set-password-container">
        <div className="set-password-header">
          <h1 className="set-password-title">Wachtwoord instellen</h1>
          <p className="set-password-subtitle">
            Stel een veilig wachtwoord in voor uw account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="set-password-form">
          {errors.length > 0 && (
            <div className="set-password-errors">
              {errors.map((error, index) => (
                <div key={index} className="set-password-error">
                  {error}
                </div>
              ))}
            </div>
          )}

          <TextField
            id="password"
            label="Nieuw wachtwoord"
            type="password"
            value={formData.password}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, password: value }));
              // Clear errors when user starts typing
              if (errors.length > 0) {
                setErrors([]);
              }
            }}
            placeholder="Voer uw nieuwe wachtwoord in"
            disabled={isLoading}
            required
            size="medium"
            validationState={
              errors.some((e) => e.includes("Wachtwoord")) ? "error" : undefined
            }
          />

          <TextField
            id="confirmPassword"
            label="Bevestig wachtwoord"
            type="password"
            value={formData.confirmPassword}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, confirmPassword: value }));
              // Clear errors when user starts typing
              if (errors.length > 0) {
                setErrors([]);
              }
            }}
            placeholder="Bevestig uw nieuwe wachtwoord"
            disabled={isLoading}
            required
            size="medium"
            validationState={
              errors.some(
                (e) => e.includes("Bevestig") || e.includes("overeen")
              )
                ? "error"
                : undefined
            }
          />

          <Button
            type="submit"
            text="Wachtwoord instellen"
            disabled={isLoading}
            isLoading={isLoading}
            className="set-password-submit-button"
          />
        </form>

        <div className="set-password-footer">
          <p className="set-password-help">
            Problemen? Neem contact op met de beheerder.
          </p>
        </div>
      </div>
    </div>
  );
};
