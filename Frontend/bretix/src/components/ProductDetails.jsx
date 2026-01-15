import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css";
import { FaPlus, FaMinus, FaCheckCircle } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const increseQu = () => setQuantity((prev) => prev + 1);
  const decreseQu = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  useEffect(() => {
    axios
      .get(`https://meraki-academy-project-5-bn67.onrender.com/products/${id}`)
      .then((res) => {
        setProduct(res.data.product);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);
console.log(product);

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Login");
      return;
    }

    setAddingToCart(true);

    try {
      await axios.post(
        "https://meraki-academy-project-5-bn67.onrender.com/cart",
        { products_id: id, quantity: quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowToast(true);

      const cartIcon = document.getElementById("cart-icon-nav");
      if (cartIcon) {
        cartIcon.classList.add("cart-bounce-premium");
        setTimeout(() => cartIcon.classList.remove("cart-bounce-premium"), 500);
      }

      setTimeout(() => setShowToast(false), 3500);

      const currentCount = parseInt(localStorage.getItem("cartCount") || "0");
      localStorage.setItem("cartCount", currentCount + 1);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (!product) return <p className="loading">Product not found</p>;

  return (
    <div className="details-container">
      {showToast && (
        <div className="premium-toast-container">
          <div className="toast-content">
            <FaCheckCircle color="#2ecc71" size={22} />
            <span>Product added to cart!</span>
          </div>
          <div className="toast-progress"></div>
        </div>
      )}

      <div className="details-card">
        <div className="details-image">
          <span className="product-badge">New</span>
          <img src={product.imgsrc} alt={product.title} />
        </div>

        <div className="details-info">
          <h2 className="product-title">{product.title}</h2>
          <p className="product-desc">{product.description}</p>
          <div className="rating">⭐ {product.rate}</div>

          <div className="quantity-section">
            <span className="qty-label">Quantity</span>
            <div className="qty-selector-eco">
              <button onClick={decreseQu} className="qty-btn">
                <FaMinus />
              </button>
              <span className="qty-value">{quantity}</span>
              <button onClick={increseQu} className="qty-btn">
                <FaPlus />
              </button>
            </div>
          </div>

          <div className="details-footer">
            <span className="price">${product.price}</span>
            <button
              className={`add-to-cart-btn ${showToast ? "success-state" : ""}`}
              onClick={addToCart}
              disabled={addingToCart || showToast}
            >
              {showToast ? (
                <>
                  {" "}
                  <FaCheckCircle className="check-icon" /> Added{" "}
                </>
              ) : (
                <>
                  {" "}
                  <span className="plus-icon">+</span>{" "}
                  {addingToCart ? "Adding..." : "Cart"}{" "}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
