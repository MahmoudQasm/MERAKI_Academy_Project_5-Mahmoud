import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./ProductssGrid.css";

const Home = () => {
  const navigate = useNavigate();
  const [top10Products, setTop10Products] = useState([]);


  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "info" });
    }, 3000);
  };

  useEffect(() => {
    axios
      .get("https://meraki-academy-project-5-bn67.onrender.com/products/top10")
      .then((res) => {
        setTop10Products(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
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

  const addToCart = (e, product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      showNotification("Please login first", "warning");
      return;
    }

    handleFlyAnimation(e, product.imgsrc);

    axios
      .post(
        "https://meraki-academy-project-5-bn67.onrender.com/cart",
        {
          products_id: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const currentCount = parseInt(localStorage.getItem("cartCount") || "0");
        localStorage.setItem("cartCount", currentCount + 1);
        window.dispatchEvent(new Event("cartUpdated"));
        showNotification("Product added to cart 🛒", "success");
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        showNotification("Error adding product", "error");
      });
  };

  return (
    <div className="container-main">
    
      {notification.show && (
        <div className={`notification-box ${notification.type}`}>
          {notification.message}
        </div>
      )}

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
                  onClick={(e) => addToCart(e, product)}
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
