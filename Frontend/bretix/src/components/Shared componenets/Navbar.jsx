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

        {/* كبسة الإدارة (تظهر فقط للأدوار المحددة) */}
        {role === "1" && (
          <button className="icon-btn admin-link" onClick={() => navigate("/AdminDashboard")} title="Admin Dashboard">
            <ShieldCheck size={35} />
          </button>
        )}

        {/* الدائرة المدمجة (Profile & Auth) */}
        <div className="profile-dropdown-wrapper" ref={dropdownRef}>
          <button 
            className={`profile-circle-btn ${showDropdown ? 'active' : ''}`} 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaUserPlus size={35} />
          </button>
        

          {showDropdown && (
            <div className="nav-dropdown-menu" >
              
              {role === null ? (
                <>
                  <div className="dropdown-item" onClick={() => {navigate("/Login"); setShowDropdown(false);}}>
                    <FaUser /> <span>Login</span>
                  </div>
                  
                </>
              ) : (
                <>
                  <div className="dropdown-item" onClick={() => {navigate("/profile"); setShowDropdown(false);}}>
                    <FaIdCard /> <span>My Profile</span>
                  </div>
                  {role === "2" && (
                    <div className="dropdown-item" onClick={() => {navigate("/stores/StoreManagement"); setShowDropdown(false);}}>
                      <Store size={16} /> <span>Management</span>
                    </div>
                  )}
                  <hr />
                  <div className="dropdown-item logout-red" onClick={() => {
                    localStorage.clear();
                    navigate("/");
                    setShowDropdown(false);
                    window.location.reload(); // لتحديث الحالة
                  }}>
                    <FaSignOutAlt /> <span>Logout</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;