import { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
      .catch((err) =>
        setMessage(err.response?.data?.message || "Error")
      );
  };

  return (
    <div className="profile-container">
      <h2>Change Password</h2>

      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button onClick={submit}>Save</button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default ChangePassword;
