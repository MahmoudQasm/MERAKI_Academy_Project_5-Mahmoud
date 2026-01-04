import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { order_id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/Login");
    } else if (parseInt(role) !== 2) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/stores/order-details/${order_id}`)
      .then((res) => {
        setOrder(res.data.order);
        setItems(res.data.items);
        setTotal(res.data.total);
      })
      .catch((err) => console.log(err));
  }, [order_id]);

  if (!order) return <div>Loading...</div>;

  return (
    <div>
      <h1>Order #{order.id}</h1>
      <p>Customer ID: {order.users_id}</p>
      <p>Date: {new Date(order.done_at).toLocaleDateString()}</p>

      <h2>Items:</h2>
      <div>
        {items.map((item) => (
          <div key={item.id}>
            <img src={item.imgsrc} alt={item.title} />
            <h3>{item.title}</h3>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Subtotal: ${item.subtotal}</p>
          </div>
        ))}
      </div>

      <h2>Total: ${total}</h2>
    </div>
  );
};

export default OrderDetails;
