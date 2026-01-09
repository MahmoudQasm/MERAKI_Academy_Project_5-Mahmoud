import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Phone, Globe, Calendar, Mail, Save, Award } from "lucide-react";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState({
    firstname: "", lastname: "", age: "",
    country: "", phonenumber: "", date_of_birthday: "", email: "",
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:5000/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const data = res.data.user;
      setUser({
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        age: data.age !== null ? data.age.toString() : "",
        country: data.country || "",
        phonenumber: data.phonenumber !== null ? data.phonenumber.toString() : "",
        date_of_birthday: data.date_of_birthday || "",
        email: data.email || "",
      });
    })
    .catch(() => setMessage("Failed to load profile ❌"));
  }, [token]);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const updateProfile = () => {
    axios.put("http://localhost:5000/users/profile", 
      { ...user, age: user.age ? parseInt(user.age) : null, phonenumber: user.phonenumber ? parseInt(user.phonenumber) : null },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => setMessage("Profile updated successfully ✅"))
    .catch(() => setMessage("Something went wrong ❌"));
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-card-modern">
        <div className="profile-header-section">
          <div className="avatar-circle">PL</div>
          <div className="header-text">
            <h2>{user.firstname} {user.lastname}</h2>
            <p>Manage your personal information and account settings</p>
          </div>
        </div>

        <div className="profile-grid">
          <div className="input-group-modern">
            <label><User size={18} /> First Name</label>
            <input name="firstname" value={user.firstname} onChange={handleChange} placeholder="Enter first name" />
          </div>

          <div className="input-group-modern">
            <label><User size={18} /> Last Name</label>
            <input name="lastname" value={user.lastname} onChange={handleChange} placeholder="Enter last name" />
          </div>

          <div className="input-group-modern">
            <label><Award size={18} /> Age</label>
            <input name="age" type="number" value={user.age} onChange={handleChange} placeholder="Your age" />
          </div>

          <div className="input-group-modern">
            <label><Globe size={18} /> Country</label>
            <input name="country" value={user.country} onChange={handleChange} placeholder="e.g. Jordan" />
          </div>

          <div className="input-group-modern">
            <label><Phone size={18} /> Phone Number</label>
            <input name="phonenumber" value={user.phonenumber} onChange={handleChange} placeholder="07XXXXXXXX" />
          </div>

          <div className="input-group-modern">
            <label><Calendar size={18} /> Date of Birth</label>
            <input name="date_of_birthday" type="date" value={user.date_of_birthday ? user.date_of_birthday.slice(0, 10) : ""} onChange={handleChange} />
          </div>

          <div className="input-group-modern full-width">
            <label><Mail size={18} /> Email Address (Read Only)</label>
            <input value={user.email} disabled className="disabled-input" />
          </div>
        </div>

        <div className="profile-footer">
          <button className="save-profile-btn" onClick={updateProfile}>
            <Save size={20} /> Save Changes
          </button>
          {message && <div className={`status-msg ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default Profile;