import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const loginNow = () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");

    axios
      .post("http://localhost:5000/users/login", { email, password })
      .then((result) => {
        localStorage.setItem("token", result.data.token);
        setToken(result.data.token);
        navigate("/");
      })
      .catch(() => {
        setError("Invalid email or password");
      });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Login to your eco-friendly account</p>

        {error && <div className="error-msg">{error}</div>}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={loginNow}>Login</button>
      </div>
    </div>
  );
}

export default Login;
