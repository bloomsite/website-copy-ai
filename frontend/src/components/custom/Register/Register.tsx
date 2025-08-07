import React, { useState } from "react";
import Card from "../../core/Card/Card";
import TextField from "../../core/TextField/TextField";
import Button from "../../core/Button/Button";
import "./Register.css";

interface RegisterProps {
  onRegister: (userData: {
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
    password: string;
  }) => void;
  isLoading?: boolean;
  error?: string;
}

export const Register: React.FC<RegisterProps> = ({
  onRegister,
  isLoading = false,
  error,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    companyName: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear password-related errors when either password field changes
    if (field === "password" || field === "confirmPassword") {
      setFormErrors({
        password: "",
        confirmPassword: "",
      });
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const { confirmPassword, ...userData } = formData;
      onRegister(userData);
    }
  };

  return (
    <div className="register-container">
      <Card
        variant="default"
        size="large"
        elevation="medium"
        centered
        title="Creëer nu jouw account"
        subtitle="Start met het genereren van jouw content"
      >
        <form onSubmit={handleSubmit} className="register-form">
          <TextField
            id="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange("email")}
            placeholder="Vul je email adres in"
            required
            helperText={error}
          />
          <div className="name-fields">
            <TextField
              id="firstName"
              type="text"
              label="Voornaam"
              value={formData.firstName}
              onChange={handleChange("firstName")}
              placeholder="Vul je voornaam in"
              required
            />
            <TextField
              id="lastName"
              type="text"
              label="Achternaam"
              value={formData.lastName}
              onChange={handleChange("lastName")}
              placeholder="Vul je achternaam in"
              required
            />
          </div>
          <TextField
            id="companyName"
            type="text"
            label="Bedrijfsnaam"
            value={formData.companyName}
            onChange={handleChange("companyName")}
            placeholder="Vul je bedrijfsnaam in"
            required
          />
          <TextField
            id="password"
            type="password"
            label="Wachtwoord"
            value={formData.password}
            onChange={handleChange("password")}
            placeholder="Vul je wachtwoord in"
            required
            helperText={formErrors.password}
          />
          <TextField
            id="confirmPassword"
            type="password"
            label="Bevestig je wachtwoord"
            value={formData.confirmPassword}
            onChange={handleChange("confirmPassword")}
            placeholder="Bevestig je wachtwoord"
            required
            helperText={formErrors.confirmPassword}
          />
          <Button
            onClick={() => {}}
            type="submit"
            isLoading={isLoading}
            text="creëer je account"
          />
        </form>
      </Card>
    </div>
  );
};

export default Register;
