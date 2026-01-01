import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./ProductssGrid.css";

const Home = () => {
  const navigate = useNavigate();
  const [top10Products, setTop10Products] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/products/top10")
      .then((res) => {
        setTop10Products(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const addToCart = (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    axios
      .post(
        "http://localhost:5000/cart",
        {
          products_id: productId,
          cart_id: localStorage.getItem("CartId"),
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        alert("Product added to cart ✅");
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("Error adding product");
      });
  };
  return (
    <div className="container-main">
      <div className="header-section">
        <p className="sub-title">Premium Selection</p>
        <h2 className="main-title">
          Top 10 <span>✨ Bestsellers</span>
        </h2>
      </div>

      <div className="products-grid">
        {top10Products.map((product) => (
          <div className="product-item" key={product.id}>
            <div className="product-card">
              <Link to={`/product/${product.id}`}>
                <div className="image-wrapper">
                  <span className="product-badge">Top Rated</span>
                  <img
                    src={product.imgsrc}
                    alt={product.title}
                    className="product-img"
                  />
                </div>

                <h3 className="product-name">{product.title}</h3>
              </Link>

              <div className="product-footer">
                <span className="price">${product.price}</span>

                <button
                  className="add-to-cartProduct-btn"
                  onClick={() => addToCart(product.id)}
                >
                  <span className="plus-icon">+</span> Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

<button
  className="add-to-cart-btn"
  onClick={() => addToCart(item.id)}
></button>;
