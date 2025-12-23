const express = require("express");
const router = express.Router();

const {
  addNewProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} = require("../controllers/products");

router.post("/", addNewProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProductById);
router.delete("/:id",deleteProductById)

module.exports = router;
