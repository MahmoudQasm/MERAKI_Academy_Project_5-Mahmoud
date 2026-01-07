import React, { useEffect, useState } from "react";
import axios from "axios";
import GoogleMapReact from 'google-map-react';
import {
  Trash2,
  ShoppingBag,
  CreditCard,
  Truck,
  Minus,
  Plus,
  MapPin,
  X
} from "lucide-react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
    if (!selectedLocation) {
      alert('Please select delivery location first!');
      return;
    }
    navigate('/checkout');
  };

  const handleLocationClick = () => {
    setShowLocationModal(true);
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          setSelectedLocation(location);
        },
        (error) => {
          console.log("Error getting location:", error);
          // Default to Irbid, Jordan if location access denied
          const defaultLocation = { lat: 32.5556, lng: 35.8469 };
          setCurrentLocation(defaultLocation);
          setSelectedLocation(defaultLocation);
        }
      );
    }
  };

  const handleMapClick = ({ lat, lng }) => {
    setSelectedLocation({ lat, lng });
  };

  const confirmLocation = () => {
    if (selectedLocation) {
      localStorage.setItem('deliveryLocation', JSON.stringify(selectedLocation));
      setShowLocationModal(false);
      alert(`Location saved: ${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`);
    }
  };

  const Marker = () => (
    <div style={{
      width: '30px',
      height: '30px',
      position: 'absolute',
      transform: 'translate(-50%, -100%)'
    }}>
      <MapPin size={30} color="#e74c3c" fill="#e74c3c" />
    </div>
  );

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

            <button className="location-btn" onClick={handleLocationClick}>
              Insert Location for Delivery
            </button>
            <button className="checkout-btn-final" onClick={confirmCheckout}>
              Confirm Order
            </button>
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="location-modal-overlay">
          <div className="location-modal">
            <div className="modal-header">
              <h3>Select Delivery Location</h3>
              <button className="close-modal" onClick={() => setShowLocationModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <p className="location-instruction">
                Click on the map to select your delivery location, or use your current location.
              </p>
              {selectedLocation && (
                <p className="selected-coords">
                  Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </p>
              )}
              <div style={{ height: '400px', width: '100%' }}>
                {currentLocation && (
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyDOlbYHkwC0-qcwR4ny_SlUXphJmF3h6hE" }}
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
              <button className="cancel-btn" onClick={() => setShowLocationModal(false)}>
                Cancel
              </button>
              <button className="confirm-location-btn" onClick={confirmLocation}>
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