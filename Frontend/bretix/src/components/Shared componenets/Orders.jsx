import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Orders.css";
function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    axios
      .get(`http://localhost:5000/cart/getCartWhereIsDeletedTure`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      })
      .then((result) => {
        //setToken(result.data.token);
        setOrders(result.data.items);
        setIs_deleted(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        جاري تحميل طلباتك...
      </div>
    );
  }

 return (
    <div className="orders-page">
      <div className="orders-wrapper">
        <header className="orders-header">
          <h1>My Orders</h1>
          <p>سجل المشتريات الخاصة بك</p>
        </header>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>لا يوجد طلبات حالياً في سجلك.</p>
          </div>
        ) : (
          <div className="orders-grid-container">
            {/* رأس الجدول للديسك توب */}
            <div className="grid-header">
              <span>Product</span>
              <span>Order ID</span>
              <span>Status</span>
              <span>Total</span>
            </div>

            {orders.map((item, i) => (
              <div key={i} className="order-item-card">
                {/* العمود الأول: معلومات المنتج */}
                <div className="product-column">
                  <div className="product-img-box">
                    <img src={item.imgsrc || "placeholder.png"} alt={item.title} />
                  </div>
                  <div className="product-info">
                    <h3>{item.title || "Sustainable Product"}</h3>
                    <span>Qty: {item.quantity || 1}</span>
                  </div>
                </div>

                {/* العمود الثاني: رقم الطلب */}
                <div className="order-id-column">
                  <span className="label">Order ID:</span>
                  <span className="value">#ORD-{item.cart_id || i + 100}</span>
                </div>

                {/* العمود الثالث: الحالة */}
                <div className="status-column">
                  <span className="status-tag">Completed</span>
                </div>

                {/* العمود الرابع: السعر */}
                <div className="price-column">
                  <span className="price-value">{item.price} JOD</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
