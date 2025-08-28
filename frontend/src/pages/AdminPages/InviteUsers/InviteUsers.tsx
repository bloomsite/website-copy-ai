import React from "react";
import "./InviteUsers.css";
import Register from "../../../components/custom/Register/Register";
import { useRegisterClient } from "../../../hooks/Authentication/useRegisterClient";
import NavigationSidebar from "../../../components/custom/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsAdmin";

const InviteUser: React.FC = () => {
  const { registerClient, isLoading, error } = useRegisterClient();

  return (
    <>
      <NavigationSidebar sidebarItems={sidebarItems} sidebarTitle="Admin" />
      <div className="register-page">
        <Register
          onRegister={registerClient}
          isLoading={isLoading}
          error={error}
          adminRegistration={true}
        />
      </div>
    </>
  );
};

export default InviteUser;
