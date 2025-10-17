import React from "react";
import "./InviteUsers.css";
import NavigationSidebar from "../../../components/custom/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsAdmin";
import InviteUserCard from "../../../components/admin/InviteUserCard/InviteUserCard";

const InviteUser: React.FC = () => {
  return (
    <>
      <NavigationSidebar sidebarItems={sidebarItems} sidebarTitle="Admin" />
      <div className="register-page">
        <InviteUserCard />
      </div>
    </>
  );
};

export default InviteUser;
