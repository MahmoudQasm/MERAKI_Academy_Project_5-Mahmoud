import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/products/${id}`)
      .then((res) => {
        setProduct(res.data.product);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-details">
      <img src={product.imgsrc} alt={product.title} width="300" />

      <h2>{product.title}</h2>
      <p>{product.description}</p>

      <h4>Price: ${product.price}</h4>
      <p>Rate: ⭐ {product.rate}</p>

      <button>Add to cart</button>
    </div>
  );
};

export default ProductDetails;