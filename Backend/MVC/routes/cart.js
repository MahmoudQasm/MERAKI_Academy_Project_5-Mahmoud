const express = require("express");
const {
  addToCart,
  getCartWereIsDeletedFalse,
  getCartWhereIsDeletedTure,
  getCartWithProducts,
  updatedQuantity,
  checkoutPayment,
} = require("../controllers/cart");
const authentication = require("../middlewares/authentication");
const cartRouter = express.Router();

//========================
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
cartRouter.get("/with-products", authentication, getCartWithProducts);
cartRouter.patch("/:cartProductId", authentication, updatedQuantity);
cartRouter.put("/complete/:cartId",authentication, checkoutPayment)
//========================

module.exports = cartRouter;
