import React, { useState } from "react";
import { Home, User, Package, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Start.css";

const Start: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  const navigate = useNavigate();

  const pageTypes = [
    {
      id: "home",
      title: "Home Page",
      icon: Home,
      description: "Main landing page content",
    },
    {
      id: "about",
      title: "About Page",
      icon: User,
      description: "Your story and background",
    },
    {
      id: "product",
      title: "Product Page",
      icon: Package,
      description: "Product or service descriptions",
    },
    {
      id: "offer",
      title: "Special Offer Page",
      icon: Star,
      description: "Promotional content and deals",
    },
  ];

  const handlePageSelect = (pageId: string) => {
    setSelectedPage(pageId);
    console.log(`Selected page type: ${pageId}`);
  };

  const handleSelect = (page: string) => {
    navigate(`/content/${page}`);
  };

  return (
    <div className="start-page">
      <section className="start-intro">
        <div className="intro-content">
          <h1>Kies Je Content Type</h1>
          <p className="intro-description">
            Selecteer het type pagina waarvoor je op maat gemaakte content wilt
            genereren. Onze AI zal de perfecte teksten creëren die aansluiten
            bij jouw beroep en doelgroep.
          </p>

          <div className="intro-benefits">
            <h3>Waarom is dit belangrijk?</h3>
            <ul className="benefits-list">
              <li>
                <strong>Gerichte boodschap:</strong> Elke pagina heeft een uniek
                doel en vereist specifieke toon en inhoud
              </li>
              <li>
                <strong>Optimale conversie:</strong> Content afgestemd op het
                doel van de pagina zorgt voor betere resultaten
              </li>
              <li>
                <strong>Professionele structuur:</strong> Krijg content die
                volgt op bewezen formules voor elk paginatype
              </li>
              <li>
                <strong>Tijdsbesparing:</strong> Ontvang direct gebruiksklare
                teksten zonder eindeloos schrijven en herschrijven
              </li>
            </ul>
          </div>

          <div className="intro-expectations">
            <h3>Wat kun je verwachten?</h3>
            <ul className="expectations-list">
              <li>Volledig uitgewerkte teksten klaar voor je website</li>
              <li>Koppen, paragrafen en call-to-actions op maat</li>
              <li>Content die aansluit bij jouw beroep en doelgroep</li>
              <li>Professionele toon die vertrouwen wekt</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="start-selection">
        <h2>Selecteer de pagina waarvoor je content wilt maken</h2>
        <div className="page-grid">
          {pageTypes.map((page) => {
            const IconComponent = page.icon;
            return (
              <div
                key={page.id}
                className={`page-card ${
                  selectedPage === page.id ? "active" : ""
                }`}
                onClick={() => {
                  handlePageSelect(page.id), handleSelect(page.id);
                }}
              >
                <div className="card-icon">
                  <IconComponent size={32} />
                </div>
                <h3>{page.title}</h3>
                <p>{page.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Start;
