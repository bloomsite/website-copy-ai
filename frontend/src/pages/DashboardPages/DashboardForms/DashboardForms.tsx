import type React from "react";
import NavigationSidebar from "../../../components/custom/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsClient";
import FormOverview from "../../../components/custom/FormOverview/FormOverview";
import ConfirmOverview from "../../../components/custom/ConfirmOverview/ConfirmOverview";

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
