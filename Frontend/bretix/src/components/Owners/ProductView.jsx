import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  }, []);

  const confirm = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/products/${productId}/update`,
        {
          ...editedProduct,
        }
      );
      setProduct(editedProduct);
      navigate(`/allproducts/${productId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      navigate(`/${localStorage.getItem("storeId")}/allproducts`)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <img src={editedProduct.imgsrc} alt={editedProduct.title} />
      <br />
      Image URL{" "}
      <input
        type="text"
        value={editedProduct.imgsrc}
        onChange={(e) => {
          setEditedProduct({ ...editedProduct, imgsrc: e.target.value });
        }}
      />
      <br />
      Title{" "}
      <input
        type="text"
        value={editedProduct.title}
        onChange={(e) => {
          setEditedProduct({ ...editedProduct, title: e.target.value });
        }}
      />
      Category{" "}
      <input
        type="text"
        value={editedProduct.categories_id}
        onChange={(e) => {
          setEditedProduct({ ...editedProduct, categories_id: e.target.value });
        }}
      />{" "}
      <br />
      Description{" "}
      <input
        type="text"
        value={editedProduct.description}
        onChange={(e) => {
          setEditedProduct({ ...editedProduct, description: e.target.value });
        }}
      />{" "}
      <br />
      Price{" "}
      <input
        type="text"
        value={editedProduct.price}
        onChange={(e) => {
          setEditedProduct({ ...editedProduct, price: e.target.value });
        }}
      />{" "}
      <br />
      {/* ---------------------------------------------------------------------------------- */}
      <br />
      {JSON.stringify(product) !== JSON.stringify(editedProduct) && (
        <button onClick={confirm}>Edit</button>
      )}{" "}
      <button onClick={deleteProduct}>Delete</button>
    </div>
  );
};
export default ProductView;
