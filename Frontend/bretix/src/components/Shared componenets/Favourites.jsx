import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    
    axios
      .get("https://meraki-academy-project-5-bn67.onrender.com/favourites", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFavourites(res.data.favourites);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token, navigate]);

  
  const removeFromFavourites = (storeId) => {
    axios
      .delete(`https://meraki-academy-project-5-bn67.onrender.com/favourites/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        
        setFavourites(favourites.filter((store) => store.id !== storeId));
      })
      .catch((err) => console.error(err));
  };

  if (loading) {
    return (
      <div style={{ 
        padding: "50px", 
        textAlign: "center",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "30px 50px",
      minHeight: "70vh",
      backgroundColor: "#f8f9fa"
    }}>
      <h1 style={{ 
        color: "#1b4332",
        marginBottom: "30px",
        fontSize: "32px"
      }}>
        ❤️ My Favourite Stores
      </h1>

      {favourites.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "80px 20px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🤍</div>
          <h3 style={{ color: "#333", marginBottom: "10px" }}>
            No favourite stores yet!
          </h3>
          <p style={{ fontSize: "16px", color: "#666", marginBottom: "30px" }}>
            Start adding stores you love to easily find them later
          </p>
          <button
            onClick={() => navigate("/stores")}
            style={{
              padding: "12px 40px",
              backgroundColor: "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#27ae60"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#2ecc71"}
          >
            Browse Stores
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "25px",
            marginTop: "20px",
          }}
        >
          {favourites.map((store) => (
            <div
              key={store.id}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 5px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 15px rgba(0,0,0,0.08)";
              }}
            >
              {/* زر حذف */}
              <button
                onClick={() => removeFromFavourites(store.id)}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  background: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  fontSize: "20px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                  zIndex: 10,
                  transition: "transform 0.2s ease"
                }}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              >
                ❤️
              </button>

              <div
                onClick={() => navigate(`/stores/${store.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={store.logo}
                  alt={store.title}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                  }}
                />

                <div style={{ padding: "20px" }}>
                  <h3 style={{ 
                    marginBottom: "10px",
                    color: "#1b4332",
                    fontSize: "18px",
                    fontWeight: "600"
                  }}>
                    {store.title}
                  </h3>
                  
                  <p style={{ 
                    color: "#666", 
                    fontSize: "14px",
                    lineHeight: "1.5",
                    marginBottom: "15px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {store.description}
                  </p>

                  <button
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#2ecc71",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "15px",
                      fontWeight: "500",
                      transition: "background-color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#27ae60"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#2ecc71"}
                  >
                    Visit Store →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;