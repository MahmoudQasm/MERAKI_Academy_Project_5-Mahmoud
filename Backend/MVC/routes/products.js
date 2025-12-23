const express = require("express");
const router = express.Router();

const { addNewProducts } = require("../controllers/products");

router.post("/", addNewProducts);

module.exports = router;
