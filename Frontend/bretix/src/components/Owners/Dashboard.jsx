import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  LayoutDashboard, Package, Settings, LogOut, 
  Store, Leaf, TrendingUp, ShoppingBag, 
  BarChart3, Calendar, Filter, ChevronLeft, ChevronRight 
} from "lucide-react";
import "./StoreManagement.css"; 

const Dashboard = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("storeId");
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) navigate("/Login");
    else if (parseInt(role) !== 2) navigate("/");
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`https://meraki-academy-project-5-bn67.onrender.com/stores/${id}/statistic`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setStats(res.data))
    .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`https://meraki-academy-project-5-bn67.onrender.com/stores/${id}/last-seven-days-chart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setChartData(res.data.data))
    .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const url = fromDate && toDate 
      ? `https://meraki-academy-project-5-bn67.onrender.com/stores/${id}/orders?page=${page}&from_date=${fromDate}&to_date=${toDate}`
      : `https://meraki-academy-project-5-bn67.onrender.com/stores/${id}/orders?page=${page}`;
    
    axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => {
      setOrders(res.data.orders);
      setTotalPages(res.data.total_pages);
    })
    .catch((err) => console.log(err));
  }, [id, page, fromDate, toDate]);

  return (
    <div className="owner-dashboard-container">
      <aside className="owner-sidebar">
        <div className="owner-logo-section">
          <div className="owner-logo-icon"><Leaf size={24} /></div>
          <div className="owner-logo-text">
            <h1>BRETIX <span>ECO</span></h1>
            <p>Merchant Dashboard</p>
          </div>
        </div>
        <nav className="owner-nav">
          <div className="owner-nav-item active"><LayoutDashboard size={20} /> <span>Overview</span></div>
          <div className="owner-nav-item" onClick={() => navigate(`/${id}/allproducts`)}><Package size={20} /> <span>Inventory</span></div>
          <div className="owner-nav-item" onClick={() => navigate(`/stores/StoreManagement/${id}`)}><Settings size={20} /> <span>Store Info</span></div>
        </nav>
        <div className="owner-sidebar-footer">
          <button className="owner-back-btn" onClick={() => navigate("/")}><LogOut size={18} /> <span>Exit</span></button>
        </div>
      </aside>

      <div className="owner-main-content">
        <header className="owner-header">
          <div className="owner-header-info">
            <h2>Analytics Dashboard</h2>
            <p>Real-time performance of your eco-store</p>
          </div>
        </header>

        <div className="owner-stats-grid">
          <StatCard title="Total Sales" value={`$${stats.totalSales || 0}`} icon={<TrendingUp />} type="emerald" />
          <StatCard title="Orders" value={stats.total_orders || 0} icon={<ShoppingBag />} type="blue" />
          <StatCard title="Products" value={stats.total_products || 0} icon={<Package />} type="green" />
          <StatCard title="Avg. Order" value={`$${stats.avg_per_order || 0}`} icon={<BarChart3 />} type="emerald" />
        </div>

        <div className="dashboard-flex-row">
          <section className="orders-section">
            <div className="section-card-header">
              <h3>Recent Orders</h3>
              <div className="filter-group">
                <div className="input-with-icon">
                   <Calendar size={14} />
                   <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div className="input-with-icon">
                   <Calendar size={14} />
                   <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="modern-table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.order_id} onClick={() => navigate(`/order-details/${order.order_id}`)} className="clickable-row">
                      <td><span className="order-id-badge">#{order.order_id}</span></td>
                      <td>{order.firstname} {order.lastname}</td>
                      <td>{order.done_at ? new Date(order.done_at).toLocaleDateString() : "N/A"}</td>
                      <td className="price-text">${order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination-controls">
              <button onClick={() => setPage(page - 1)} disabled={page === 1} className="pag-btn"><ChevronLeft size={18} /></button>
              <span>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="pag-btn"><ChevronRight size={18} /></button>
            </div>
          </section>

          
          <section className="chart-section">
            <div className="section-card-header">
              <h3>Revenue (Last 7 Days)</h3>
            </div>
            <div className="chart-list">
              {chartData.map((item) => (
                <div key={item.date} className="chart-item">
                  <span className="date-label">{item.date}</span>
                  <div className="progress-bar-bg">
                    <div className="progress-fill" style={{ width: `${Math.min((item.revenue / 1000) * 100, 100)}%` }}></div>
                  </div>
                  <span className="revenue-label">${item.revenue}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, type }) => (
  <div className={`stat-card-modern ${type}`}>
    <div className="stat-icon-circle">{icon}</div>
    <div className="stat-content">
      <p>{title}</p>
      <h4>{value}</h4>
    </div>
  </div>
);

export default Dashboard;