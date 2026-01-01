const express = require("express");
const {
  addToCart,
  getCartWereIsDeletedFalse,
  getCartWhereIsDeletedTure,
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

//========================

module.exports = cartRouter;
