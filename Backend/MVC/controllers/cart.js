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

  pool
    .query(
      `INSERT INTO cart_products (cart, product, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart, product)
       DO UPDATE SET quantity = cart_products.quantity + EXCLUDED.quantity
       RETURNING *`,
      [cart_id, products_id, quantity]
    )
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Product added to cart",
        item: result.rows[0],
      });
    })
    .catch((err) => {
      console.error(err);
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
const getCartWithProducts = (req, res) => {
  const userId = req.token.user_id;

  pool
    .query(
      `
      SELECT
        cart.id AS cart_id,
        cart_products.id AS cart_product_id,
        cart_products.quantity,
        products.id AS product_id,
        products.title,
        products.price,
        products.imgsrc
      FROM cart
      JOIN cart_products ON cart.id = cart_products.cart
      JOIN products ON cart_products.product = products.id
      WHERE cart.users_id = $1
        AND cart.is_deleted = false
      `,
      [userId]
    )
    .then((result) => {
      res.status(200).json({
        success: true,
        items: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    });
};

const updatedQuantity = (req, res) => {
  const cartProductId = req.params.cartProductId;
  const { quantity } = req.body;
  const userId = req.token.user_id;

  if (quantity === 0) {
    const deleteQuery = `
      DELETE FROM cart_products
      USING cart
      WHERE cart_products.id = $1
        AND cart_products.cart = cart.id
        AND cart.users_id = $2
      RETURNING *;
    `;

    return pool
      .query(deleteQuery, [cartProductId, userId])
      .then((result) => {
        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Item not found",
          });
        }

        res.json({
          success: true,
          message: "Product removed from cart",
        });
      })
      .catch(() => {
        res.status(500).json({ success: false });
      });
  }

  const query = `
    UPDATE cart_products
    SET quantity = $1
    FROM cart
    WHERE cart_products.id = $2
      AND cart_products.cart = cart.id
      AND cart.users_id = $3
    RETURNING cart_products.*;
  `;

  pool
    .query(query, [quantity, cartProductId, userId])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Cart product not found",
        });
      }

      res.json({
        success: true,
        message: "Quantity updated",
        item: result.rows[0],
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    });
};

const checkoutPayment = async (req, res) => {
  const { cartId } = req.params;
  try {
    const result = await pool.query(`
      UPDATE cart
      SET is_deleted = true,
          done_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `, [cartId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json({ 
      success: true, 
      message: 'Payment completed successfully'
    });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {
  addToCart,
  getCartWereIsDeletedFalse,
  getCartWhereIsDeletedTure,
  getCartWithProducts,
  updatedQuantity,
  checkoutPayment,
};
