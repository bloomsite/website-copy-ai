import React from "react";
import Login from "../../components/custom/Login/Login";

import "./LoginPage.css";
import { useLogin } from "../../hooks/Authentication/useLogin";

const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useLogin();
  return (
    <>
      <div className="login-page">
        <Login isLoading={isLoading} onLogin={login} error={error} />
      </div>
    </>
  );
};

export default LoginPage;
