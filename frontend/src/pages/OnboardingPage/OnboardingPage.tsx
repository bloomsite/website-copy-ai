import React, { useState } from "react";
import Card from "../../components/core/Card/Card";
import TextField from "../../components/core/TextField/TextField";
import Select from "../../components/core/Select/Select";
import Button from "../../components/core/Button/Button";
import Navbar from "../../components/core/Navbar/Navbar";
import { useOnboarding } from "../../hooks/ContentGeneration/useOnboarding";
import "./OnboardingPage.css";

interface CompanyInfo {
  companyType: string;
  companyGoal: string;
  targetAudience: string;
}

const OnboardingPage: React.FC = () => {
  const { submitOnboarding, companyTypes, isLoading, error } = useOnboarding();
  const [formData, setFormData] = useState<CompanyInfo>({
    companyType: "",
    companyGoal: "",
    targetAudience: "",
  });

  const handleChange = (field: keyof CompanyInfo) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitOnboarding(formData);
  };

  return (
    <>
      <Navbar />
      <div className="onboarding-page">
        <div className="onboarding-container">
          {/* Left side - Information Card */}
          <Card variant="default" elevation="medium">
            <div className="onboarding-info">
              <div className="info-content">
                <h1 className="info-heading">Personaliseer je AI Assistant</h1>
                <p className="info-description">
                  We gaan een op maat gemaakte AI speciaal voor jouw bedrijf
                  creëren. Door de informatie die je met ons deelt, kunnen we
                  ervoor zorgen dat alle gegenereerde content perfect aansluit
                  bij jouw doelgroep en bedrijfsdoelen.
                </p>
                <h2 className="info-description">Je AI zal leren:</h2>
                <ul className="info-description">
                  <li>
                    De toon en stijl die het beste bij jouw doelgroep past
                  </li>
                  <li>Specifieke branchekennis voor jouw type bedrijf</li>
                  <li>Hoe je jouw unieke bedrijfsdoelen kunt bereiken</li>
                  <li>De juiste benadering voor jouw specifieke doelgroep</li>
                </ul>
                <div className="info-highlight">
                  <p className="highlight-text">
                    🎯 Tip: Wees zo specifiek mogelijk in je antwoorden. Hoe
                    meer details je geeft, hoe beter we je AI kunnen afstemmen
                    op jouw behoeften.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Right side - Form Card */}
          <Card
            variant="default"
            elevation="medium"
            className="onboarding-form-container"
          >
            <form onSubmit={handleSubmit} className="onboarding-form">
              <h1 className="info-heading">Vertel ons over je bedrijf</h1>
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
                placeholder="Beschrijf je ideale klant zo gedetailleerd mogelijk..."
                required
                multiline
              />
              <Button
                onClick={() => {}}
                type="submit"
                isLoading={isLoading}
                text="Start met AI Personalisatie"
              />
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OnboardingPage;
