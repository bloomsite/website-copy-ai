import type React from "react";
import NavigationSidebar from "../../../components/core/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsAdmin";
import SubmissionsOverview from "../../../components/admin/SubmissionsOverview/SubmissionsOverview";

const AdminSubmissions: React.FC = () => {
  return (
    <>
      <NavigationSidebar sidebarTitle="Admin" sidebarItems={sidebarItems} />
      <SubmissionsOverview />
    </>
  );
};

export default AdminSubmissions;
