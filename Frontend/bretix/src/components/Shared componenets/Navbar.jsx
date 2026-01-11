import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { FaUser, FaSignOutAlt, FaIdCard, FaKey } from "react-icons/fa";
import { Package, Store, ShieldCheck, Home, MessageSquare, ShoppingCart, ClipboardList, Search, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const role = localStorage.getItem("role");
  const [cartCount, setCartCount] = useState(parseInt(localStorage.getItem("cartCount") || "0"));


  const queryParams = new URLSearchParams(location.search);
  const currentSearch = queryParams.get("search") || "";

  const handleSearchChange = (e) => {
    const value = e.target.value;

    navigate(`/products?search=${encodeURIComponent(value)}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setShowDropdown(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setIsSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => setCartCount(parseInt(localStorage.getItem("cartCount") || "0"));
    window.addEventListener("cartUpdated", handleStorageChange);
    return () => window.removeEventListener("cartUpdated", handleStorageChange);
  }, []);

  return (
    <nav className="navbar-container">
      
      <div className={`nav-search-overlay ${isSearchOpen ? "active" : ""}`} ref={searchRef}>
        <div className="search-box-container">
          <Search size={20} className="search-icon-inside" />
          <input 
            type="text" 
            placeholder="Search Bretix Eco Products..." 
            value={currentSearch}
            onChange={handleSearchChange}
            autoFocus={isSearchOpen}
          />
          <button className="close-search" onClick={() => setIsSearchOpen(false)}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="nav-group left">
        <div className="nav-logo" onClick={() => navigate("/")}>
          <Home size={20} />
          <span>Bretix</span>
        </div>
      </div>

      <div className="nav-group center">
        <button className="icon-btn" onClick={() => navigate("/stores")} title="Stores"><Store size={35} /></button>
        <button className="icon-btn" onClick={() => navigate("/products")} title="Products"><Package size={35} /></button>
        {role && <button className="icon-btn" onClick={() => navigate("/Orders")} title="Orders"><ClipboardList size={35} /></button>}
        <button className="icon-btn" onClick={() => navigate("/ContactUs")} title="Contact Us"><MessageSquare size={35} /></button>
      </div>

      <div className="nav-group right">
        <button className="icon-btn search-trigger" onClick={() => setIsSearchOpen(true)} title="Search">
          <Search size={28} />
        </button>

        <button className="icon-btn cart-wrapper-nav" onClick={() => navigate("/cart")}>
          <ShoppingCart size={28} id="cart-icon-nav" />
          {cartCount > 0 && <span className="cart-badge-premium">{cartCount}</span>}
        </button>

        {role === "1" && (
          <button className="icon-btn admin-link" onClick={() => navigate("/AdminDashboard")} title="Admin Dashboard">
            <ShieldCheck size={35} />
          </button>
        )}

        <div className="profile-dropdown-wrapper" ref={dropdownRef}>
          <button className={`profile-circle-btn ${showDropdown ? "active" : ""}`} onClick={() => setShowDropdown(!showDropdown)}>
            <span>PL</span>
          </button>
          {showDropdown && (
            <div className="nav-dropdown-menu">
              {role === null ? (
                <div className="dropdown-item" onClick={() => { navigate("/Login"); setShowDropdown(false); }}><FaUser /> <span>Login</span></div>
              ) : (
                <>
                  <div className="dropdown-item" onClick={() => { navigate("/profile"); setShowDropdown(false); }}><FaIdCard /> <span>My Profile</span></div>
                  <div className="dropdown-item" onClick={() => { navigate("/change-password"); setShowDropdown(false); }}><FaKey /> <span>Change Password</span></div>
                  <hr />
                  <div className="dropdown-item logout-red" onClick={() => { localStorage.clear(); navigate("/"); setShowDropdown(false); window.location.reload(); }}>
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