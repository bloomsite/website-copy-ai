import React from "react";
import NavigationSidebar from "../../../components/core/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsAdmin";

const Admin: React.FC = () => {
  return (
    <>
      <NavigationSidebar
        sidebarItems={sidebarItems}
        sidebarTitle="Admin Panel"
      />
    </>
  );
};

export default Admin;
