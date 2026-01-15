import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Login");
      return;
    }
    fetchOrders();
  }, [currentPage, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `https://meraki-academy-project-5-bn67.onrender.com/cart/my-orders?page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "30px" }}>
        My Orders
      </h1>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "60px",
          background: "#f9fafb",
          borderRadius: "12px"
        }}>
          <p style={{ fontSize: "18px", color: "#6b7280" }}>
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <>
          <div style={{ 
            background: "white", 
            borderRadius: "12px", 
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            overflow: "hidden"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f9fafb" }}>
                <tr>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#374151" }}>
                    Order ID
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#374151" }}>
                    Date
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#374151" }}>
                    Items
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#374151" }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr 
                    key={order.order_id}
                    style={{ 
                      borderTop: "1px solid #e5e7eb",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                  >
                    <td style={{ padding: "16px" }}>
                      <span style={{ 
                        fontWeight: "600", 
                        color: "#10b981",
                        fontSize: "14px"
                      }}>
                        #{order.order_id}
                      </span>
                    </td>
                    <td style={{ padding: "16px", color: "#6b7280", fontSize: "14px" }}>
                      {new Date(order.done_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ 
                        display: "inline-block",
                        padding: "4px 12px",
                        background: "#f3f4f6",
                        borderRadius: "12px",
                        fontSize: "13px",
                        color: "#6b7280"
                      }}>
                        {order.num_of_products} items
                      </span>
                    </td>
                    <td style={{ 
                      padding: "16px", 
                      fontWeight: "600", 
                      color: "#059669",
                      fontSize: "16px"
                    }}>
                      ${parseFloat(order.total).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              gap: "12px",
              marginTop: "30px"
            }}>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: "10px 20px",
                  background: currentPage === 1 ? "#e5e7eb" : "white",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Previous
              </button>

              <span style={{ color: "#6b7280", fontSize: "14px" }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: "10px 20px",
                  background: currentPage === totalPages ? "#e5e7eb" : "white",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;