import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { 
  Package, Leaf, Plus, Star, ArrowLeft 
} from "lucide-react";
import "./StoreManagement.css";

const AllProducts = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [storeInfo, setStoreInfo] = useState({});
  const [storeProducts, setStoreProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) navigate("/Login");
    else if (parseInt(role) !== 2) navigate("/");
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`https://meraki-academy-project-5-bn67.onrender.com/stores/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setStoreInfo(res.data.result[0]))
    .catch((err) => console.log(err));

    axios.get(`https://meraki-academy-project-5-bn67.onrender.com/stores/${id}/productsinstore`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setStoreProducts(res.data.result))
    .catch((err) => console.log(err));
  }, [id]);

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
          <div className="owner-nav-item active">
            <Package size={20} /> <span>Product Inventory</span>
          </div>
        </nav>
        
        <div className="owner-sidebar-footer">
          <button className="owner-back-btn" onClick={() => navigate("/ownerstoremanagement")}>
            <ArrowLeft size={18} /> <span>Back to Dashboard</span>
          </button>
        </div>
      </aside>

      <div className="owner-main-content">
        <header className="owner-header">
          <div className="owner-header-info">
            <h2>{storeInfo.title || "Store Inventory"}</h2>
            <p>Manage and monitor your sustainable products.</p>
          </div>
          <button 
            className="eco-add-btn"
            onClick={() => navigate(`/stores/${id}/addnewproduct`)}
          >
            <Plus size={20} /> Add New Product
          </button>
        </header>

        <div className="products-inventory-grid">
          {storeProducts.length > 0 ? (
            storeProducts.map((product) => (
              <div className="inventory-card" key={product.id}>
                <div className="inventory-img-wrapper">
                  <img src={product.imgsrc} alt={product.title} />
                  <div className="inventory-badge">In Stock</div>
                </div>
                <div className="inventory-details">
                  <h3 onClick={() => navigate(`/allproducts/${product.id}`)}>
                    {product.title}
                  </h3>
                  <div className="inventory-meta">
                    <span className="inv-price">${product.price || "0.00"}</span>
                    <span className="inv-rate">
                      <Star size={14} fill="#facc15" color="#facc15" /> 
                      {product.rate}
                    </span>
                  </div>
                  <button 
                    className="inv-edit-btn"
                    onClick={() => navigate(`/allproducts/${product.id}`)}
                  >
                    Manage Item
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data-placeholder">
               <Package size={60} />
               <p>No products found in this store yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;