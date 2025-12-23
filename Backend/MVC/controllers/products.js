const {pool} = require("../models/db")

const addNewProducts = (req, res) => {
  const { imgsrc, title, description, price, rate, cataegres_id } = req.body;

  const query = `
    INSERT INTO products (imgsrc, title, description, price, rate, cataegres_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [imgsrc, title, description, price, rate, cataegres_id];

  pool
    .query(query, values)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Product added successfully",
        product: result.rows[0],
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
  addNewProducts,
};
