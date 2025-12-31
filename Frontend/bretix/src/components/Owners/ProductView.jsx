import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductView.css"; // استدعاء ملف التنسيق

const ProductView = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [product, setProduct] = useState({});
  const [editedProduct, setEditedProduct] = useState({});

  useEffect(() => {
    const getProduct = async () => {
      try {
        const result = await axios.get(
          `http://localhost:5000/products/${productId}`
        );
        setProduct(result.data.product);
        setEditedProduct(result.data.product);
      } catch (err) {
        console.log(err);
      }
    };
    getProduct();
  }, [productId]);

  const confirm = async () => {
    try {
      await axios.put(
        `http://localhost:5000/products/${productId}/update`,
        { ...editedProduct }
      );
      setProduct(editedProduct);
      alert("Product updated successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/products/${productId}`);
        navigate(`/${localStorage.getItem("storeId")}/allproducts`);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="product-view-container">
      <div className="edit-card">
        {/* قسم الصورة المعاينة */}
        <div className="image-preview-section">
          <img src={editedProduct.imgsrc} alt={editedProduct.title} className="main-preview-img" />
          <div className="image-url-input">
            <label>Image URL</label>
            <input
              type="text"
              value={editedProduct.imgsrc || ""}
              onChange={(e) => setEditedProduct({ ...editedProduct, imgsrc: e.target.value })}
            />
          </div>
        </div>

        {/* قسم بيانات المنتج */}
        <div className="details-edit-section">
          <h2 className="section-title">Edit Product Details</h2>
          
          <div className="input-field">
            <label>Product Title</label>
            <input
              type="text"
              value={editedProduct.title || ""}
              onChange={(e) => setEditedProduct({ ...editedProduct, title: e.target.value })}
            />
          </div>

          <div className="input-row">
            <div className="input-field">
              <label>Category ID</label>
              <input
                type="text"
                value={editedProduct.categories_id || ""}
                onChange={(e) => setEditedProduct({ ...editedProduct, categories_id: e.target.value })}
              />
            </div>
            <div className="input-field">
              <label>Price ($)</label>
              <input
                type="number"
                value={editedProduct.price || ""}
                onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
              />
            </div>
          </div>

          <div className="input-field">
            <label>Description</label>
            <textarea
              value={editedProduct.description || ""}
              onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
            />
          </div>

          <div className="action-buttons">
            {JSON.stringify(product) !== JSON.stringify(editedProduct) && (
              <button className="confirm-btn" onClick={confirm}>Save Changes</button>
            )}
            <button className="delete-btn" onClick={deleteProduct}>Delete Product</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductView;
