import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AllProducts.css";

const AllProducts = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/Login");
    } else if (parseInt(role) !== 2) {
      navigate("/");
    }
  }, []);

  const navigate = useNavigate();
  const { id } = useParams();
  const [storeInfo, setStoreInfo] = useState({});
  const [storeProducts, setStoreProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5000/stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStoreInfo(res.data.result[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5000/stores/${id}/productsinstore`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStoreProducts(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const showProducts = storeProducts.map((product) => {
    return (
      <div className="product-card" key={product.id}>
        <div className="product-image-wrapper">
          <img
            src={product.imgsrc}
            alt={product.title}
            onClick={() => {
              navigate(`/allproducts/${product.id}`);
            }}
          />
        </div>
        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          <div className="product-meta">
            <span className="product-price">${product.price || "0.00"}</span>
            <span className="product-rate">⭐ {product.rate}</span>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="store-products-container">
      <header className="store-header">
        <div className="header-content">
          <h1>{storeInfo.name || "Store Products"}</h1>
          <button
            className="add-product-btn"
            onClick={() => {
              navigate(`/stores/${id}/addnewproduct`);
            }}
          >
            + Add New Product
          </button>
        </div>
      </header>

      <div className="products-grid">
        {showProducts.length > 0 ? (
          showProducts
        ) : (
          <p className="no-products">No products found in this store.</p>
        )}
      </div>
    </div>
  );
};
export default AllProducts;
