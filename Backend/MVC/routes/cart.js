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
cartRouter.put("/update", updateCart);
cartRouter.delete("/delete", deleteFromCart);
cartRouter.put("/checkout");
//========================

module.exports = cartRouter;
