import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaUser, FaUserPlus, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <nav className="navbar-container">
      <div className="nav-group left">
        <div className="nav-logo" onClick={() => navigate("/")}>
          Bretix
        </div>
      </div>

      <div className="nav-group center">
        <button className="nav-btn" onClick={() => navigate("/products")}>
          Products
        </button>
        <button className="nav-btn" onClick={() => navigate("/Orders")}>
          Orders
        </button>
        <button className="nav-btn" onClick={() => navigate("/stores")}>
          Stores
        </button>
        <button className="nav-btn" onClick={() => navigate("/ContactUs")}>
          Contact Us
        </button>
      </div>

      <div className="nav-group right">
        <button className="nav-btn" onClick={() => navigate("/cart")}>
          🛒
        </button>

        {role === "2" && (
          <button
            className="nav-btn"
            onClick={() => navigate("/stores/StoreManagement")}
          >
            Store Management
          </button>
        )}

        {role === null && (
          <>
            <button
              className="icon-btn"
              onClick={() => navigate("/Login")}
              title="Login"
            >
              <FaUser size={18} />
            </button>

            <button
              className="icon-btn register"
              onClick={() => navigate("/register")}
              title="Register"
            >
              <FaUserPlus size={18} />
            </button>
          </>
        )}

        {role !== null && (
          <button
            className="icon-btn logout"
            title="Logout"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            <FaSignOutAlt size={18} />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
