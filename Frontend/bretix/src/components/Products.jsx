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
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.log(err));
  }, []);

  const handleFlyAnimation = (e, imgsrc) => {
    const cart = document.getElementById("cart-icon-nav");
    if (!cart) return;

    const flyingImg = document.createElement("img");
    flyingImg.src = imgsrc;
    flyingImg.className = "flying-product-premium";

    const rect = e.target.getBoundingClientRect();
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    flyingImg.style.left = `${rect.left + scrollLeft}px`;
    flyingImg.style.top = `${rect.top + scrollTop}px`;

    document.body.appendChild(flyingImg);

    const cartRect = cart.getBoundingClientRect();

    requestAnimationFrame(() => {
      flyingImg.style.setProperty(
        "--target-x",
        `${cartRect.left + scrollLeft - rect.left}px`
      );
      flyingImg.style.setProperty(
        "--target-y",
        `${cartRect.top + scrollTop - rect.top}px`
      );
      flyingImg.classList.add("is-flying");
    });

    setTimeout(() => {
      flyingImg.remove();
      cart.classList.add("cart-bounce-premium");
      setTimeout(() => cart.classList.remove("cart-bounce-premium"), 400);
    }, 900);
  };
  const addToCart = (e, item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    handleFlyAnimation(e, item.imgsrc);

    axios
      .post(
        "http://localhost:5000/cart",
        {
          products_id: item.id,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      .then((res) => {
        console.log("Product added");

        const currentCount = parseInt(localStorage.getItem("cartCount") || "0");
        const newCount = currentCount + 1;
        localStorage.setItem("cartCount", newCount);

        window.dispatchEvent(new Event("cartUpdated"));
      })
      .catch((err) => {
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
                onClick={(e) => addToCart(e, item)}
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
