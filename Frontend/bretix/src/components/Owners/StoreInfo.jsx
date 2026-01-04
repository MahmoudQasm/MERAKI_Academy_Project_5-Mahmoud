import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "./StoreInfo.css";

const StoreInfo = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/Login");
    } else if (parseInt(role) !== 2) {
      navigate("/");
    }
  }, []);

  const { storeId } = useParams();
  const [storeInfo, setStoreInfo] = useState({});
  const [storeInfoEdition, setStoreInfoEdition] = useState({});

  useEffect(() => {
    const getStoreInfo = async () => {
      try {
        const result = await axios.get(
          `http://localhost:5000/stores/${storeId}`
        );
        const data = result.data.result[0];
        setStoreInfo(data);
        setStoreInfoEdition(data);
      } catch (err) {
        console.error("Error fetching store info", err);
      }
    };
    getStoreInfo();
  }, [storeId]);

  const handleUpdate = async () => {
    const result = await Swal.fire({
      title: "Save Changes?",
      text: "Are you sure you want to update store information?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1a3c34", // Bretix Green
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Updating...",
        text: "Please wait while we save your data",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        await axios.put(`http://localhost:5000/stores/${id}`, storeInfoEdition);
        setStoreInfo(storeInfoEdition);
        Swal.fire({
          title: "Updated!",
          text: "Store information has been saved successfully.",
          icon: "success",
          confirmButtonColor: "#1a3c34",
          timer: 2000,
        });
      } catch (err) {
        Swal.fire("Error", "Failed to update information", "error");
      }
    }
  };

  const handleCancel = () => {
    setStoreInfoEdition(storeInfo);
  };

  return (
    <div className="store-info-page">
      <div className="store-card">
        <div className="store-header">
          <div className="logo-preview">
            <img src={storeInfoEdition.logo} alt="Store Logo" />
          </div>
          <div className="header-titles">
            <h2>Store Identity</h2>
            <p>Customize your brand appearance and details</p>
          </div>
        </div>

        <div className="store-form">
          <div className="form-grid">
            <div className="input-field">
              <label>Store Title</label>
              <input
                type="text"
                value={storeInfoEdition.title || ""}
                onChange={(e) =>
                  setStoreInfoEdition({
                    ...storeInfoEdition,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-field">
              <label>Logo URL</label>
              <input
                type="text"
                value={storeInfoEdition.logo || ""}
                onChange={(e) =>
                  setStoreInfoEdition({
                    ...storeInfoEdition,
                    logo: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-field full-row">
              <label>Description</label>
              <textarea
                rows="4"
                value={storeInfoEdition.description || ""}
                onChange={(e) =>
                  setStoreInfoEdition({
                    ...storeInfoEdition,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="form-actions">
            {JSON.stringify(storeInfo) !== JSON.stringify(storeInfoEdition) && (
              <button className="confirm-btn" onClick={handleUpdate}>
                Confirm Edition
              </button>
            )}
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreInfo;
