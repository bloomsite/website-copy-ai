import React from "react";
import { useNavigate } from "react-router-dom";
import "./PageNotFoundPage.css";

const PageNotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-not-found-container">
      <div className="content-wrapper">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Pagina niet gevonden</h2>
        <p className="error-message">
          Oeps, het lijkt alsof je op een bagina bent beland die niet bestaat.
          Klik op de knop hieronder om terug naar het thuisscherm te gaan!
        </p>
        <button className="home-button" onClick={() => navigate("/")}>
          Thuis pagina
        </button>
      </div>
    </div>
  );
};

export default PageNotFoundPage;
