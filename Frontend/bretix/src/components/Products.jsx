import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductsGrid.css";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stores, setStores] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [showDropDown, setShowDropDown] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/products/all")
      .then((res) => {
        setProducts(res.data.products || []);
      })
      .catch((err) => console.log("Error products:", err));

    axios
      .get("http://localhost:5000/categories/")
      .then((result) => {
        setCategory(result.data.categories || []);
      })
      .catch((err) => console.log("Error categories:", err));

    axios
      .get("http://localhost:5000/stores/all")
      .then((result) => {
        setStores(result.data.result || []);
      })
      .catch((err) => console.log("Error stores:", err));
  }, []);

  const filteredProducts = products.filter((item) => {
    if (!selectedCategory) return true;
    return item.categories_id == selectedCategory;
  });
  console.log(filteredProducts);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

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
      showToast("Please login first");
      return;
    }

    handleFlyAnimation(e, item.imgsrc);

    axios
      .post(
        "http://localhost:5000/cart",
        {
          products_id: item.id,
          cart_id: localStorage.getItem("CartId"),
          quantity: 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        const currentCount = parseInt(localStorage.getItem("cartCount") || "0");
        localStorage.setItem("cartCount", currentCount + 1);
        window.dispatchEvent(new Event("cartUpdated"));
        showToast("Product added to cart");
      })
      .catch(() => showToast("Error adding product"));
  };

  return (
    <div className="container-main">
      {toast.show && (
        <div className="toast-premium">
          <span>{toast.message}</span>
          <button onClick={() => setToast({ show: false, message: "" })}>
            ✕
          </button>
        </div>
      )}

      <div className="category-filter-bar">
        <button
          className={selectedCategory === "" ? "active" : ""}
          onClick={() => setSelectedCategory("")}
        >
          All Products
        </button>
        <button
          className={selectedCategory === "" ? "active" : ""}
          onClick={() => setShowDropDown(!showDropDown)}
        >
          All Categories
        </button>
        {showDropDown && (
          <select
            className="category-dropdown"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setShowDropDown(false);
            }}
          >
            <option value="">All Products</option>

            {category.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="header-section">
        <p className="sub-title">Eco Essentials Planet-Friendly</p>
        <h2 className="main-title">
          Bestselling <span>✨ Products</span>
        </h2>
      </div>

      <div className="products-grid">
        {filteredProducts.map((item) => (
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
