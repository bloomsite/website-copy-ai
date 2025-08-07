import React, { useState } from "react";
import Card from "../../components/core/Card/Card";
import TextField from "../../components/core/TextField/TextField";
import Select from "../../components/core/Select/Select";
import Button from "../../components/core/Button/Button";
import Navbar from "../../components/core/Navbar/Navbar";
import apiClient from "../../services/apiClient";
import { useNavigate } from "react-router-dom";
import "./OnboardingPage.css";

interface CompanyInfo {
  companyType: string;
  companyGoal: string;
  targetAudience: string;
}

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const [formData, setFormData] = useState<CompanyInfo>({
    companyType: "",
    companyGoal: "",
    targetAudience: "",
  });

  const companyTypes = [
    { value: "ecommerce", label: "E-commerce" },
    { value: "service", label: "Service Provider" },
    { value: "saas", label: "Software as a Service" },
    { value: "retail", label: "Retail" },
    { value: "other", label: "Other" },
  ];

  const handleChange = (field: keyof CompanyInfo) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(undefined);

    try {
      await apiClient.post("/api/users/onboarding/", formData);
      navigate("/dashboard"); // Or wherever you want to send them after completion
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="onboarding-page">
        <Card
          variant="default"
          size="large"
          elevation="medium"
          centered
          title="Vertel ons meer over je bedrijf"
          subtitle="Help ons om je de beste content te leveren"
        >
          <form onSubmit={handleSubmit} className="onboarding-form">
            <Select
              id="companyType"
              label="Wat voor soort bedrijf heb je?"
              value={formData.companyType}
              onChange={handleChange("companyType")}
              options={companyTypes}
              required
            />
            <TextField
              id="companyGoal"
              type="text"
              label="Wat is je belangrijkste bedrijfsdoel?"
              value={formData.companyGoal}
              onChange={handleChange("companyGoal")}
              placeholder="Bijv: Meer online verkopen, merkbekendheid vergroten..."
              required
              multiline
            />
            <TextField
              id="targetAudience"
              type="text"
              label="Wie is je doelgroep?"
              value={formData.targetAudience}
              onChange={handleChange("targetAudience")}
              placeholder="Beschrijf je ideale klant..."
              required
              multiline
            />
            <Button
              onClick={() => {}}
              type="submit"
              isLoading={isLoading}
              text="Voltooien"
            />
          </form>
        </Card>
      </div>
    </>
  );
};

export default OnboardingPage;
