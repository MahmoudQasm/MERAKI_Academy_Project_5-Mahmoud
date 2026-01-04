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

  const updateQuantity = (cartProductId, newQuantity) => {
    const token = localStorage.getItem("token");

    axios
      .patch(
        `http://localhost:5000/cart/${cartProductId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        if (newQuantity === 0) {
          setItems(items.filter((i) => i.cart_product_id !== cartProductId));
        } else {
          setItems(
            items.map((item) =>
              item.cart_product_id === cartProductId
                ? { ...item, quantity: newQuantity }
                : item
            )
          );
        }
      });
  };
  const total = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

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
            <p>Total: {item.price * item.quantity}</p>
            <p>Quantity : {item.quantity}</p>
            <button
              onClick={() =>
                updateQuantity(item.cart_product_id, item.quantity - 1)
              }
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() =>
                updateQuantity(item.cart_product_id, item.quantity + 1)
              }
            >
              +
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;
