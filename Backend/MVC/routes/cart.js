const express = require("express");
const {
  addToCart,
  updateCart,
  deleteFromCart,
} = require("../controllers/cart");
const cartRouter = express.Router();

//========================
cartRouter.post("/", addToCart);
cartRouter.put("/update", updateCart);
cartRouter.delete("/delete", deleteFromCart);

//========================

module.exports = cartRouter;
