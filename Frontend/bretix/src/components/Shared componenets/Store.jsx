import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SingleStore.css"; 

const Store = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null); 

  useEffect(() => {
    axios
      .get(`http://localhost:5000/stores/${id}`)
      .then((res) => {
        const storeData = res.data.result[0];
        setStore(storeData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);


  if (!store) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading Store Details...</p>
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
              <button className="wishlist-btn">♥</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;