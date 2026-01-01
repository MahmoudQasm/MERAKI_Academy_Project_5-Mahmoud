import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const StoreInfo = () => {
  const { id } = useParams();
  const [storeInfo,setStoreInfo] = useState({})
  const [storeInfoEdition,setStoreInfoEdition] = useState({})

  useEffect(()=>{
    const getStoreInfo = async ()=>{
        const result = await axios.get(`http://localhost:5000/stores/${id}`)
        console.log(result.data.result[0]);
        
        setStoreInfo(result.data.result[0])
        setStoreInfoEdition(result.data.result[0])
    }
    getStoreInfo()
  },[])

  return (<div>
    <img src={storeInfoEdition.logo} alt={storeInfoEdition.title} /><br />
    Title<input type="text" value={storeInfoEdition.title} onChange={(e)=>{setStoreInfoEdition({...storeInfoEdition,title:e.target.value})}} /> <br />
    Logo URL<input type="text" value={storeInfoEdition.logo} onChange={(e)=>{setStoreInfoEdition({...storeInfoEdition,logo:e.target.value})}} /> <br />
    Description <input type="text" value={storeInfoEdition.description} onChange={(e)=>{setStoreInfoEdition({...storeInfoEdition,description:e.target.value})}} />
    {JSON.stringify(storeInfo) !== JSON.stringify(storeInfoEdition) && <button>Confirm Edition</button>} <button>Cancel</button>

  </div>)
};
export default StoreInfo;
