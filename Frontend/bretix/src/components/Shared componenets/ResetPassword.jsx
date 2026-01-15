import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const resetPassword = () => {
    axios
      .post("https://meraki-academy-project-5-bn67.onrender.com/users/reset-password", {
        token,
        newPassword,
      })
      .then((res) => {
        setMessage(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((err) => {
        setMessage(
          err.response?.data?.message || "Something went wrong"
        );
      });
  };

  return (
    <div className="login-card">
      <h2>Reset Password</h2>

      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button onClick={resetPassword}>Reset Password</button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPassword;