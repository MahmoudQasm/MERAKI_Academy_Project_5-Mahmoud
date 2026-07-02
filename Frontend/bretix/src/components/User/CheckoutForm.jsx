import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CheckoutForm.css";
import API_URL from "../../config/api";
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cardStyleOptions = {
    style: {
      base: {
        color: "#1e293b",
        fontFamily: '"Inter", sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#94a3b8",
        },
      },
      invalid: {
        color: "#b91c1c",
        iconColor: "#b91c1c",
      },
    },
  };

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const cardElement = elements.getElement(CardElement);

    const result = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else {
      const token = localStorage.getItem("token");
      const cartId = localStorage.getItem("cartId");

      axios
        .put(
          `${API_URL}/cart/complete/${cartId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((res) => {
          console.log("Before:", localStorage.getItem("cartCount"));

          localStorage.setItem("cartId", res.data.newCartId);

          localStorage.setItem("cartCount", "0");

          console.log("After:", localStorage.getItem("cartCount"));

          window.dispatchEvent(new Event("cartUpdated"));

          navigate("/success");
        })
        .catch(() => {
          setError("Payment failed. Please try again.");
          setLoading(false);
        });
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className="payment-card">
        <div className="payment-header">
          <div className="secure-badge">🔒 Secure Payment</div>
          <h2>Secure Checkout</h2>
          <p>Enter your card details to complete the purchase</p>
        </div>

        <div className="stripe-input-container">
          <CardElement options={cardStyleOptions} />
        </div>

        {error && <div className="payment-error-msg">{error}</div>}

        <button
          className="pay-now-btn"
          onClick={handlePayment}
          disabled={loading || !stripe}
        >
          {loading ? (
            <div className="payment-loader"></div>
          ) : (
            "Confirm & Pay Now"
          )}
        </button>

        <div className="payment-footer">
          Your payment is encrypted and secure.
          <div className="trust-icons">
            <small>Visa • Mastercard • Amex</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
