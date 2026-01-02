import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";


const StoreInfo = () => {
  const navigate = useNavigate()
  const { storeId } = useParams();
  const [storeInfo,setStoreInfo] = useState({})
  const [storeInfoEdition,setStoreInfoEdition] = useState({})

  useEffect(()=>{
    const getStoreInfo = async ()=>{
        const result = await axios.get(`http://localhost:5000/stores/${storeId}`)        
        setStoreInfo(result.data.result[0])
        setStoreInfoEdition(result.data.result[0])
    }
    getStoreInfo()
  },[])
  
  const confirm = async () => {
  const result = await Swal.fire({
    title: "Save Changes?",
    text: "Are you sure you want to update info?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#1a3c34",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Update",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    Swal.fire({
      title: "Updating...",
      text: "Please wait while we save your changes.",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(); 
      },
    });

    try {
      await axios.put(
        `http://localhost:5000/stores/${storeId}/update`,
        { ...storeInfoEdition }
      );
      
      setStoreInfo(storeInfoEdition);

      Swal.fire({
        title: "Success!",
        text: "Product updated successfully.",
        icon: "success",
        confirmButtonColor: "#1a3c34",
        timer: 1500
      });

    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Error!",
        text: "Could not update the product.",
        icon: "error",
        confirmButtonColor: "#1a3c34"
      });
    }
  }
};
    

  return (<div>
    <img src={storeInfoEdition.logo} alt={storeInfoEdition.title} /><br />
    Title<input type="text" value={storeInfoEdition.title} onChange={(e)=>{setStoreInfoEdition({...storeInfoEdition,title:e.target.value})}} /> <br />
    Logo URL<input type="text" value={storeInfoEdition.logo} onChange={(e)=>{setStoreInfoEdition({...storeInfoEdition,logo:e.target.value})}} /> <br />
    Description <input type="text" value={storeInfoEdition.description} onChange={(e)=>{setStoreInfoEdition({...storeInfoEdition,description:e.target.value})}} />
    {JSON.stringify(storeInfo) !== JSON.stringify(storeInfoEdition) && <button onClick={confirm}>Confirm Edition</button>} <button onClick={()=>{navigate(-1)}}>Cancel</button>

        <div className="store-form">
          <div className="form-grid">
            <div className="input-field">
              <label>Store Title</label>
              <input 
                type="text" 
                value={storeInfoEdition.title || ""} 
                onChange={(e) => setStoreInfoEdition({...storeInfoEdition, title: e.target.value})} 
              />
            </div>

            <div className="input-field">
              <label>Logo URL</label>
              <input 
                type="text" 
                value={storeInfoEdition.logo || ""} 
                onChange={(e) => setStoreInfoEdition({...storeInfoEdition, logo: e.target.value})} 
              />
            </div>

            <div className="input-field full-row">
              <label>Description</label>
              <textarea 
                rows="4"
                value={storeInfoEdition.description || ""} 
                onChange={(e) => setStoreInfoEdition({...storeInfoEdition, description: e.target.value})} 
              />
            </div>
          </div>

          <div className="form-actions">
            {JSON.stringify(storeInfo) !== JSON.stringify(storeInfoEdition) && (
              <button className="confirm-btn" onClick={handleUpdate}>Confirm Edition</button>
            )}
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreInfo;