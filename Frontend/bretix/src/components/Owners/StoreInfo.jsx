import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  LayoutDashboard, Package, Settings, LogOut, 
  Store, Leaf, ArrowLeft, Save, RefreshCcw, Image as ImageIcon
} from "lucide-react";
import "./StoreManagement.css";

const StoreInfo = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [storeInfo, setStoreInfo] = useState({});
  const [storeInfoEdition, setStoreInfoEdition] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) navigate("/Login");
    else if (parseInt(role) !== 2) navigate("/");
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const getStoreInfo = async () => {
      try {
        const result = await axios.get(`http://localhost:5000/stores/${storeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = result.data.result[0];
        setStoreInfo(data);
        setStoreInfoEdition(data);
      } catch (err) {
        console.error("Error fetching store info", err);
      }
    };
    getStoreInfo();
  }, [storeId]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    const result = await Swal.fire({
      title: "Save Changes?",
      text: "Are you sure you want to update store information?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Updating...",
        didOpen: () => Swal.showLoading(),
      });

      try {
        await axios.put(`http://localhost:5000/stores/${storeId}/update`, storeInfoEdition, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStoreInfo(storeInfoEdition);
        Swal.fire({
          title: "Updated!",
          text: "Saved successfully.",
          icon: "success",
          confirmButtonColor: "#059669",
          timer: 2000,
        });
      } catch (err) {
        Swal.fire("Error", "Failed to update information", "error");
      }
    }
  };

  const hasChanges = JSON.stringify(storeInfo) !== JSON.stringify(storeInfoEdition);

  return (
    <div className="owner-dashboard-container">
      <aside className="owner-sidebar">
        <div className="owner-logo-section">
          <div className="owner-logo-icon"><Leaf size={24} /></div>
          <div className="owner-logo-text">
            <h1>BRETIX <span>ECO</span></h1>
            <p>Merchant Portal</p>
          </div>
        </div>
        <nav className="owner-nav">
          <div className="owner-nav-item" onClick={() => navigate("/managerdashboard")}>
            <LayoutDashboard size={20} /> <span>Overview</span>
          </div>
          <div className="owner-nav-item" onClick={() => navigate(`/${storeId}/allproducts`)}>
            <Package size={20} /> <span>Inventory</span>
          </div>
          <div className="owner-nav-item active">
            <Settings size={20} /> <span>Store Info</span>
          </div>
        </nav>
        <div className="owner-sidebar-footer">
          <button className="owner-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> <span>Back</span>
          </button>
        </div>
      </aside>

      <div className="owner-main-content">
        <header className="owner-header">
          <div className="owner-header-info">
            <h2>Store Info</h2>
            <p>Manage your brand identity and store description.</p>
          </div>
        </header>

        <div className="info-form-card animate-slide-up">
          <div className="form-content-wrapper">
            <div className="logo-edit-section">
              <div className="logo-circle-preview">
                {storeInfoEdition.logo ? (
                  <img src={storeInfoEdition.logo} alt="Store Preview" />
                ) : (
                  <ImageIcon size={40} color="#cbd5e1" />
                )}
              </div>
              <h3>Store Logo</h3>
              <p>This is how customers see your brand</p>
            </div>
            <div className="inputs-column">
              <div className="eco-input-group">
                <label>Store Title</label>
                <div className="input-wrapper">
                  <Store className="input-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Enter store name"
                    value={storeInfoEdition.title || ""}
                    onChange={(e) => setStoreInfoEdition({ ...storeInfoEdition, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="eco-input-group">
                <label>Logo Image URL</label>
                <div className="input-wrapper">
                  <ImageIcon className="input-icon" size={18} />
                  <input
                    type="text"
                    placeholder="https://example.com/logo.png"
                    value={storeInfoEdition.logo || ""}
                    onChange={(e) => setStoreInfoEdition({ ...storeInfoEdition, logo: e.target.value })}
                  />
                </div>
              </div>

              <div className="eco-input-group full-width">
                <label>About the Store</label>
                <textarea
                  rows="5"
                  placeholder="Describe your eco-friendly mission..."
                  value={storeInfoEdition.description || ""}
                  onChange={(e) => setStoreInfoEdition({ ...storeInfoEdition, description: e.target.value })}
                />
              </div>

              <div className="form-button-row">
                {hasChanges && (
                  <button className="save-changes-btn" onClick={handleUpdate}>
                    <Save size={18} /> Save Changes
                  </button>
                )}
                <button className="reset-btn" onClick={() => setStoreInfoEdition(storeInfo)}>
                  <RefreshCcw size={18} /> Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreInfo;