import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const submit = () => {
    axios
      .put(
        "http://localhost:5000/users/change-password",
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
          type={showCurrent ? "text" : "password"}
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <span onClick={() => setShowCurrent(!showCurrent)}>
          {showCurrent ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <div className="password-input-wrapper">
        <input
          type={showNew ? "text" : "password"}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <span onClick={() => setShowNew(!showNew)}>
          {showNew ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <button onClick={submit}>Save</button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default ChangePassword;
