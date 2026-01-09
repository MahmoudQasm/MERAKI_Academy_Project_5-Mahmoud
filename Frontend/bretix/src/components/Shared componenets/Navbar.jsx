import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaUser, FaUserPlus, FaSignOutAlt, FaIdCard } from "react-icons/fa";
import {
  Package, Store, ShieldCheck, Home,
  MessageSquare, ShoppingCart, ClipboardList,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null); // لإغلاق القائمة عند الضغط خارجها
  
  const role = localStorage.getItem("role");
  const [cartCount, setCartCount] = useState(
    parseInt(localStorage.getItem("cartCount") || "0")
  );

  // إغلاق القائمة عند الضغط في أي مكان خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setCartCount(parseInt(localStorage.getItem("cartCount") || "0"));
    };
    window.addEventListener("cartUpdated", handleStorageChange);
    return () => window.removeEventListener("cartUpdated", handleStorageChange);
  }, []);

  return (
    <nav className="navbar-container">
      <div className="nav-group left">
        <div className="nav-logo" onClick={() => navigate("/")}>
          <Home size={20} />
          <span>Bretix</span>
        </div>
      </div>

      <div className="nav-group center">
        <button className="icon-btn" onClick={() => navigate("/stores")} title="Stores"><Store size={35} /></button>
        <button className="icon-btn" onClick={() => navigate("/products")} title="Products"><Package size={35} /></button>
        <button className="icon-btn" onClick={() => navigate("/Orders")} title="Orders"><ClipboardList size={35} /></button>
        <button className="icon-btn" onClick={() => navigate("/ContactUs")} title="Contact Us"><MessageSquare size={35} /></button>
      </div>

      <div className="nav-group right">
        {/* سلة المشتريات */}
        <button className="icon-btn cart-wrapper-nav" onClick={() => navigate("/cart")}>
          <ShoppingCart size={28} />
          {cartCount > 0 && <span className="cart-badge-premium">{cartCount}</span>}
        </button>

        {role === "2" && (
          <button
            className="nav-btn"
            onClick={() => navigate("/stores/StoreManagement")}
          >
            Store Management
          </button>
        )}

        {role === "1" && (
          <button className="icon-btn admin-link" onClick={() => navigate("/AdminDashboard")} title="Admin Dashboard">
            <ShieldCheck size={35} />
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
            className="icon-btn"
            title="Profile"
            onClick={() => navigate("/profile")}
          >
            <FaUserPlus size={35} />
          </button>
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