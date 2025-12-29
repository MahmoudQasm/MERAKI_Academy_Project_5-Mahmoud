import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Stores.css"; 

const Stores = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/stores/all")
      .then((res) => {
        setStores(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="stores-container">
      <div className="stores-header">
        <h2>Our Eco-Friendly Stores</h2>
        <p>Discover businesses that care about our planet</p>
      </div>

      <div className="stores-grid">
        {stores.map((store) => (
          <div 
            key={store.id} 
            className="store-card" 
            onClick={() => navigate(`/stores/${store.id}`)}
          >
            <div className="store-image-wrapper">
              <img src={store.logo} alt={store.title} />
            </div>
            
            <div className="store-info">
              <h3>{store.title}</h3>
              <p>{store.description}</p>
              <div className="visit-btn">Visit Store</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stores;
