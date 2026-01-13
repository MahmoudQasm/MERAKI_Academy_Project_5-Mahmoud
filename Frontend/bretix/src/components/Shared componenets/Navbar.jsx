import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { FaUser, FaSignOutAlt, FaIdCard, FaKey } from "react-icons/fa";
import { Package, Store, ShieldCheck, Home, MessageSquare, ShoppingCart, ClipboardList,Heart , Search, X } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
 const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    age: "",
    country: "",
    phonenumber: "",
    date_of_birthday: "",
    email: "",
  });
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
const token = localStorage.getItem("token");

  // ================== Load Profile ==================
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

  return (
    <nav className="navbar-container">
      
      <div className={`nav-search-overlay ${isSearchOpen ? "active" : ""}`} ref={searchRef}>
        <div className="search-box-container">
          <Search size={20} className="search-icon-inside" />
          <input 
            type="text" 
            placeholder="Search Bretix Products..." 
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
    
    <img 
      src="/logo1.png" 
      alt="Logic Cartel " 
      className="navbar-custom-img" 
    />
  </div>
</div>

      <div className="nav-group center">
        <button className="icon-btn" onClick={() => navigate("/stores")} title="Stores"><Store size={35} /></button>
        <button className="icon-btn" onClick={() => navigate("/products")} title="Products"><Package size={35} /></button>
        {role && <button className="icon-btn" onClick={() => navigate("/Orders")} title="Orders"><ClipboardList size={35} /></button>}
        {role && <button className="icon-btn" onClick={() => navigate("/favourites")} title="Favourites"><Heart  size={35} /></button>}
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
  <button
    className={`profile-circle-btn ${role === null ? "login-btn" : ""} ${showDropdown ? "active" : ""}`}
    onClick={() => {
      if (role === null) {
        navigate("/Login");
      } else {
        setShowDropdown(!showDropdown);
      }
    }}
  >
    {role === null ? (
      <span>Login</span>
    ) : (
      <span>{user.firstname[0]}{user.lastname[0]}</span>
    )}
  </button>

  {showDropdown && role !== null && (
    <div className="nav-dropdown-menu">
      <>
        <div
          className="dropdown-item"
          onClick={() => {
            navigate("/profile");
            setShowDropdown(false);
          }}
        >
          <FaIdCard /> <span>My Profile</span>
        </div>
    {role === "2" && (
                    <div className="dropdown-item" onClick={() => {navigate("/stores/StoreManagement"); setShowDropdown(false);}}>
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        navigate("/stores/StoreManagement");
                        setShowDropdown(false);
                      }}
                    >
                      <Store size={16} /> <span>Management</span>
                    </div>
                    </div>
                  )}

        <div
          className="dropdown-item"
          onClick={() => {
            navigate("/change-password");
            setShowDropdown(false);
          }}
        >
          <FaKey /> <span>Change Password</span>
        </div>

        <hr />

        <div
          className="dropdown-item logout-red"
          onClick={() => {
            localStorage.clear();
            navigate("/");
            setShowDropdown(false);
            window.location.reload();
          }}
        >
          <FaSignOutAlt /> <span>Logout</span>
        </div>
      </>
    </div>
  )}
</div>

      </div>
    </nav>
  );
};

export default Navbar;