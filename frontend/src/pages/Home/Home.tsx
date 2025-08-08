import React from "react";
import { ArrowRight, Sparkles, Target, Zap, Globe } from "lucide-react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/register");
    } else {
      navigate("/start");
    }
  };

  return (
    <div className="home-page">
      {/* Navigation */}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          <Sparkles className="badge-icon" />
          AI-Gedreven Content Generatie
        </div>
        <div className="hero-items">
          <div className="hero-content">
            <h1 className="hero-title">
              Genereer Op Maat Gemaakte Website Content
              <span className="hero-subtitle">Voor Jouw Beroep</span>
            </h1>

            <p className="hero-description">
              Transformeer je professionele aanwezigheid met AI-gegenereerde
              content die direct tot je doelgroep spreekt. Vertel ons over je
              beroep en doelen, en wij creëren overtuigende teksten die
              converteren.
            </p>

            <button className="cta-button" onClick={handleNavigate}>
              Begin Nu
              <ArrowRight className="button-icon" />
            </button>
          </div>
          <div className="hero-image">
            <img src="/hero-image.png" alt="foto met Joas en Arthur" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="features-container">
          <h2 className="section-title">Waarom Webcopy AI Kiezen?</h2>
          <p className="section-description">
            Onze AI begrijpt je beroep en creëert content die resoneert met je
            doelgroep.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Target />
              </div>
              <h3>Op Maat Gemaakte Content</h3>
              <p>Content specifiek ontworpen voor jouw beroep en industrie</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Zap />
              </div>
              <h3>Bliksemsnelle Resultaten</h3>
              <p>Genereer hoogwaardige content in seconden, niet uren</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Globe />
              </div>
              <h3>Web Geoptimaliseerd</h3>
              <p>Content die klaar is voor je website, blog of portfolio</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <h2 className="section-title">Hoe Het Werkt</h2>
        <p className="section-description">
          Krijg professionele content in drie eenvoudige stappen
        </p>

        <div className="steps-grid">
          <div className="step">
            <div className="step-number">01</div>
            <h3>Deel Je Beroep</h3>
            <p>Vertel ons wat je doet en wie je bedient</p>
          </div>

          <div className="step">
            <div className="step-number">02</div>
            <h3>Definieer Je Doelen</h3>
            <p>Specificeer het type content dat je nodig hebt</p>
          </div>

          <div className="step">
            <div className="step-number">03</div>
            <h3>Ontvang Je Content</h3>
            <p>Krijg op maat gemaakte, gebruiksklare teksten</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <h2 className="section-title">Klaar om Je Content te Transformeren?</h2>
        <p className="section-description">
          Sluit je aan bij duizenden professionals die hun online aanwezigheid
          hebben verhoogd met AI-gegenereerde content.
        </p>
        <button className="cta-button" onClick={handleNavigate}>
          Start met Content Creëren
          <ArrowRight className="button-icon" />
        </button>
      </section>
    </div>
  );
};

export default Home;
