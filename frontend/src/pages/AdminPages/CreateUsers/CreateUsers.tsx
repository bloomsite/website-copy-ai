import React from "react";
import "./CreateUsers.css";
import NavigationSidebar from "../../../components/custom/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsAdmin";
import Register from "../../../components/admin/Register/Register";
import { useRegisterClient } from "../../../hooks/Authentication/useRegisterClient";

const CreateUsers: React.FC = () => {
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

export default CreateUsers;
