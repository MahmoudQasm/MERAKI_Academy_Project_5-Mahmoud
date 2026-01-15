import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useDispatch } from "react-redux";
import { clearRole, setRole } from "../../redux/roleSlice";
import { useSelector } from "react-redux";

function Login() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("");
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
      .post("https://meraki-academy-project-5-bn67.onrender.com/users/login", { email, password })
      .then((result) => {
        axios
          .get("https://meraki-academy-project-5-bn67.onrender.com/cart/getCartWhereIsDeletedFalse", {
            headers: {
              Authorization: `Bearer ${result.data.token}`,
            },
          })
          .then((res) => {
            localStorage.setItem("cartId", res.data.items[0].id);
          })
          .catch((err) => {
            console.log(err);
          });

        dispatch(setRole(result.data.role));
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("role", result.data.role);
        localStorage.setItem("storeId", result.data.storeId);
        localStorage.setItem("storeTitle", result.data.storeTitle);
        setToken(result.data.token);
        navigate("/");
      })
      .catch(() => {
        setError("Invalid email or password");
      });
  };
  const renderAnimatedLabel = (text) => {
    return text.split("").map((letter, index) => (
      <span key={index} className="char" style={{ "--index": index }}>
        {letter === " " ? "\u00A0" : letter}
      </span>
    ));
  };
  const roleState = useSelector((state) => {
    return state.role.role;
  });

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Login to your eco-friendly account</p>

        {error && <div className="error-msg">{error}</div>}
        <div className="login-form">
          <div className="input-group">
            <input
              className="logininput"
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="loginlabel">
              {renderAnimatedLabel("Email address")}
            </label>
          </div>

          <div className="input-group">
            <input
              className="logininput"
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="loginlabel">
              {renderAnimatedLabel("Password")}
            </label>
          </div>

          <button onClick={loginNow}>Login</button>
        </div>

        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#2d6a4f", cursor: "pointer", fontWeight: "bold" }}
          >
            Register here
          </span>
          <p
            onClick={() => navigate("/forget-password")}
            style={{
              marginTop: "10px",
              cursor: "pointer",
              color: "#2d6a4f",
              fontSize: "14px",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            Forgot Password?
          </p>
          {message && <div className="success-msg">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default Login;
