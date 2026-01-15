import React, { useEffect, useState } from "react";
import axios from "axios";
import GoogleMapReact from "google-map-react";
import SearchBar from "material-ui-search-bar";

import {
  Trash2,
  ShoppingBag,
  CreditCard,
  Truck,
  MinusCircle, // تغيير الأيقونة
  PlusCircle,  // تغيير الأيقونة
  MapPin,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("COD");

  const [currentLocation, setCurrentLocation] = useState(null);
  const token = localStorage.getItem("token");
  const [addressData, setAddressData] = useState({});
  const navigate = useNavigate();
  const [address, setAddress] = useState("Loading address...");
  const [selAddressData, setSelAddressData] = useState({});

  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const showCustomToast = (msg, type = "info") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3500);
  };

  useEffect(() => {
    axios
      .get("https://meraki-academy-project-5-bn67.onrender.com/cart/with-products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setItems(res.data.items);
        if (res.data.items.length > 0) {
          const id = res.data.items[0].cart_id;
          setCartId(id);
          localStorage.setItem("cartId", id);
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
        `https://meraki-academy-project-5-bn67.onrender.com/cart/${cartProductId}`,
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
      showCustomToast("Your cart is empty!", "error");
      return;
    }
    if (!selectedLocation) {
      showCustomToast("Please select delivery location first!", "error");
      return;
    }
    if (selectedPayment === "COD") {
      const cartId = localStorage.getItem("cartId");
      axios
        .put(
          `https://meraki-academy-project-5-bn67.onrender.com/cart/complete/${cartId}`,
          { payment_method: "COD" },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          localStorage.setItem(cartId, res.data.newCartId);
          navigate("/Success");
        })
        .catch((err) => {
          console.log("OrderFailed", err);
          showCustomToast("Order failed, please try again.", "error");
        });
    } else {
      navigate("/checkout");
    }
  };

  const handleSelLocationClick = async (lat, lng) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );

    const data = await response.json();
    setSelAddressData(data.address);
  };

  const handleLocationClick = () => {
    setShowLocationModal(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );

          const data = await response.json();
          setCurrentLocation({ lat, lng });
          setAddressData(data.address);
        },
        (error) => {
          console.error(error.message);
          showCustomToast("Please enable location access", "error");
        }
      );
    }
  };

  const handleMapClick = ({ lat, lng }) => {
    handleSelLocationClick(lat, lng);
    setSelectedLocation({ lat, lng });
  };

  const confirmLocation = () => {
    if (selectedLocation) {
      localStorage.setItem(
        "deliveryLocation",
        JSON.stringify(selectedLocation)
      );
      setShowLocationModal(false);
      showCustomToast(
        `Location saved: ${selAddressData.country || ''} ${selAddressData.state || ''}`, 
        "success"
      );
    }
  };

  const Marker = () => (
    <div
      style={{
        width: "30px",
        height: "30px",
        position: "absolute",
        transform: "translate(-50%, -100%)",
      }}
    >
      <MapPin size={30} color="#e74c3c" fill="#e74c3c" />
    </div>
  );

  return (
    <div className="cart-premium-wrapper">
      {toast.show && (
        <div className={`premium-toast-container ${toast.type}`}>
          <div className="toast-content">
            {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{toast.message}</span>
          </div>
          <div className="toast-progress"></div>
        </div>
      )}

      <div className="cart-main-container">
        <div className="cart-items-section">
          <div className="cart-header-title">
            <ShoppingBag size={28} />
            <h2>
              Shopping Cart <span>({items.length} items)</span>
            </h2>
          </div>

          {items.length === 0 ? (
            <div className="empty-msg">
              Your cart is waiting for your products..
            </div>
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

           
                <div className="quantity-box-premium">
                  <button
                    className="qty-btn-neo minus"
                    onClick={() =>
                      updateQuantity(item.cart_product_id, item.quantity - 1)
                    }
                  >
                    <MinusCircle size={22} strokeWidth={1.5} />
                  </button>
                  
                  <span className="qty-number" >{item.quantity}</span>
                  
                  <button
                    className="qty-btn-neo plus"
                    onClick={() =>
                      updateQuantity(item.cart_product_id, item.quantity + 1)
                    }
                  >
                    <PlusCircle size={22} strokeWidth={1.5} />
                  </button>
                </div>
                {/* ------------------------ */}

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
                  checked={selectedPayment === "COD"}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                />
                <div className="radio-design">
                  <Truck size={16} /> Cash on Delivery
                </div>
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  name="payment_method"
                  value="Card"
                  checked={selectedPayment === "Card"}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                />
                <div className="radio-design">
                  <CreditCard size={16} /> Pay by card
                </div>
              </label>
            </div>

            <button className="location-btn" onClick={handleLocationClick}>
              Insert Location for Delivery
            </button>

            <button className="checkout-btn-final" onClick={confirmCheckout}>
              {selectedPayment === "COD" ? "Confirm Order" : "Go to Payment"}
            </button>
          </div>
        </div>
      </div>

      {showLocationModal && (
        <div className="location-modal-overlay">
          <div className="location-modal">
            <div className="modal-header">
              <h3>Select Delivery Location</h3>
              <button
                className="close-modal"
                onClick={() => setShowLocationModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <p className="location-instruction">
                Click on the map to select your delivery location, or use your
                current location.
              </p>
              {selectedLocation && (
                <p className="selected-coords">
                  Selected: {selAddressData.country}, {selAddressData.state} -
                  {selAddressData.road}
                </p>
              )}
              <div style={{ height: "400px", width: "100%" }}>
                {currentLocation && (
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: "AIzaSyDOlbYHkwC0-qcwR4ny_SlUXphJmF3h6hE",
                    }}
                    defaultCenter={currentLocation}
                    center={selectedLocation || currentLocation}
                    defaultZoom={14}
                    onClick={handleMapClick}
                  >
                    {selectedLocation && (
                      <Marker
                        lat={selectedLocation.lat}
                        lng={selectedLocation.lng}
                      />
                    )}
                  </GoogleMapReact>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowLocationModal(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-location-btn"
                onClick={confirmLocation}
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;