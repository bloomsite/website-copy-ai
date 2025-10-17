import "./InviteUserCard.css";
import React, { useState } from "react";
import Card from "../../core/Card/Card";
import TextField from "../../core/TextField/TextField";
import Button from "../../core/Button/Button";
import { useInviteClient } from "../../../hooks/Authentication/useInviteClient";

const InviteUserCard: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });

  const { isLoading, error, inviteClient } = useInviteClient();

  const handleChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inviteClient(formData);
  };

  return (
    <div className="invite-user-container">
      <Card
        variant="default"
        size="large"
        elevation="medium"
        centered
        title="Nodig hier een nieuwe gebruiker uit"
      >
        <form onSubmit={handleSubmit} className="invite-form">
          <TextField
            id="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange("email")}
            placeholder="Vul je email adres in"
            required
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
              helperText={error?.message}
            />
          </div>
          <Button
            onClick={() => {}}
            type="submit"
            text="Nodig uit"
            disabled={isLoading}
          />
        </form>
      </Card>
    </div>
  );
};

export default InviteUserCard;
