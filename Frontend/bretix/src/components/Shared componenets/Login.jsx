import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useDispatch } from "react-redux";
import { cleareRole, setRole } from "../../redux/roleSlice";
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
      .post("http://localhost:5000/users/login", { email, password })
      .then((result) => {
        axios
          .get("http://localhost:5000/cart/getCartWhereIsDeletedFalse", {
            headers: {
              Authorization: `Bearer ${result.data.token}`,
            },
          })
          .then((res) => {
            localStorage.setItem("CartId", res.data.items[0].id);
          
          });
        dispatch(setRole(result.data.role));
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("role", result.data.role);
        localStorage.setItem("role",result.data.role)
        localStorage.setItem("storeId", result.data.storeId)
        localStorage.setItem("storeTitle", result.data.storeTitle)
        setToken(result.data.token);
        navigate("/");
      })
      .catch(() => {
        setError("Invalid email or password");
      });
  };

  const roleState = useSelector((state) => {
    return state.role.role;
  });
const forgotPassword = () => {
  if (!email) {
    setError("Please enter your email first");
    return;
  }

  axios
    .post("http://localhost:5000/users/forgot-password", { email })
    .then((res) => {
      setError("");
      setMessage(res.data.message);
    })
    .catch((err) => {
      setError(err.response?.data?.message || "Something went wrong");
    });
};
  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Login to your eco-friendly account</p>

        {error && <div className="error-msg">{error}</div>}

        <div className="login-form">
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

        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#2d6a4f", cursor: "pointer", fontWeight: "bold" }}
          >
            Register here
          </span>
          <p
  onClick={forgotPassword}
  style={{
    marginTop: "10px",
    cursor: "pointer",
    color: "#2d6a4f",
    fontSize: "14px",
    textAlign: "right",
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
