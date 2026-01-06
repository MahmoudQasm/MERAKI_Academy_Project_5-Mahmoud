import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
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
          `http://localhost:5000/cart/complete/${cartId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          localStorage.setItem("cartId", res.data.newCartId);
          navigate("/success");
        })
        .catch(() => {
          setError("Payment failed");
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <CardElement />

      {error && <p>{error}</p>}

      <button onClick={handlePayment}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default CheckoutForm;
