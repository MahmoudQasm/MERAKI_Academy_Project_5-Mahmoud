import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Stores = () => {
    const navigate = useNavigate()
  const [stores, setStores] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/stores/all")
      .then((res) => {
        setStores(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const showStores = 
    stores.map((store)=>{
        return <div key={store.id}>
            <img src={store.logo} alt={store.title} onClick={()=>{navigate(`/stores/${store.id}`)}} /><br />
            <h3>{store.title}</h3>
            <p>{store.description}</p>
        </div>
    })
  

  return (<div>{showStores}</div>)
};
export default Stores;
