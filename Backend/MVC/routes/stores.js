const express = require("express");
const {
  addNewStore,
  getStoreById,
  updateStoreById,
  deleteStoreById,
  getAllStores,
  getProductsInStore,
  addNewProductInStore,
} = require("../controllers/stores");
const storesRouter = express.Router();

//===============

storesRouter.get("/all",getAllStores)
storesRouter.get("/:id/productsinstore", getProductsInStore)
storesRouter.post("/addnewstore", addNewStore);
storesRouter.post("/addnewproductinstore", addNewProductInStore)
storesRouter.get("/:id", getStoreById);
storesRouter.put("/:id/update", updateStoreById);
storesRouter.delete("/:id", deleteStoreById);
//===============

module.exports = storesRouter;
