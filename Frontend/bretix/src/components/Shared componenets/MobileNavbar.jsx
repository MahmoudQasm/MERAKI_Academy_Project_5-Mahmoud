import { useNavigate } from "react-router-dom";
import {
  Store,
  Package,
  ClipboardList,
  Heart,
  MessageSquare,
  Search,
  ShoppingCart,
  ShieldCheck,
} from "lucide-react";

import "./MobileNavbar.css";

const MobileNavbar = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const cartCount = parseInt(localStorage.getItem("cartCount") || "0");

  return (
    <div className="mobile-navbar">

      <div className="mobile-navbar-top">

        <img
          src="/logo1.png"
          alt="Britex"
          className="mobile-logo"
          onClick={() => navigate("/")}
        />

        <div className="mobile-actions">

          <button onClick={() => navigate("/products")}>
            <Search size={22} />
          </button>

          <button
            className="mobile-cart-btn"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart size={22} />

            {cartCount > 0 && (
              <span className="mobile-cart-badge">
                {cartCount}
              </span>
            )}

          </button>

          {role === "1" && (
            <button onClick={() => navigate("/AdminDashboard")}>
              <ShieldCheck size={22} />
            </button>
          )}

        </div>

      </div>

      <div className="mobile-navbar-bottom">

        <button onClick={() => navigate("/stores")}>
          <Store size={22} />
          <span>Stores</span>
        </button>

        <button onClick={() => navigate("/products")}>
          <Package size={22} />
          <span>Products</span>
        </button>

        {role && (
          <button onClick={() => navigate("/Orders")}>
            <ClipboardList size={22} />
            <span>Orders</span>
          </button>
        )}

        {role && (
          <button onClick={() => navigate("/favourites")}>
            <Heart size={22} />
            <span>Favorites</span>
          </button>
        )}

        <button onClick={() => navigate("/ContactUs")}>
          <MessageSquare size={22} />
          <span>Contact</span>
        </button>

      </div>

    </div>
  );
};

export default MobileNavbar;