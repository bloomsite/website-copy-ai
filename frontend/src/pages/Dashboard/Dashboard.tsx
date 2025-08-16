import type React from "react";
import NavigationSidebar from "../../components/custom/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../core/Constants/sidebarItemsClient";

const Dashboard: React.FC = () => {
  return (
    <>
      <NavigationSidebar sidebarItems={sidebarItems} sidebarTitle="Dashboard" />
    </>
  );
};

export default Dashboard;
