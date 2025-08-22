import React from "react";
import Card from "../../../components/core/Card/Card";
import "./DashboardOverview.css";

const dummyStats = {
  ingevuldeFormulieren: 12,
  beschikbareFormulieren: 20,
  clearancePercentage: 60,
  openstaandeFormulieren: 8,
  laatsteIngevuld: "21-08-2025",
  gebruikersAantal: 5,
};

const DashboardOverview: React.FC = () => {
  return (
    <div className="dashboard-overview-container">
      <h2 className="dashboard-overview-title">Dashboard Overzicht</h2>
      <div className="dashboard-overview-grid">
        <Card title="Ingevulde formulieren">
          <div className="dashboard-overview-number">
            {dummyStats.ingevuldeFormulieren}
          </div>
        </Card>
        <Card title="Beschikbare formulieren">
          <div className="dashboard-overview-number">
            {dummyStats.beschikbareFormulieren}
          </div>
        </Card>
        <Card title="Clearance percentage">
          <div className="dashboard-overview-number">
            {dummyStats.clearancePercentage}%
          </div>
        </Card>
        <Card title="Openstaande formulieren">
          <div className="dashboard-overview-number">
            {dummyStats.openstaandeFormulieren}
          </div>
        </Card>
        <Card title="Laatste ingevuld">
          <div className="dashboard-overview-number">
            {dummyStats.laatsteIngevuld}
          </div>
        </Card>
        <Card title="Aantal gebruikers">
          <div className="dashboard-overview-number">
            {dummyStats.gebruikersAantal}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
