import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Phone, Globe, Calendar, Mail, Save, Award } from "lucide-react";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    age: "",
    country: "",
    phonenumber: "",
    date_of_birthday: "",
    email: "",
  });

  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // ================== Load Profile ==================
  useEffect(() => {
    if (!token) return;

    axios
      .get("https://meraki-academy-project-5-bn67.onrender.com/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.user;
        setUser({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          age: data.age !== null ? data.age.toString() : "",
          country: data.country || "",
          phonenumber:
            data.phonenumber !== null ? data.phonenumber.toString() : "",
          date_of_birthday: data.date_of_birthday || "",
          email: data.email || "",
        });
        setNewEmail(data.email || "");
        setIsEmailVerified(true);
        setIsCodeSent(false);
      })
      .catch(() => setMessage("Failed to load profile ❌"));
  }, [token]);

  // ================== Update Inputs ==================
  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  // ================== Update Profile ==================
  const updateProfile = () => {
    axios
      .put(
        "https://meraki-academy-project-5-bn67.onrender.com/users/profile",
        {
          ...user,
          email: newEmail,
          age: user.age ? parseInt(user.age) : null,
          phonenumber: user.phonenumber ? parseInt(user.phonenumber) : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => setMessage("Profile updated successfully ✅"))
      .catch(() => setMessage("Something went wrong ❌"));
  };

  // ================== Send Verification Code ==================
  const sendVerificationCode = async () => {
    try {
      await axios.post(
        "https://meraki-academy-project-5-bn67.onrender.com/users/request-email-change",
        { newEmail: newEmail.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsCodeSent(true);
      setMessage("Verification code sent 📩");
    } catch (error) {
      console.error(error);
      setMessage("Failed to send verification code ❌");
    }
  };

  // ================== Confirm Verification Code ==================
  const confirmEmailCode = async () => {
    try {
      const trimmedCode = verificationCode.trim();
      await axios.put(
        "https://meraki-academy-project-5-bn67.onrender.com/users/verify-email-change",
        { code: trimmedCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsEmailVerified(true);
      setIsCodeSent(false);
      setUser({ ...user, email: newEmail });
      setMessage("Email verified successfully ✅");
      setVerificationCode("");
    } catch (error) {
      console.error(error);
      setMessage("Invalid verification code ❌");
    }
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-card-modern">
        <div className="profile-header-section">
          <div className="avatar-circle">{user.firstname[0]}{user.lastname[0]}</div>
          <div className="header-text">
            <h2>
              {user.firstname} {user.lastname}
            </h2>
            <p>Manage your personal information and account settings</p>
          </div>
        </div>

        <div className="profile-grid">
          <div className="input-group-modern">
            <label>
              <User size={18} /> First Name
            </label>
            <input
              name="firstname"
              value={user.firstname}
              onChange={handleChange}
            />
          </div>

          <div className="input-group-modern">
            <label>
              <User size={18} /> Last Name
            </label>
            <input
              name="lastname"
              value={user.lastname}
              onChange={handleChange}
            />
          </div>

          <div className="input-group-modern">
            <label>
              <Award size={18} /> Age
            </label>
            <input
              type="number"
              name="age"
              value={user.age}
              onChange={handleChange}
            />
          </div>

          <div className="input-group-modern">
            <label>
              <Globe size={18} /> Country
            </label>
            <input
              name="country"
              value={user.country}
              onChange={handleChange}
            />
          </div>

          <div className="input-group-modern">
            <label>
              <Phone size={18} /> Phone Number
            </label>
            <input
              name="phonenumber"
              value={user.phonenumber}
              onChange={handleChange}
            />
          </div>

          <div className="input-group-modern">
            <label>
              <Calendar size={18} /> Date of Birth
            </label>
            <input
              type="date"
              name="date_of_birthday"
              value={
                user.date_of_birthday ? user.date_of_birthday.slice(0, 10) : ""
              }
              onChange={handleChange}
            />
          </div>

          <div className="input-group-modern full-width">
            <label>
              <Mail size={18} /> Email Address
            </label>

            <div className="email-edit-wrapper">
              <input
              className="emailin"
                type="email"
                value={newEmail}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  setNewEmail(value);

                  if (value !== user.email) {
                    setIsEmailVerified(false);
                    setIsCodeSent(false);
                  }
                }}
              />

              {!isEmailVerified && !isCodeSent && (
                <button className="verify-btn" onClick={sendVerificationCode}>
                  Verify
                </button>
              )}
            </div>
          </div>

          {isCodeSent && !isEmailVerified && (
            <div className="input-group-modern full-width">
              <label>Verification Code</label>
              <input
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.trim())}
              />
              <button className="confirm-btn" onClick={confirmEmailCode}>
                Confirm
              </button>
            </div>
          )}
        </div>

        <div className="profile-footer">
          <button
            className="save-profile-btn"
            onClick={updateProfile}
            disabled={!isEmailVerified}
          >
            <Save size={20} /> Save Changes
          </button>

          {message && (
            <div
              className={`status-msg ${
                message.includes("success") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
