import React from "react";
import NavigationSidebar from "../../../components/core/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsAdmin";
import UsersOverview from "../../../components/admin/UsersOverview/UsersOverview";

const AdminUsers: React.FC = () => {
  return (
    <>
      <NavigationSidebar sidebarItems={sidebarItems} sidebarTitle="Admin" />
      <UsersOverview />
    </>
  );
};

export default AdminUsers;
