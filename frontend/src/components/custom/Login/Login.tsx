import React, { useState } from "react";
import Card from "../../core/Card/Card";
import TextField from "../../core/TextField/TextField";
import Button from "../../core/Button/Button";
import "./Login.css";

interface LoginProps {
  onLogin: (LoginData: { email: string; password: string }) => void;
  isLoading?: boolean;
  error?: string | null;
}

export const Login: React.FC<LoginProps> = ({
  onLogin,
  isLoading = false,
  error,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div className="login-container">
      <Card
        className="login-card"
        variant="default"
        size="large"
        elevation="medium"
        centered
        title="Welkom Terug!"
        subtitle="Login om door te gaan"
      >
        <form onSubmit={handleSubmit} className="login-form">
          <TextField
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="Vul je email in"
            required
            helperText={error}
          />
          <TextField
            id="password"
            type="password"
            label="Wachtwoord"
            value={password}
            onChange={setPassword}
            placeholder="Vul hier je wachtwoord in"
            required
          />
          <Button
            onClick={() => {}}
            type="submit"
            isLoading={isLoading}
            text="Log in"
            disabled={email === "" || password === "" ? true : false}
          ></Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
