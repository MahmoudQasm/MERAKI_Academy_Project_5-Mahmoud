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
const updateCart = (req, res) => {
  const { cart_id, products_id } = req.body;

  const query = `
    UPDATE cart
    SET products_id = $1
    WHERE id = $2
    RETURNING *;
  `;

  pool
    .query(query, [products_id, cart_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Cart item not found",
        });
      }

      res.json({
        success: true,
        message: "Cart item updated",
        cartItem: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    });
};

const deleteFromCart = (req, res) => {
  const { cart_id } = req.params;

  const query = `
    DELETE FROM cart
    WHERE id = $1
    RETURNING *;
  `;

  pool
    .query(query, [cart_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      res.json({
        success: true,
        message: "Item deleted from cart",
        deletedItem: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    });
};
const checkout = (req, res) => {
  const { users_id } = req.body;

  const query = `
    UPDATE cart
    SET is_deleted = true
    WHERE users_id = $1 AND is_deleted = false
    RETURNING *;
  `;

  pool
    .query(query, [users_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty",
        });
      }

      res.json({
        success: true,
        message: "Checkout completed",
        items: result.rows,
      });
    })
    .catch((err) => res.status(500).json({ success: false, err: err.message }));
};

module.exports = {
  addToCart,
  updateCart,
  deleteFromCart,
  checkout,
};
