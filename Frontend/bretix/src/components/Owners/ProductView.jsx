import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductView.css";
import Swal from "sweetalert2";

const ProductView = () => {
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
  const { productId } = useParams();

  const [product, setProduct] = useState({});
  const [editedProduct, setEditedProduct] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getProduct = async () => {
      try {
        const result = await axios.get(
          `http://localhost:5000/products/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
    const token = localStorage.getItem("token");

    // 1. سؤال المستخدم عن التأكيد
    const result = await Swal.fire({
      title: "Save Changes?",
      text: "Are you sure you want to update this product?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1a3c34",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    });

    // 2. إذا كبس "Yes" نبدأ عملية التحميل
    if (result.isConfirmed) {
      // إظهار بوكس التحميل (Loading)
      Swal.fire({
        title: "Updating...",
        text: "Please wait while we save your changes.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading(); // تشغيل حركة الـ Spinner
        },
      });

      try {
        // إرسال الطلب للسيرفر
        await axios.put(
          `http://localhost:5000/products/${productId}/update`,
          {
            ...editedProduct,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProduct(editedProduct);

        // 3. إظهار بوكس النجاح وإغلاق الـ Loading تلقائياً
        Swal.fire({
          title: "Success!",
          text: "Product updated successfully.",
          icon: "success",
          confirmButtonColor: "#1a3c34",
          timer: 1500,
        });
      } catch (err) {
        console.log(err);
        // إظهار بوكس الخطأ في حال فشل الطلب
        Swal.fire({
          title: "Error!",
          text: "Could not update the product.",
          icon: "error",
          confirmButtonColor: "#1a3c34",
        });
      }
    }
  };

  const deleteProduct = async () => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1a3c34",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "my-swal-popup",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/products/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          await Swal.fire({
            title: "Deleted!",
            text: "Product has been removed.",
            icon: "success",
            confirmButtonColor: "#1a3c34",
          });

          navigate(`/${localStorage.getItem("storeId")}/allproducts`);
        } catch (err) {
          console.log(err);
          Swal.fire("Error!", "Something went wrong while deleting.", "error");
        }
      }
    });
  };
  return (
    <div className="product-view-container">
      <div className="edit-card">
        <div className="image-preview-section">
          <img
            src={editedProduct.imgsrc}
            alt={editedProduct.title}
            className="main-preview-img"
          />
          <div className="image-url-input">
            <label>Image URL</label>
            <input
              type="text"
              value={editedProduct.imgsrc || ""}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, imgsrc: e.target.value })
              }
            />
          </div>
        </div>

        <div className="details-edit-section">
          <h2 className="section-title">Edit Product Details</h2>

          <div className="input-field">
            <label>Product Title</label>
            <input
              type="text"
              value={editedProduct.title || ""}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, title: e.target.value })
              }
            />
          </div>

          <div className="input-row">
            <div className="input-field">
              <label>Category ID</label>
              <input
                type="text"
                value={editedProduct.categories_id || ""}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    categories_id: e.target.value,
                  })
                }
              />
            </div>
            <div className="input-field">
              <label>Price ($)</label>
              <input
                type="number"
                value={editedProduct.price || ""}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, price: e.target.value })
                }
              />
            </div>
          </div>

          <div className="input-field">
            <label>Description</label>
            <textarea
              value={editedProduct.description || ""}
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="action-buttons">
            {JSON.stringify(product) !== JSON.stringify(editedProduct) && (
              <button className="confirm-btn" onClick={confirm}>
                Save Changes
              </button>
            )}
            <button className="delete-btn" onClick={deleteProduct}>
              Delete Product
            </button>
            {JSON.stringify(product) === JSON.stringify(editedProduct) ? (
              <button
                className="delete-btn"
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancel
              </button>
            ) : (
              <button
                className="delete-btn"
                onClick={() => {
                  navigate(-1);
                }}
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductView;
