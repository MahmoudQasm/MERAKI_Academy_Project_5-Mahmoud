const express = require("express");
console.log("=== CART ROUTES LOADED ===");
const {
  addToCart,
  getCartWereIsDeletedFalse,
  getCartWhereIsDeletedTure,
  getCartWithProducts,
  updatedQuantity,
  checkoutPayment,
  getTotalSales,
  getCompletedOrders,
  getUserOrders
} = require("../controllers/cart");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization")
const cartRouter = express.Router();

//========================
cartRouter.get("/allcompleted", authentication, authorization(1), getCompletedOrders)
cartRouter.post("/", authentication, addToCart);
cartRouter.get(
  "/getCartWhereIsDeletedFalse",
  authentication,
  getCartWereIsDeletedFalse
);
cartRouter.get(
  "/getCartWhereIsDeletedTure",
  authentication,
  getCartWhereIsDeletedTure
);
cartRouter.get("/totalsales",authentication, authorization(1), getTotalSales)
cartRouter.get("/with-products", authentication, getCartWithProducts);
cartRouter.patch("/:cartProductId", authentication, updatedQuantity);
cartRouter.put("/complete/:cartId",authentication, checkoutPayment)
cartRouter.get("/my-orders", authentication, getUserOrders);
//========================

module.exports = cartRouter;
