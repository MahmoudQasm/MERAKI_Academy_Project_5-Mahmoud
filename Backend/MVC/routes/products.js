const express = require("express");
const router = express.Router();

const { addNewProducts, getProductById } = require("../controllers/products");

router.post("/", addNewProducts);
router.get("/:id", getProductById);

module.exports = router;
