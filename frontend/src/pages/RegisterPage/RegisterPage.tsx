import React from "react";
import Register from "../../components/custom/Register/Register";
import { useRegisterClient } from "../../hooks/Authentication/useRegisterClient";
import "./RegisterPage.css";

interface RegisterPageProps {
  isAdminRegistration?: boolean;
}

const RegisterPage: React.FC<RegisterPageProps> = ({}) => {
  const { registerClient, isLoading, error } = useRegisterClient();

  return (
    <>
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

export default RegisterPage;
