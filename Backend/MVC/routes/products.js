const express = require("express");
const productsRouter = express.Router();

const { addNewProducts, getProductById, updateProductById, deleteProductById } = require("../controllers/products");

productsRouter.post("/", addNewProducts);
productsRouter.get("/:id", getProductById);
productsRouter.put("/:id/update", updateProductById)
productsRouter.delete("/:id",deleteProductById)


module.exports = productsRouter;
