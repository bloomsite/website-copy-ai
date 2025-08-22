import type React from "react";
import NavigationSidebar from "../../../components/custom/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsClient";
import DashboardOverview from "../../../components/dashboard/DashboardOverview/DashboardOverview";

const Dashboard: React.FC = () => {
  return (
    <>
      <NavigationSidebar sidebarItems={sidebarItems} sidebarTitle="Dashboard" />
      <DashboardOverview />
    </>
  );
};

export default Dashboard;
