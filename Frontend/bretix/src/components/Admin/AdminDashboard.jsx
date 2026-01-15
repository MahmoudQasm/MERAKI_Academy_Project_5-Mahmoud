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
  Calendar,
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
  const [totalSales, setTotalSales] = useState(0);
  const [storesCount, setStoresCount] = useState(0);
  const [completedSalesCarts, setCSC] = useState(0);

  const [imgsrc, setImgSrc] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [rate, setRate] = useState("");
  const [categories_id, setCategories_id] = useState("");
  const [store_id, setStore_id] = useState("");
  const [page, setPage] = useState(1);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);

  const [usersEdit, setUsersEdit] = useState({});
  const [showEditForm, setShowEditForm] = useState(false);

  const [completedOrders, setCompletedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const menuItems = [
    { id: "overview", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "products", name: "Bretix Products", icon: <Package size={20} /> },
    { id: "users", name: "Users", icon: <Users size={20} /> },
  ];

  const updateUserInfo = () => {
    if (!usersEdit.id) {
      console.error("User ID is missing!");
      return;
    }
    console.log(usersEdit);

    axios
      .put(
        `https://meraki-academy-project-5-bn67.onrender.com/users/update/admin/${usersEdit.id}`,
        usersEdit
      )
      .then((result) => {
        console.log(result);

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
      .post(`https://meraki-academy-project-5-bn67.onrender.com/products/`, adminAddProduct)
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

  const addCategory = () => {
    if (!newCategoryName.trim()) {
      alert("Please enter category name");
      return;
    }

    const token = localStorage.getItem("token");

    axios
      .post(
        `https://meraki-academy-project-5-bn67.onrender.com/categories/add`,
        { name: newCategoryName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        setCategories([...categories, result.data.category]);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setShowAddCategoryForm(false);
        setNewCategoryName("");
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.message || "Error adding category");
      });
  };

  const fetchCompletedOrders = async () => {
    setIsLoadingOrders(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "https://meraki-academy-project-5-bn67.onrender.com/cart/allcompleted",
        {
          params: {
            pageNumber: currentPage,
            limit: 10,
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompletedOrders(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalOrders(response.data.pagination.totalOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    axios.get(`https://meraki-academy-project-5-bn67.onrender.com/users/`).then((result) => {
      setUsers(result.data.result || []);
    });

    axios.get(`https://meraki-academy-project-5-bn67.onrender.com/products/all`).then((result) => {
      setProducts(result.data.products || []);
    });

    axios
      .get(`https://meraki-academy-project-5-bn67.onrender.com/stores/all`)
      .then((result) => {
        setStores(result.data.result || []);
      })
      .catch((err) => console.log(err));

    axios
      .get(`https://meraki-academy-project-5-bn67.onrender.com/categories/all`)
      .then((result) => {
        setCategories(result.data.categories || []);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios.get(`https://meraki-academy-project-5-bn67.onrender.com/users/`).then((result) => {
      setUsers(result.data.result || []);
    });
    axios.get(`https://meraki-academy-project-5-bn67.onrender.com/products/all`).then((result) => {
      setProducts(result.data.products || []);
    });
  }, []);

  useEffect(() => {
    const getTotal = async () => {
      const token = localStorage.getItem("token");
      try {
        const result = await axios.get(
          `https://meraki-academy-project-5-bn67.onrender.com/cart/totalsales`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotalSales(result.data.total);
        setCSC(result.data.numOfCarts);
      } catch (err) {
        console.log(err);
      }
    };
    getTotal();
  }, []);

  useEffect(() => {
    const numOfStores = async () => {
      try {
        const result = await axios.get(`https://meraki-academy-project-5-bn67.onrender.com/stores/all`);
        setStoresCount(result.data.result.length);
      } catch (err) {
        console.log(err);
      }
    };
    numOfStores();
  }, []);

  useEffect(() => {
    if (activeTab === "overview") {
      fetchCompletedOrders();
    }
  }, [currentPage, startDate, endDate, activeTab]);

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
            <span>Home</span>
          </button>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="main-header">
          <div className="header-title">
            <h2>{activeTab.toUpperCase()}</h2>
            <p>Welcome back, here's what's happening today.</p>
          </div>
          <div className="header-profile"></div>
        </header>

        <main className="content">
          {activeTab === "products" && (
            <div className="products-grid-container animate-fade-in">
              <div className="section-header">
                <div>
                  <h3>Bretix-Products Catalog</h3>
                  <p className="subtitle">Manage your sustainable inventory</p>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    className={`add-product-btn ${showAddForm ? "close" : ""}`}
                    onClick={() => setShowAddForm(!showAddForm)}
                  >
                    {showAddForm ? "Close Form" : "+ Add New Product"}
                  </button>
                  <button
                    className="add-product-btn"
                    onClick={() => setShowAddCategoryForm(true)}
                    style={{ background: "#4af094ff" }}
                  >
                    + Add Category
                  </button>
                </div>
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
                        onChange={(e) => setDescription(e.target.value)}
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
                      <label>Category</label>
                      <select
                        value={categories_id}
                        onChange={(e) => setCategories_id(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "15px",
                          background: "white",
                          cursor: "pointer",
                        }}
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="input-field full-row">
                      <label>Store</label>
                      <select
                        value={store_id}
                        onChange={(e) => setStore_id(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "15px",
                          background: "white",
                          cursor: "pointer",
                        }}
                      >
                        <option value="">Select Store</option>
                        {stores.map((store) => (
                          <option key={store.id} value={store.id}>
                            {store.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    className="submit-product-btn"
                    onClick={productsAdmin}
                  >
                    Save Product to Bretix 
                  </button>
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
                    </div>
                    <div className="product-info">
                      <h4 className="product-title">
                        {product.title || "Item"}
                      </h4>
                      <div className="product-meta">
                        <span className="product-price">${product.price}</span>
                        <span className="product-stock">In Stock</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="users-section animate-fade-in">
              <div className="modern-table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Member Info</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Management</th>
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
                              <span className="name">{user.firstname}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="location-chip">
                            <Leaf size={12} /> {user.country || "Global"}
                          </div>
                        </td>
                        <td>
                          <span className="status-pill active">Verified</span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            className="action-edit-btn"
                            onClick={() => {
                              console.log(user);

                              setUsersEdit({
                                firstname: user.firstname,
                                lastname: user.lastname,
                                country: user.country,
                                id: user.id,
                              });
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
                  value={`$${totalSales}`}
                  icon={<TrendingUp size={20} />}
                  type="emerald"
                />
                <StatCard
                  title="Bretix Projects"
                  value="24"
                  change="+2"
                  icon={<Leaf size={20} />}
                  type="green"
                />
                <StatCard
                  title="Completed Orders"
                  value={totalOrders}
                  icon={<CheckCircle size={20} />}
                  type="emerald"
                />
              </div>

              <div
                style={{
                  marginTop: "30px",
                  background: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h3>Recent Completed Orders</h3>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <Calendar size={16} />
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setCurrentPage(1);
                        }}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                    <span>to</span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <Calendar size={16} />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setCurrentPage(1);
                        }}
                        style={{
                          padding: "8px 12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                    {(startDate || endDate) && (
                      <button
                        onClick={() => {
                          setStartDate("");
                          setEndDate("");
                          setCurrentPage(1);
                        }}
                        style={{
                          padding: "8px 16px",
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {isLoadingOrders ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#6b7280",
                    }}
                  >
                    Loading orders...
                  </div>
                ) : (
                  <>
                    <div className="modern-table-container">
                      <table className="modern-table">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Products</th>
                            <th>Total</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {completedOrders.length === 0 ? (
                            <tr>
                              <td
                                colSpan="5"
                                style={{ textAlign: "center", padding: "40px" }}
                              >
                                No orders found
                              </td>
                            </tr>
                          ) : (
                            completedOrders.map((order) => (
                              <tr key={order.cart_id}>
                                <td>
                                  <span
                                    style={{
                                      fontWeight: "600",
                                      color: "#10b981",
                                    }}
                                  >
                                    #{order.cart_id}
                                  </span>
                                </td>
                                <td>{order.user_name}</td>
                                <td>
                                  <span
                                    style={{
                                      display: "inline-block",
                                      padding: "4px 12px",
                                      background: "#f3f4f6",
                                      borderRadius: "12px",
                                      fontSize: "13px",
                                      color: "#6b7280",
                                    }}
                                  >
                                    {order.num_of_products} items
                                  </span>
                                </td>
                                <td
                                  style={{
                                    fontWeight: "600",
                                    color: "#059669",
                                    fontSize: "15px",
                                  }}
                                >
                                  ${parseFloat(order.total).toFixed(2)}
                                </td>
                                <td
                                  style={{ color: "#6b7280", fontSize: "14px" }}
                                >
                                  {new Date(order.done_at).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {totalPages > 1 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "12px",
                          marginTop: "24px",
                          paddingTop: "24px",
                          borderTop: "1px solid #e5e7eb",
                        }}
                      >
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          style={{
                            padding: "8px 16px",
                            background: "white",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            cursor:
                              currentPage === 1 ? "not-allowed" : "pointer",
                            opacity: currentPage === 1 ? 0.5 : 1,
                            fontWeight: "500",
                            color: "#374151",
                          }}
                        >
                          Previous
                        </button>

                        <span
                          style={{
                            color: "#6b7280",
                            fontSize: "14px",
                          }}
                        >
                          Page {currentPage} of {totalPages}
                        </span>

                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          style={{
                            padding: "8px 16px",
                            background: "white",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            cursor:
                              currentPage === totalPages
                                ? "not-allowed"
                                : "pointer",
                            opacity: currentPage === totalPages ? 0.5 : 1,
                            fontWeight: "500",
                            color: "#374151",
                          }}
                        >
                          Next
                        </button>
                      </div>
                    )}

                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "12px",
                        color: "#6b7280",
                        fontSize: "14px",
                      }}
                    >
                      Showing {completedOrders.length} of {totalOrders} orders
                    </div>
                  </>
                )}
              </div>
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

      {showAddCategoryForm && (
        <div className="modal-overlay animate-fade-in">
          <div
            className="modal-content animate-slide-up"
            style={{ maxWidth: "500px" }}
          >
            <div className="modal-header">
              <div className="modal-title-box">
                <h3>Add New Category</h3>
              </div>
              <button
                className="close-modal-btn"
                onClick={() => {
                  setShowAddCategoryForm(false);
                  setNewCategoryName("");
                }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="input-field-premium">
                <label>Category Name</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "15px",
                  }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowAddCategoryForm(false);
                  setNewCategoryName("");
                }}
                style={{
                  padding: "10px 20px",
                  background: "#e5e7eb",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Cancel
              </button>
              <button
                className="submit-btn-eco"
                onClick={addCategory}
                style={{
                  padding: "10px 20px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, change, icon, type }) => (
  <div className={`stat-card ${type}`}>
       {" "}
    <div className="stat-header">
            <div className="stat-icon-wrapper">{icon}</div>     {" "}
      <span className="stat-change">{change}</span>   {" "}
    </div>
       {" "}
    <div className="stat-info">
            <p className="stat-label">{title}</p>     {" "}
      <p className="stat-value">{value}</p>   {" "}
    </div>
     {" "}
  </div>
);

export default AdminDashboard;
