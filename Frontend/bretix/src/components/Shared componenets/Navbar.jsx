import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || null
  // const role = useSelector((state)=> state.role.role
  // )
//  console.log(role);
 
  return (
    <nav className="navbar-container">
      <div className="nav-group left">
        <button className="nav-btn" onClick={() => navigate("/")}>
          Home
        </button>
        <button className="nav-btn" onClick={() => navigate("/products")}>
          Products
        </button>
        <button className="nav-btn">Stores</button>
      </div>

      <div className="nav-logo" onClick={() => navigate("/")}>
        Bretix
      </div>

      <div className="nav-group right">
        <button className="nav-btn">Contact Us</button>
        <div className="auth-group">
          {role === null && <button className="nav-btn" onClick={() => navigate("/Login")}>
            Login
          </button>}
          {role === null && <button
            className="register-btn"
            onClick={() => navigate("/register")}
          >
            Register
          </button>}
          {role !== null && <button
            className="logout-btn"
            onClick={() => navigate("/")}
          >
            Logout
          </button>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
