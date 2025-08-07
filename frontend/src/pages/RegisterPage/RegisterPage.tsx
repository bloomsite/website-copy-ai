import React from "react";
import Register from "../../components/custom/Register/Register";
import { useRegisterClient } from "../../hooks/Authentication/useRegisterClient";
import "./RegisterPage.css";
import Navbar from "../../components/core/Navbar/Navbar";

const RegisterPage: React.FC = () => {
  const { registerClient, isLoading, error } = useRegisterClient();

  return (
    <>
      <Navbar />
      <div className="register-page">
        <Register
          onRegister={registerClient}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </>
  );
};

export default RegisterPage;
