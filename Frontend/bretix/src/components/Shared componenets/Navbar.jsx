import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

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
        <button className="nav-btn">Buy by Categories</button>
        <button className="nav-btn">Contact Us</button>
        <div className="auth-group">
          <button className="nav-btn" onClick={() => navigate("/Login")}>
            Login
          </button>
          <button
            className="register-btn"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
