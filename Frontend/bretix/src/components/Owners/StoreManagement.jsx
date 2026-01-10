import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut, 
  Leaf, 
  ArrowRightCircle,
  TrendingUp,
  Store
} from "lucide-react";
import "./StoreManagement.css";

const OwnerStoreManagement = () => {
  const navigate = useNavigate();
  const [storeId] = useState(localStorage.getItem("storeId"));
  const [storeTitle] = useState(localStorage.getItem("storeTitle") || "My Eco Store");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/Login");
    } else if (parseInt(role) !== 2) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="owner-dashboard-container">
      <aside className="owner-sidebar">
        <div className="owner-logo-section">
          <div className="owner-logo-icon">
            <Leaf size={24} />
          </div>
          <div className="owner-logo-text">
            <h1>BRETIX <span>ECO</span></h1>
            <p>Merchant Portal</p>
          </div>
        </div>

        <nav className="owner-nav">
          <div className="owner-nav-item active">
            <Store size={20} />
            <span>Store Management</span>
          </div>
        </nav>

        <div className="owner-sidebar-footer">
          <button className="owner-back-btn" onClick={() => navigate("/")}>
            <LogOut size={18} />
            <span>Exit Dashboard</span>
          </button>
        </div>
      </aside>

      <div className="owner-main-content">
        <header className="owner-header">
          <div className="owner-header-info">
            <h2>{storeTitle}</h2>
            <p>Managing store ID: #{storeId}</p>
          </div>
          <div className="owner-profile">
            <div className="owner-avatar">
              {storeTitle.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="owner-stats-bar">
          <div className="owner-stat-mini-card">
            <Leaf size={20} className="text-green" />
            <div>
              <p>Store Status</p>
              <span>Verified Merchant</span>
            </div>
          </div>
          <div className="owner-stat-mini-card">
            <TrendingUp size={20} className="text-blue" />
            <div>
              <p>Visibility</p>
              <span>Publicly Listed</span>
            </div>
          </div>
        </div>

        <div className="owner-grid-actions">
          <div className="action-tile" onClick={() => navigate(`/${storeId}/allproducts`)}>
            <div className="tile-icon"><Package size={32} /></div>
            <h3>Manage Products</h3>
            <p>Edit, add, or delete items from your store inventory.</p>
            <ArrowRightCircle className="tile-arrow" />
          </div>

          <div className="action-tile" onClick={() => navigate("/managerdashboard")}>
            <div className="tile-icon"><LayoutDashboard size={32} /></div>
            <h3>Sales Analytics</h3>
            <p>View detailed reports of your store's performance.</p>
            <ArrowRightCircle className="tile-arrow" />
          </div>

          <div className="action-tile" onClick={() => navigate(`${storeId}`)}>
            <div className="tile-icon"><Settings size={32} /></div>
            <h3>Store Details</h3>
            <p>Update your store description and contact info.</p>
            <ArrowRightCircle className="tile-arrow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerStoreManagement;