import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Orders() {
  const [is_deleted, setIs_deleted] = useState(false);
  const [token, setToken] = useState(null);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    axios
      .get(`http://localhost:5000/cart/getCartWhereIsDeletedTrue`, {
        headers: {
          Authorization: `barerr ${savedToken}`,
        },
      })
      .then((result) => {
        //setToken(result.data.token);
        setOrders(result.data.items);
        setIs_deleted(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      {orders.map((item, i) => {
        return (
          <div key={i}>
            <span>{item.items}</span>
          </div>
        );
      })}
    </div>
  );
}

export default Orders;
