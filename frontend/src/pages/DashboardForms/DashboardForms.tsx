import type React from "react";
import NavigationSidebar from "../../components/custom/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../core/Constants/sidebarItemsClient";

const DashboardForms: React.FC = () => {
  return (
    <>
      <NavigationSidebar sidebarItems={sidebarItems} sidebarTitle="Dashboard" />
    </>
  );
};

export default DashboardForms;
