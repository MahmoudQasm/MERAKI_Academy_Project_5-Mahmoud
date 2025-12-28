import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Products.css";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/products/all")
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.log(err));
  }, []);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth / 2
          : scrollLeft + clientWidth / 2;

      sliderRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="container-main">
      <div className="header-section">
        <p className="sub-title">Eco Essentials Planet-Friendly</p>
        <div className="title-row">
          <h2 className="main-title">
            Bestselling <span>✨ Products</span>
          </h2>
          <div className="slider-btns">
            <button className="nav-btn prev" onClick={() => scroll("left")}>
              ←
            </button>
            <button className="nav-btn next" onClick={() => scroll("right")}>
              →
            </button>
          </div>
        </div>
      </div>

      <div className="products-slider" ref={sliderRef}>
        {products.map((item, i) => (
          <Link
            to={`/product/${item.id}`}
            className="product-item"
            key={item.id}
          >
            <div className="product-card">
              <div className="image-wrapper">
                <span className="product-badge">{item.badge || "New"}</span>
                <img
                  src={item.imgsrc}
                  alt={item.title}
                  className="product-img"
                />
              </div>

              <div className="product-info">
                <div className="color-options">
                  <span className="dot dot-1"></span>
                  <span className="dot dot-2"></span>
                  <span className="dot dot-3"></span>
                </div>

                <h3 className="product-name">{item.title}</h3>

                <div className="product-footer">
                  <span className="price">${item.price}</span>
                  <button className="add-to-cart-btn">
                    <span className="plus-icon">+</span> Cart
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Products;
