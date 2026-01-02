import React, { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("http://localhost:5000/cart/with-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setItems(res.data.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const removeFromCart = (cartProductId) => {
    axios
      .delete(`http://localhost:5000/cart/${cartProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data.message);

        setItems(
          items.filter((item) => item.cart_product_id !== cartProductId)
        );
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
      });
  };
  return (
    <div>
      <h2>Your Cart</h2>

      {items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        items.map((item) => (
          <div key={item.cart_product_id}>
            <img src={item.imgsrc} alt={item.title} />
            <p>{item.title}</p>
            <p>Price: {item.price}</p>
            <p>Quantity : {item.quantity}</p>D
            <hr />
            <button onClick={() => removeFromCart(item.cart_product_id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;
