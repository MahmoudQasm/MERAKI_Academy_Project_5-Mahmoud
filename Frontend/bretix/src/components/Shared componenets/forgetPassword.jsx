import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgetPassword.css"; 

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const forgetPassword = () => {
    if (!email) {
      setMessage("Please enter your email address.");
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage("");

    axios
      .post("https://meraki-academy-project-5-bn67.onrender.com/users/request-forgot-password", {
        email,
      })
      .then((res) => {
        setMessage(res.data.message || "Reset link sent to your email!");
        setIsError(false);
      })
      .catch((err) => {
        setMessage(
          err.response?.data?.message || "Something went wrong. Please try again."
        );
        setIsError(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="forget-password-page">
      <div className="forget-card">
        <div className="icon-container">
          <span role="img" aria-label="lock">🔒</span>
        </div>
        
        <h2>Forgot Password?</h2>
        <p>Enter your email address and we'll send you a link to reset your password.</p>

        <div className="input-group-forget">
          <input
            className="forget-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button 
          className="forget-btn" 
          onClick={forgetPassword} 
          disabled={loading}
        >
          {loading ? <div className="spinner"></div> : "Send Reset Link"}
        </button>

        {message && (
          <div className={`status-message ${isError ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <div className="back-to-login">
          <span onClick={() => navigate("/login")}>
            ← Back to Login
          </span>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;