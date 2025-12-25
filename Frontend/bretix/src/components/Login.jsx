import React from "react";
import axios from "axios";
import { useState } from "react";
import { Card, Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const loginNow = () => {
    const userData = { email, password };

    axios
      .post("http://localhost:5000/users/login", userData)

      .then((result) => {
        localStorage.setItem("token", result.data.token);
        setToken("token", result.data.token);
        console.log(result.data.token);
        
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="login">
      <input
        type="email"
        name="email"
        id="email"
        placeholder="enter email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="enter password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button onClick={loginNow}>Login</button>
    </div>
  );
}

export default Login;
