import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./storeOwner.css";
const OwnerStoreManagement = () => {
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
        <button onClick={()=>{navigate("/managerdashboard")}}>Manager Dashboard</button>
        <button onClick={()=>{navigate(`${storeId}`)}}>Change Store Info</button>
      </div>
    </div>
  );
};
export default OwnerStoreManagement;
