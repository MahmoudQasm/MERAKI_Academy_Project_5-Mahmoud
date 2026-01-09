const express = require("express");
const {
  addNewStore,
  getStoreById,
  updateStoreById,
  deleteStoreById,
  getAllStores,
  getProductsInStore,
  addNewProductInStore,
  getAllDoneOrdersForStoreById,
  getStoreStatistic,
  getRevenueChart,
  getOrders,
  getOrderDetails,
} = require("../controllers/stores");

const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const storesRouter = express.Router();

//====================================================================================
storesRouter.get("/all", getAllStores);
storesRouter.get("/:id", getStoreById);
storesRouter.get("/:id/products", getProductsInStore); 

//====================================================================================
storesRouter.post("/addnewstore", authentication, addNewStore);
storesRouter.get("/order-details/:order_id", authentication, getOrderDetails);

//====================================================================================
storesRouter.post(
  "/addnewproductinstore",
  authentication,
  authorization(2),
  addNewProductInStore
);
storesRouter.get(
  "/:id/productsinstore",
  authentication,
  authorization(2),
  getProductsInStore
);
storesRouter.get(
  "/:id/statistic",
  authentication,
  authorization(2),
  getStoreStatistic
);
storesRouter.get(
  "/:id/last-seven-days-chart",
  authentication,
  authorization(2),
  getRevenueChart
);
storesRouter.get("/:id/orders", authentication, authorization(2), getOrders);
storesRouter.get(
  "/:id/total-sales",
  authentication,
  authorization(2),
  getAllDoneOrdersForStoreById
);
storesRouter.put(
  "/:id/update",
  authentication,
  authorization(2),
  updateStoreById
);
storesRouter.delete("/:id", authentication, authorization(2), deleteStoreById);

//====================================================================================

module.exports = storesRouter;