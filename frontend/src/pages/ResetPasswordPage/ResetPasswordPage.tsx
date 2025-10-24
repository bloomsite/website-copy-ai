import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/core/Button/Button";
import TextField from "../../components/core/TextField/TextField";
import apiClient from "../../services/apiClient";
import "./ResetPasswordPage.css";

export const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!email) {
      newErrors.push("E-mailadres is verplicht");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.push("Voer een geldig e-mailadres in");
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
      // Use apiClient for the API call to request password reset
      const response = await apiClient.post("/api/users/reset-password/", {
        email: email,
      });

      if (response.status === 200 || response.status === 201) {
        setIsSuccess(true);
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        setErrors([error.response.data.error]);
      } else if (error.response?.data?.detail) {
        setErrors([error.response.data.detail]);
      } else {
        setErrors([
          "Er is een fout opgetreden bij het verzenden van de reset-e-mail",
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-header">
            <h1 className="reset-password-title">E-mail verzonden!</h1>
            <p className="reset-password-subtitle">
              We hebben een e-mail met instructies voor het opnieuw instellen
              van uw wachtwoord naar {email} verzonden.
            </p>
          </div>
          <div className="reset-password-footer">
            <p className="reset-password-help">
              Controleer ook uw spam/ongewenste e-mail map als u de e-mail niet
              binnen enkele minuten ontvangt.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-header">
          <h1 className="reset-password-title">Wachtwoord vergeten?</h1>
          <p className="reset-password-subtitle">
            Voer uw e-mailadres in en we sturen u instructies om uw wachtwoord
            opnieuw in te stellen
          </p>
        </div>

        <form onSubmit={handleSubmit} className="reset-password-form">
          {errors.length > 0 && (
            <div className="reset-password-errors">
              {errors.map((error, index) => (
                <div key={index} className="reset-password-error">
                  {error}
                </div>
              ))}
            </div>
          )}

          <TextField
            id="email"
            label="E-mailadres"
            type="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              // Clear errors when user starts typing
              if (errors.length > 0) {
                setErrors([]);
              }
            }}
            placeholder="Voer uw e-mailadres in"
            disabled={isLoading}
            required
            size="medium"
            validationState={
              errors.some((e) => e.includes("E-mail") || e.includes("geldig"))
                ? "error"
                : undefined
            }
          />

          <Button
            type="submit"
            text="Reset-instructies verzenden"
            disabled={isLoading || !email}
            isLoading={isLoading}
            className="reset-password-submit-button"
          />
        </form>

        <div className="reset-password-footer">
          <p className="reset-password-help">
            Weet u uw wachtwoord weer?{" "}
            <Link to="/login">Terug naar inloggen</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
