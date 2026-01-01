import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductsGrid.css";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("http://localhost:5000/products/all")
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((err) => console.log(err));
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
        <p className="sub-title">Eco Essentials Planet-Friendly</p>
        <h2 className="main-title">
          Bestselling <span>✨ Products</span>
        </h2>
      </div>

      <div className="products-grid">
        {products.map((item) => (
          <div className="product-item" key={item.id}>
            <Link to={`/product/${item.id}`}>
              <div className="product-card">
                <div className="image-wrapper">
                  <span className="product-badge">{item.badge || "New"}</span>
                  <img
                    src={item.imgsrc}
                    alt={item.title}
                    className="product-img"
                  />
                </div>

                <h3 className="product-name">{item.title}</h3>
              </div>
            </Link>

            <div className="product-footer">
              <span className="price">${item.price}</span>

              <button
                className="add-to-cart-btn"
                onClick={() => addToCart(item.id)}
              >
                <span className="plus-icon">+</span> Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
