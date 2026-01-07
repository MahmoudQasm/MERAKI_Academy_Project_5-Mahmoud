import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Settings,
  LogOut,
  TrendingUp,
  Leaf,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import "./AdminDashboard.css";
import "./AddnewProducts.css";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const [imgsrc, setImgSrc] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [rate, setRate] = useState("");
  const [categories_id, setCategories_id] = useState("");
  const [store_id, setStore_id] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [usersEdit, setUsersEdit] = useState({});
  const [showEditForm, setShowEditForm] = useState(false);

  const menuItems = [
    { id: "overview", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "products", name: "Bretix Products", icon: <Package size={20} /> },
    { id: "users", name: "Users", icon: <Users size={20} /> },
    { id: "settings", name: "Settings", icon: <Settings size={20} /> },
  ];

  const updateUserInfo = () => {
    if (!usersEdit.id) {
      console.error("User ID is missing!");
      return;
    }

    axios
      .put(`http://localhost:5000/users/update/${usersEdit.id}`, usersEdit)
      .then(() => {
        const updatedUsers = users.map((u) =>
          u.id === usersEdit.id ? { ...u, ...usersEdit } : u
        );
        setUsers(updatedUsers);
        setShowEditForm(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      });
  };

  const productsAdmin = () => {
    const adminAddProduct = {
      imgsrc,
      title,
      description,
      price,
      rate,
      categories_id,
      store_id,
    };

    axios
      .post(`http://localhost:5000/products/`, adminAddProduct)
      .then((result) => {
        if (result.data.result) {
          setProducts([...products, result.data.result]);
        }
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setShowAddForm(false);

        setImgSrc("");
        setTitle("");
        setDescription("");
        setPrice("");
        setRate("");
        setCategories_id("");
        setStore_id("");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/users/`).then((result) => {
      setUsers(result.data.result || []);
    });
    axios.get(`http://localhost:5000/products/all`).then((result) => {
      setProducts(result.data.products || []);
    });
  }, []);

  return (
    <div className="dashboard-container">
      {showEditForm && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content animate-slide-up">
            <div className="modal-header">
              <div className="modal-title-box">
                <Settings className="text-emerald-500" size={24} />
                <h3>Edit Member Details</h3>
              </div>
              <button
                className="close-modal-btn"
                onClick={() => setShowEditForm(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-subtitle">
                Update information for{" "}
                <strong>
                  {usersEdit.firstname} {usersEdit.lastname}
                </strong>
              </p>
              <div className="inputs-grid-modal">
                <div className="input-field-premium">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={usersEdit.firstname || ""}
                    onChange={(e) =>
                      setUsersEdit({ ...usersEdit, firstname: e.target.value })
                    }
                  />
                </div>
                <div className="input-field-premium">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={usersEdit.lastname || ""}
                    onChange={(e) =>
                      setUsersEdit({ ...usersEdit, lastname: e.target.value })
                    }
                  />
                </div>
                <div className="input-field-premium full-width">
                  <label>Country / Location</label>
                  <input
                    type="text"
                    value={usersEdit.country || ""}
                    onChange={(e) =>
                      setUsersEdit({ ...usersEdit, country: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowEditForm(false)}
              >
                Cancel
              </button>
              <button className="save-btn" onClick={updateUserInfo}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Leaf size={24} />
          </div>
          <div className="logo-text">
            <h1>
              BRETIX <span>ECO</span>
            </h1>
            <p>Sustainability Suite</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-name">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => navigate("/")}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="main-header">
          <div className="header-title">
            <h2>{activeTab.toUpperCase()}</h2>
            <p>Welcome back, here's what's happening today.</p>
          </div>
          <div className="header-profile">
            <div className="profile-info">
              <p className="admin-name">Administrator</p>
              <p className="admin-status">Verified Account</p>
            </div>
            <div className="profile-avatar">
              AD<div className="online-indicator"></div>
            </div>
          </div>
        </header>

        <main className="content">
          {activeTab === "products" && (
            <div className="products-grid-container animate-fade-in">
              <div className="section-header">
                <div>
                  <h3>Eco-Products Catalog</h3>
                  <p className="subtitle">
                    Manage your sustainable inventory
                  </p>
                </div>
                <button
                  className={`add-product-btn ${showAddForm ? "close" : ""}`}
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  {showAddForm ? "Close Form" : "+ Add New Product"}
                </button>
              </div>

              {showAddForm && (
                <div className="add-product-form-container">
                  <div className="inputs-grid">
                    <div className="input-field">
                      <label>Image URL</label>
                      <input
                        type="text"
                        value={imgsrc}
                        onChange={(e) => setImgSrc(e.target.value)}
                      />
                    </div>
                    <div className="input-field">
                      <label>Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="input-field">
                      <label>Price</label>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    <div className="input-field">
                      <label>Description</label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) =>
                          setDescription(e.target.value)
                        }
                      />
                    </div>
                    <div className="input-field">
                      <label>Rate</label>
                      <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                      />
                    </div>
                    <div className="input-field">
                      <label>Category ID</label>
                      <input
                        type="text"
                        value={categories_id}
                        onChange={(e) =>
                          setCategories_id(e.target.value)
                        }
                      />
                    </div>
                    <div className="input-field full-row">
                      <label>Store ID</label>
                      <input
                        type="text"
                        value={store_id}
                        onChange={(e) =>
                          setStore_id(e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <button
                    className="submit-product-btn"
                    onClick={productsAdmin}
                  >
                    Save Product to Bretix Eco
                  </button>
                </div>
              )}

              <div className="products-grid">
                {products.map((product, i) => (
                  <div key={i} className="product-card">
                    <div className="product-image-wrapper">
                      <img src={product.imgsrc} alt={product.title} />
                      <div className="product-overlay">
                        <button className="view-details">
                          Quick View
                        </button>
                      </div>
                    </div>
                    <div className="product-info">
                      <h4 className="product-title">
                        {product.title || "Item"}
                      </h4>
                      <div className="product-meta">
                        <span className="product-price">
                          ${product.price}
                        </span>
                        <span className="product-stock">
                          In Stock
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="users-section animate-fade-in">
              <div className="section-header-modern">
                <div>
                  <h3>Eco-System Members</h3>
                  <p>{users.length} verified sustainable users</p>
                </div>
              </div>

              <div className="modern-table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Member Info</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>
                        Management
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, i) => (
                      <tr key={user.id || i}>
                        <td>
                          <div className="user-profile-cell">
                            <div className="avatar-circle">
                              {user.firstname?.charAt(0)}
                              {user.lastname?.charAt(0)}
                            </div>
                            <div className="user-text">
                              <span className="name">
                                {user.firstname} {user.lastname}
                              </span>
                              <span className="id">
                                ID: #{user.id}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="location-chip">
                            <Leaf size={12} />{" "}
                            {user.country || "Global"}
                          </div>
                        </td>
                        <td>
                          <span className="status-pill active">
                            Verified
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            className="action-edit-btn"
                            onClick={() => {
                              setUsersEdit(user);
                              setShowEditForm(true);
                            }}
                          >
                            Edit Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "overview" && (
            <>
              <div className="stats-grid">
                <StatCard
                  title="Total Sales"
                  value="$12,450"
                  change="+12.5%"
                  icon={<TrendingUp size={20} />}
                  type="emerald"
                />
                <StatCard
                  title="Eco Projects"
                  value="24"
                  change="+2"
                  icon={<Leaf size={20} />}
                  type="green"
                />
                <StatCard
                  title="Security Score"
                  value="98%"
                  change="Safe"
                  icon={<ShieldCheck size={20} />}
                  type="blue"
                />
              </div>
              <section className="activity-card">
                <div className="card-header">
                  <h3>Recent Ecosystem Activity</h3>
                </div>
                <div className="card-body">
                  <div className="loading-animation">
                    <Package size={40} />
                  </div>
                  <p>
                    Synchronizing with{" "}
                    <strong>Bretix API</strong> nodes...
                  </p>
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      {showToast && (
        <div className="eco-toast-box">
          <div className="toast-icon">
            <CheckCircle size={24} color="#10b981" />
          </div>
          <div className="toast-message">
            <h4>Success!</h4>
            <p>Action completed successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, change, icon, type }) => (
  <div className={`stat-card ${type}`}>
    <div className="stat-header">
      <div className="stat-icon-wrapper">{icon}</div>
      <span className="stat-change">{change}</span>
    </div>
    <div className="stat-info">
      <p className="stat-label">{title}</p>
      <p className="stat-value">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
