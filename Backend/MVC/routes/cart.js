const express = require("express");
const {
  addToCart,
  updateCart,
  deleteFromCart,
  checkout,
} = require("../controllers/cart");
const cartRouter = express.Router();

//========================
cartRouter.post("/", addToCart);

cartRouter.put("/:cart_id", updateCart);

cartRouter.delete("/:cart_id", deleteFromCart);

cartRouter.post("/checkout", checkout);

//========================

module.exports = cartRouter;
