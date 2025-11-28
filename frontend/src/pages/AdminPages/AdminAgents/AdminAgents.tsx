import React from "react";
import NavigationSidebar from "../../../components/core/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsAdmin";
import AgentsOverview from "../../../components/admin/AgentsOverview/AgentsOverview";

const AdminAgents: React.FC = () => {
  return (
    <>
      <NavigationSidebar sidebarTitle="Admin" sidebarItems={sidebarItems} />
      <AgentsOverview />
    </>
  );
};

export default AdminAgents;
