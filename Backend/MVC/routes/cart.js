const express = require("express");
const { addToCart } = require("../controllers/cart");
const cartRouter = express.Router();

//========================
cartRouter.post("/", addToCart);
//========================

module.exports = cartRouter;
