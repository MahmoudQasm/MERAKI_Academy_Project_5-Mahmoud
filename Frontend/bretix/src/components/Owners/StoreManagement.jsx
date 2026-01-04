import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./storeOwner.css";
const OwnerStoreManagement = () => {
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
  const [storeId, setStoreId] = useState(localStorage.getItem("storeId"));
  const [storeTitle, setStoreTitle] = useState(
    localStorage.getItem("storeTitle")
  );

  return (
    <div className="storeOwner">
      <div className="titlestore2">
        <h1 className="storeTitleH1">{storeTitle}</h1>
      </div>
      <div className="buttonstoreT">
        {" "}
        <button
          onClick={() => {
            navigate(`/${storeId}/allproducts`);
          }}
        >
          All Products
        </button>
        <button
          onClick={() => {
            navigate("/managerdashboard");
          }}
        >
          Manager Dashboard
        </button>
        <button
          onClick={() => {
            navigate(`${storeId}`);
          }}
        >
          Change Store Info
        </button>
      </div>
    </div>
  );
};
export default OwnerStoreManagement;
