import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/Login");
    } else if (parseInt(role) !== 2) {
      navigate("/");
    }
  }, []);

  const id = localStorage.getItem("storeId");
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5000/stores/${id}/statistic`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5000/stores/${id}/last-seven-days-chart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setChartData(res.data.data))
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (fromDate && toDate) {
      axios
        .get(
          `http://localhost:5000/stores/${id}/orders?page=${page}&from_date=${fromDate}&to_date=${toDate}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setOrders(res.data.orders);
          setTotalPages(res.data.total_pages);
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .get(`http://localhost:5000/stores/${id}/orders?page=${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setOrders(res.data.orders);
          setTotalPages(res.data.total_pages);
        })
        .catch((err) => console.log(err));
    }
  }, [id, page, fromDate, toDate]);

  return (
    <div>
      <div>
        <div>
          <h3>Total Sales</h3>
          <p>${stats.totalSales || 0}</p>
        </div>
        <div>
          <h3>Total Orders</h3>
          <p>{stats.total_orders || 0}</p>
        </div>
        <div>
          <h3>Total Products</h3>
          <p>{stats.total_products || 0}</p>
        </div>
        <div>
          <h3>Avg Per Order</h3>
          <p>${stats.avg_per_order || 0}</p>
        </div>
      </div>

      <div>
        <h2>Last 7 Days Revenue</h2>
        <div>
          {chartData.map((item) => (
            <div key={item.date}>
              <span>{item.date}</span>
              <span>${item.revenue}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2>Recent Orders</h2>

        <div>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <button onClick={() => setPage(1)}>Filter</button>
        </div>

        <div>
          {orders.map((order) => (
            <div
              key={order.order_id}
              onClick={() => navigate(`/order-details/${order.order_id}`)}
            >
              <h4>Order #{order.order_id}</h4>
              <p>
                Customer: {order.firstname} {order.lastname}
              </p>
              <p>
                Date:{" "}
                {order.done_at
                  ? new Date(order.done_at).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>Total: ${order.total}</p>
            </div>
          ))}
        </div>

        <div>
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
