import React, { useEffect, useState } from "react";
import axios from "axios";

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

  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // ================== GET PROFILE ==================
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/users/profile", {
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
      .catch(() => {
        setMessage("Failed to load profile ❌");
      });
  }, [token]);

  // ================== HANDLE CHANGE ==================
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ================== UPDATE PROFILE ==================
  const updateProfile = () => {
    axios
      .put(
        "http://localhost:5000/users/profile",
        {
          ...user,
          age: user.age ? parseInt(user.age) : null,
          phonenumber: user.phonenumber ? parseInt(user.phonenumber) : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setMessage("Profile updated successfully ✅");
      })
      .catch(() => {
        setMessage("Something went wrong ❌");
      });
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <input
        name="firstname"
        placeholder="First Name"
        value={user.firstname}
        onChange={handleChange}
      />

      <input
        name="lastname"
        placeholder="Last Name"
        value={user.lastname}
        onChange={handleChange}
      />

      <input
        name="age"
        type="number"
        placeholder="Age"
        value={user.age}
        onChange={handleChange}
      />

      <input
        name="country"
        placeholder="Country"
        value={user.country}
        onChange={handleChange}
      />

      <input
        name="phonenumber"
        placeholder="Phone Number"
        value={user.phonenumber}
        onChange={handleChange}
      />

      <input
        name="date_of_birthday"
        type="date"
        value={user.date_of_birthday ? user.date_of_birthday.slice(0, 10) : ""}
        onChange={handleChange}
      />

      <input value={user.email} disabled />

      <button onClick={updateProfile}>Save Changes</button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Profile;