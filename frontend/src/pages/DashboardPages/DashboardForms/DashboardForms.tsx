import type React from "react";
import NavigationSidebar from "../../../components/core/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsClient";
import FormOverview from "../../../components/dashboard/FormOverview/FormOverview";
import ConfirmOverview from "../../../components/dashboard/ConfirmOverview/ConfirmOverview";

const DashboardForms: React.FC = () => {
  return (
    <>
      <NavigationSidebar sidebarItems={sidebarItems} sidebarTitle="Dashboard" />
      <FormOverview />
      <ConfirmOverview />
    </>
  );
};

export default DashboardForms;
