import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Singlestore1.css";

const Store = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);

        const storeResponse = await axios.get(
          `https://meraki-academy-project-5-bn67.onrender.com/stores/${id}`
        );
        setStore(storeResponse.data.result[0]);

        const productsResponse = await axios.get(
          `https://meraki-academy-project-5-bn67.onrender.com/stores/${id}/products`
        );
        setProducts(productsResponse.data.result);

        if (token) {
          const favResponse = await axios.get(
            `https://meraki-academy-project-5-bn67.onrender.com/favourites/check/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setIsFavourite(favResponse.data.isFavourite);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [id, token]);

  const toggleFavourite = async () => {
    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    try {
      if (isFavourite) {
        await axios.delete(`https://meraki-academy-project-5-bn67.onrender.com/favourites/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavourite(false);
      } else {
        await axios.post(
          "https://meraki-academy-project-5-bn67.onrender.com/favourites",
          { store_id: parseInt(id) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavourite(true);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating favourite");
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading Store Details...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="loading-container">
        <p>Store not found</p>
      </div>
    );
  }

  return (
    <div className="single-store-page">
      <div className="store-hero-section">
        <div className="store-content-wrapper">
          <div className="store-image-box">
            <img src={store.logo} alt={store.title} />
          </div>

          <div className="store-details-box">
            <span className="badge">Official Store</span>
            <h2>{store.title}</h2>
            <p className="store-desc">{store.description}</p>

            <div className="action-buttons">
              <button
                className="wishlist-btn"
                onClick={toggleFavourite}
                style={{
                  backgroundColor: isFavourite ? "#e74c3c" : "transparent",
                  color: isFavourite ? "white" : "#e74c3c",
                  border: `2px solid #e74c3c`,
                  transition: "all 0.3s ease",
                }}
              >
                {isFavourite ? "❤️ Favourited" : "🤍 Add to Favourite"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="products-area">
        <h3 style={{ color: "#1b4332", marginBottom: "20px" }}>
          Available Products ({products.length})
        </h3>

        {products.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#999",
            }}
          >
            <p>No products available in this store yet.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card-store"
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="product-image">
                  <img src={product.imgsrc} alt={product.title} />
                </div>
                <div className="product-info">
                  <h4>{product.title}</h4>
                  <div className="product-meta">
                    <span className="price">${product.price}</span>
                    {product.rate && (
                      <span className="rating">⭐ {product.rate}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
