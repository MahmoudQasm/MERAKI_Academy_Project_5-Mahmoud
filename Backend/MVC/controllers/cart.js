const { pool } = require("../models/db");

const addToCart = (req, res) => {
  const { products_id, cart_id, quantity } = req.body;
  const userId = req.token.user_id;

  if (!products_id || !cart_id || !quantity) {
    return res.status(400).json({
      success: false,
      message: "Missing required information",
    });
  }

  if (quantity < 1 || quantity > 99) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be between 1 and 99",
    });
  }

  pool
    .query(
      `INSERT INTO cart_products (cart, product,
      quantity)
      VALUES ($1, $2,$3)
      RETURNING *`,
      [cart_id, products_id, quantity]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: "This cart doesn't belong to you",
        });
      }

      return pool.query(
        `INSERT INTO cart_products (cart, product, quantity)
         VALUES ($1, $2, $3)
         ON CONFLICT (cart, product) 
         DO UPDATE SET quantity = cart_products.quantity + $3
         RETURNING *`,
        [cart_id, products_id, quantity]
      );
    })
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Product added to cart",
        item: result.rows[0],
      });
    })
    .catch((err) => {
      console.error("Error adding to cart:", err);
      res.status(500).json({
        success: false,
        message: "Error adding product to cart",
      });
    });
};

const getCartWereIsDeletedFalse = (req, res) => {
 
  const userId = req.token.user_id;

  pool
    .query(
      `
      SELECT *
      FROM cart
      WHERE is_deleted = false
      AND users_id = $1
      `,
      [userId]
    )
    .then((result) => {
      res.json({
        success: true,
        items: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    });
};

const getCartWhereIsDeletedTure = (req, res) => {
  const userId = req.token.user_id;

  pool
    .query(
      `
      SELECT *
      FROM cart
      WHERE is_deleted = true
      AND users_id = $1
      `,
      [userId]
    )
    .then((result) => {
      res.json({
        success: true,
        items: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    });
};

module.exports = {
  addToCart,
  getCartWereIsDeletedFalse,
  getCartWhereIsDeletedTure,
};
