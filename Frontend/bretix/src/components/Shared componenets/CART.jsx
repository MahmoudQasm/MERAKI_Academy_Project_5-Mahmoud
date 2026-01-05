import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Trash2,
  ShoppingBag,
  CreditCard,
  Truck,
  Minus,
  Plus,
} from "lucide-react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate()

 useEffect(() => {
  axios
    .get("http://localhost:5000/cart/with-products", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setItems(res.data.items);
      if (res.data.items.length > 0) {
        const id = res.data.items[0].cart_id;
        setCartId(id);
        localStorage.setItem('cartId', id);
      }
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

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const confirmCheckout = () => {
  if (items.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  navigate('/checkout');
};

  return (
    <div className="cart-premium-wrapper">
      <div className="cart-main-container">
        <div className="cart-items-section">
          <div className="cart-header-title">
            <ShoppingBag size={28} />
            <h2>
              Shopping Cart <span>({items.length} items)</span>
            </h2>
          </div>

          {items.length === 0 ? (
            <div className="empty-msg">سلتك خضراء بانتظار منتجاتك..</div>
          ) : (
            items.map((item) => (
              <div className="cart-item-card" key={item.cart_product_id}>
                <div className="item-img">
                  <img src={item.imgsrc} alt={item.title} />
                </div>
                <div className="item-info">
                  <h4>{item.title}</h4>
                  <p className="unit-price">${item.price}</p>
                </div>
                <div className="quantity-box">
                  <button
                    onClick={() =>
                      updateQuantity(item.cart_product_id, item.quantity - 1)
                    }
                  >
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.cart_product_id, item.quantity + 1)
                    }
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="item-subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  className="delete-btn"
                  onClick={() => updateQuantity(item.cart_product_id, 0)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary-section">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>Total Quantity</span>
              <span>{totalQuantity}</span>
            </div>
            <div className="summary-line total-big">
              <span>Total Price</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="payment-options">
              <p>Payment Method</p>
              <label className="radio-label">
                <input
                  type="radio"
                  name="payment_method"
                  value="COD"
                  defaultChecked
                />
                <div className="radio-design">
                  <Truck size={16} /> Cash on Delivery
                </div>
              </label>
              <label className="radio-label">
                <input type="radio" name="payment_method" value="Card" />
                <div className="radio-design">
                  <CreditCard size={16} /> Pay by card
                </div>
              </label>
            </div>

            <button className="location-btn">
              Insert Location for Delivery
            </button>
            <button className="checkout-btn-final" onClick={confirmCheckout}>Confirm Order</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
