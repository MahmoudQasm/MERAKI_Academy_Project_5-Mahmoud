import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaUser, FaUserPlus, FaSignOutAlt } from "react-icons/fa";

import {
  Package,
  Store,
  ShieldCheck,
  Home,
  MessageSquare,
  ShoppingCart,
  ClipboardList,
} from "lucide-react";
const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <nav className="navbar-container">
      <div className="nav-group left">
        <div
          className="nav-logo"
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
          }}
        >
          <Home size={20} />
          <span>Bretix</span>
        </div>
      </div>

      <div className="nav-group center">
        <button
          className="icon-btn"
          onClick={() => navigate("/products")}
          title="Products"
        >
          <Package size={35} />
        </button>

        <button
          className="icon-btn"
          onClick={() => navigate("/Orders")}
          title="Orders"
        >
          <ClipboardList size={35} />
        </button>

        <button
          className="icon-btn"
          onClick={() => navigate("/stores")}
          title="Stores"
        >
          <Store size={35} />
        </button>

        <button
          className="icon-btn"
          onClick={() => navigate("/ContactUs")}
          title="Contact Us"
        >
          <MessageSquare size={35} />
        </button>

        {role === "1" && (
          <button
            className="icon-btn admin-link"
            onClick={() => navigate("/AdminDashboard")}
            title="Admin Dashboard"
            style={{ color: "#10b981" }}
          >
            <ShieldCheck size={35} />
          </button>
        )}
      </div>

      <div className="nav-group right">
        <button
          className="icon-btn"
          onClick={() => navigate("/cart")}
          title="Cart"
        >
          <ShoppingCart size={35} />
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
              <FaUser size={35} />
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
            <FaSignOutAlt size={35} />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
