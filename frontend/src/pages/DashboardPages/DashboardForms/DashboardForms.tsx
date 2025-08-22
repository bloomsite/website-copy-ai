import type React from "react";
import NavigationSidebar from "../../../components/custom/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsClient";
import FormOverview from "../../../components/custom/FormOverview/FormOverview";

const DashboardForms: React.FC = () => {
  return (
    <>
      <NavigationSidebar sidebarItems={sidebarItems} sidebarTitle="Dashboard" />
      <FormOverview />
    </>
  );
};

export default DashboardForms;
