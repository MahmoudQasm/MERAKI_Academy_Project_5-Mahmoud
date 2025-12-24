const { pool } = require("../models/db");


const addToCart = (req, res) => {
  const { products_id, users_id } = req.body;

  const query = `
    INSERT INTO cart (products_id, users_id)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const values = [products_id, users_id];

  pool
    .query(query, values)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Product added to cart successfully",
        cartItem: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};

module.exports = {
  addToCart,
};
