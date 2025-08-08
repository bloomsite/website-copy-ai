import React from "react";
import Login from "../../components/custom/Login/Login";

import "./LoginPage.css";
import Navbar from "../../components/core/Navbar/Navbar";
import { useLogin } from "../../hooks/Authentication/useLogin";

const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useLogin();
  return (
    <>
      <Navbar />
      <div className="login-page">
        <Login isLoading={isLoading} onLogin={login} />
      </div>
    </>
  );
};

export default LoginPage;
