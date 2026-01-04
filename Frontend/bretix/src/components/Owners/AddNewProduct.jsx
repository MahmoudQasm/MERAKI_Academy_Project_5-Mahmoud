import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddNewProduct.css"; // تأكد من استدعاء ملف الـ CSS

const AddNewProduct = () => {
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
  const [imgsrc, setImgSrc] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [rate, setRate] = useState("");
  const [categories_id, setCategories_id] = useState("");
  const [store_id, setStore_id] = useState(id);

  const confirm = async () => {
    const token = localStorage.getItem("token");

    const newProductData = {
      imgsrc,
      title,
      description,
      price,
      rate,
      categories_id,
    };
    try {
      await axios.post(
        "http://localhost:5000/stores/addnewproductinstore",
        {
          ...newProductData,
          store_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(`/${store_id}/allproducts`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add-product-wrapper">
      <div className="add-product-card">
        <h2 className="form-title">Add New Eco-Product</h2>
        <p className="form-subtitle">
          Fill in the details to list a new item in Bretix
        </p>

        <div className="product-grid">
          {/* كل input داخل group لتنظيم المسافات */}
          <div className="input-group">
            <label>Product Title</label>
            <input
              type="text"
              placeholder="e.g. Organic Cotton Bag"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Category ID</label>
            <input
              type="text"
              placeholder="e.g. 1"
              onChange={(e) => setCategories_id(e.target.value)}
            />
          </div>

          <div className="input-group full-width">
            <label>Description</label>
            <textarea
              placeholder="Describe the eco-benefits..."
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Image URL</label>
            <input
              type="text"
              placeholder="https://..."
              onChange={(e) => setImgSrc(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Price ($)</label>
            <input
              type="number"
              placeholder="25.00"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Initial Rate (1-5)</label>
            <input
              type="number"
              placeholder="5"
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
        </div>

        <button className="add-btn" onClick={confirm}>
          Confirm & Publish
        </button>
      </div>
    </div>
  );
};
export default AddNewProduct;
