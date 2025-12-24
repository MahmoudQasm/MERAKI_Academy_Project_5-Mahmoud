const { pool } = require("../models/db");

const addNewProducts = (req, res) => {
  const { imgsrc, title, description, price, rate, categories_id } = req.body;

  const query = `
    INSERT INTO products (imgsrc, title, description, price, rate, categories_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [imgsrc, title, description, price, rate, categories_id];

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
      console.log(err);

      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};

const getProductById = (req, res) => {
  const productId = req.params.id;

  const query = `SELECT * FROM products WHERE id = $1`;

  pool
    .query(query, [productId])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
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

const updateProductById = async (req, res) => {
  const { id } = req.params;
  const { imgsrc, title, description, price, rate, categories_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products 
            SET title = $1, description=$2, imgsrc = $3 , price = $4, rate = $5, categories_id = $6
            WHERE id = $7
            RETURNING *`,
      [imgsrc, title, description, price, rate, categories_id, id]
    );
    res.status(200).json({
      success: true,
      message: "Updating Done Successfully",
      result: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

const deleteProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`DELETE FROM products WHERE id=$1`, [id]);
    res.status(200).json({
      success: true,
      message: "product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};
module.exports = {
  addNewProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
