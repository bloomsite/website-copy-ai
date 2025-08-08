import React, { useState } from "react";
import Card from "../../core/Card/Card";
import TextField from "../../core/TextField/TextField";
import Button from "../../core/Button/Button";
import "./Login.css";

interface LoginProps {
  onLogin: (LoginData: { email: string; password: string }) => void;
  isLoading?: boolean;
  error?: string;
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
        variant="default"
        size="large"
        elevation="medium"
        centered
        title="Welcome Back"
        subtitle="Please sign in to continue"
      >
        <form onSubmit={handleSubmit} className="login-form">
          <TextField
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
            required
            helperText={error}
          />
          <TextField
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            required
          />
          <Button
            onClick={() => {}}
            type="submit"
            isLoading={isLoading}
            text="Sign In"
          ></Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
