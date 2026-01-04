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
import { useNavigate, useParams } from "react-router-dom";

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
      .then((result) => {
        console.log("Update Result:", result.data);

       
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
        alert("حدث خطأ أثناء التحديث، تأكد من اتصال السيرفر");
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
      .catch((err) => {
        console.log(err);
      });
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
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon"><Leaf size={24} /></div>
          <div className="logo-text">
            <h1>BRETIX <span>ECO</span></h1>
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
            <LogOut size={18} /><span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="main-header">
          <div className="header-title">
            <h2>{activeTab}</h2>
            <p>Welcome back, here's what's happening today.</p>
          </div>
          <div className="header-profile">
            <div className="profile-info">
              <p className="admin-name">Administrator</p>
              <p className="admin-status">Verified Account</p>
            </div>
            <div className="profile-avatar">AD<div className="online-indicator"></div></div>
          </div>
        </header>

        <main className="content">
          {activeTab === "products" && (
            <div className="products-grid-container animate-fade-in">
              <div className="section-header">
                <div>
                  <h3>Eco-Products Catalog</h3>
                  <p className="subtitle">Manage your sustainable inventory</p>
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
                      <input type="text" value={imgsrc} placeholder="https://..." onChange={(e) => setImgSrc(e.target.value)} />
                    </div>
                    <div className="input-field">
                      <label>Title</label>
                      <input type="text" value={title} placeholder="Product Name" onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="input-field">
                      <label>Price</label>
                      <input type="text" value={price} placeholder="0.00" onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className="input-field">
                      <label>Description</label>
                      <input type="text" value={description} placeholder="Short description" onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="input-field">
                      <label>Rate</label>
                      <input type="number" value={rate} placeholder="1-5" onChange={(e) => setRate(e.target.value)} />
                    </div>
                    <div className="input-field">
                      <label>Category ID</label>
                      <input type="text" value={categories_id} placeholder="e.g. 1" onChange={(e) => setCategories_id(e.target.value)} />
                    </div>
                    <div className="input-field full-row">
                      <label>Store ID</label>
                      <input type="text" value={store_id} placeholder="e.g. 10" onChange={(e) => setStore_id(e.target.value)} />
                    </div>
                  </div>
                  <button className="submit-product-btn" onClick={productsAdmin}>Save Product to Bretix Eco</button>
                </div>
              )}

              <div className="products-grid">
                {products.map((product, i) => (
                  <div key={i} className="product-card">
                    <div className="product-image-wrapper">
                      <img src={product.imgsrc} alt={product.title} />
                      <div className="product-overlay">
                        <button className="view-details">Quick View</button>
                      </div>
                      {product.isEco && <span className="eco-badge"><Leaf size={12} /> Eco</span>}
                    </div>
                    <div className="product-info">
                      <h4 className="product-title">{product.title || "Sustainable Item"}</h4>
                      <div className="product-meta">
                        <span className="product-price">${product.price || "0.00"}</span>
                        <span className="product-stock">{product.stock || 0} in stock</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "users" && (
  <div className="users-section animate-fade-in">
    <div className="section-header">
      <h3>Eco-System Members</h3>
      <span className="user-count">{users.length} Active Users</span>
    </div>

  
    {showEditForm && (
      <div className="add-product-form-container" style={{ marginBottom: '30px', border: '2px solid #10b981', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h4>تعديل بيانات: {usersEdit.firstname}</h4>
          <button onClick={() => setShowEditForm(false)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>إغلاق X</button>
        </div>
        <div className="inputs-grid">
          <div className="input-field">
            <label>الاسم الأول</label>
            <input 
              type="text" 
              value={usersEdit.firstname || ""} 
              onChange={(e) => setUsersEdit({ ...usersEdit, firstname: e.target.value })} 
            />
          </div>
          <div className="input-field">
            <label>الاسم الأخير</label>
            <input 
              type="text" 
              value={usersEdit.lastname || ""} 
              onChange={(e) => setUsersEdit({ ...usersEdit, lastname: e.target.value })} 
            />
          </div>
          <div className="input-field">
            <label>الدولة</label>
            <input 
              type="text" 
              value={usersEdit.country || ""} 
              onChange={(e) => setUsersEdit({ ...usersEdit, country: e.target.value })} 
            />
          </div>
        </div>
        <button className="submit-product-btn" style={{ marginTop: '15px' }} onClick={updateUserInfo}>
          حفظ التعديلات
        </button>
      </div>
    )}

    <div className="table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={user.id || i} className="table-row">
              <td>
                <div className="user-cell">
                  <div className="user-avatar-small">
                    {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                  </div>
                  <div>
                    <p className="user-full-name">{user.firstname} {user.lastname}</p>
                    <p className="user-email">ID: #{user.id}</p>
                  </div>
                </div>
              </td>
              <td>
                <div className="location-tag">
                  <Leaf size={14} className="text-green-500" />
                  {user.country}
                </div>
              </td>
              <td><span className="status-badge">Active</span></td>
              <td>
                
                <button 
                  className="edit-btn" 
                  onClick={() => {
                    setUsersEdit(user); 
                    setShowEditForm(true); 
                    window.scrollTo({ top: 0, behavior: 'smooth' }); 
                  }}
                >
                  Edit
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
                <StatCard title="Total Sales" value="$12,450" change="+12.5%" icon={<TrendingUp size={20} />} type="emerald" />
                <StatCard title="Eco Projects" value="24" change="+2" icon={<Leaf size={20} />} type="green" />
                <StatCard title="Security Score" value="98%" change="Safe" icon={<ShieldCheck size={20} />} type="blue" />
              </div>
              <section className="activity-card">
                <div className="card-header">
                  <h3>Recent Ecosystem Activity</h3>
                  <button className="report-link">View Full Report</button>
                </div>
                <div className="card-body">
                  <div className="loading-animation"><Package size={40} /></div>
                  <p>Synchronizing with <strong>Bretix API</strong> nodes...<br />Fetching the latest eco-data.</p>
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      {showToast && (
        <div className="eco-toast-box">
          <div className="toast-icon"><CheckCircle size={24} color="#10b981" /></div>
          <div className="toast-message"><h4>Success!</h4><p>Action completed successfully.</p></div>
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