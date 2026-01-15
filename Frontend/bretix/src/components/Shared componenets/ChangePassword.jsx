import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ChangePassword.css";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");


  const renderAnimatedLabel = (text) => {
    return text.split("").map((letter, index) => (
      <span key={index} className="char" style={{ "--index": index }}>
        {letter === " " ? "\u00A0" : letter} 
      </span>
    ));
  };

  const submit = () => {
    axios
      .put(
        "https://meraki-academy-project-5-bn67.onrender.com/users/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage(err.response?.data?.message || "Error"));
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>

      <div className="password-input-wrapper">

        <input
          className="input passwordCC" 
          type={showCurrent ? "text" : "password"}
          placeholder=" "
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <label className="password-input">
          {renderAnimatedLabel("Current Password")}
        </label>
        <span className="eye-icon" onClick={() => setShowCurrent(!showCurrent)}>
          {showCurrent ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <div className="password-input-wrapper">
        <input
          className="input passwordCC"
          type={showNew ? "text" : "password"}
          placeholder=" "
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label className="password-input">
          {renderAnimatedLabel("New Password")}
        </label>
        <span className="eye-icon" onClick={() => setShowNew(!showNew)}>
          {showNew ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <button className="save-btn" onClick={submit}>Save</button>

      {message && <p className="status-msg">{message}</p>}
    </div>
  );
}

export default ChangePassword;