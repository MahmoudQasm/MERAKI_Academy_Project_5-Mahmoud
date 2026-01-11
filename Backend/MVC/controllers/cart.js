const { pool } = require("../models/db");

const addToCart = async (req, res) => {
  const { products_id, quantity } = req.body;
  const userId = req.token.user_id;

  if (!products_id || !quantity) {
    return res.status(400).json({
      success: false,
      message: "Missing required information",
    });
  }

  try {
    let cartResult = await pool.query(
      `SELECT id FROM cart WHERE users_id = $1 AND is_deleted = false`,
      [userId]
    );

    let cartId;

    if (cartResult.rows.length === 0) {
      const newCart = await pool.query(
        `INSERT INTO cart (users_id) VALUES ($1) RETURNING id`,
        [userId]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartResult.rows[0].id;
    }

    const result = await pool.query(
      `INSERT INTO cart_products (cart, product, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart, product)
       DO UPDATE SET quantity = cart_products.quantity + EXCLUDED.quantity
       RETURNING *`,
      [cartId, products_id, quantity]
    );

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      item: result.rows[0],
      cartId: cartId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error adding product to cart",
    });
  }
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
  const userId = req.token.user_id;
  try {
    const result = await pool.query(
      `
      UPDATE cart
      SET is_deleted = true,
          done_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `,
      [cartId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }
    pool
      .query(`INSERT INTO  cart (users_id) VALUES ($1) RETURNING *`, [userId])
      .then((cartresult) => {
        res.json({
          success: true,
          message: "Payment completed successfully",
          newCartId: cartresult.rows[0].id,
        });
      })

      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTotalSales = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT quantity,price FROM cart
      INNER JOIN cart_products ON cart.id = cart_products.cart
      INNER JOIN products ON cart_products.product = products.id
      WHERE 
      cart.is_deleted = true 
      AND cart.done_at IS NOT NULL;
      `);

      const total = result.rows.reduce((sum,cart)=>{
        return sum + (cart.quantity*cart.price)
      },0)

      const numOfCarts = result.rows.length

      res.status(200).json({
        total:total,
        numOfCarts:numOfCarts
      })

  } catch (err) {
    console.log(err);
  }
};

const getCompletedOrders = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  
  const offset = (pageNumber - 1) * limit;

  try {
    let whereClause = `WHERE cart.is_deleted = true AND cart.done_at IS NOT NULL`;
    const queryParams = [limit, offset];
    let paramIndex = 3;

    if (startDate) {
      whereClause += ` AND cart.done_at >= $${paramIndex}`;
      queryParams.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      whereClause += ` AND cart.done_at <= $${paramIndex}`;
      queryParams.push(endDate);
    }

    const dataQuery = `
      SELECT 
        cart.id AS cart_id,
        cart.done_at,
        users.firstname || ' ' || users.lastname AS user_name,
        COUNT(cart_products.id) AS num_of_products,
        SUM(cart_products.quantity * products.price) AS total
      FROM cart
      INNER JOIN users ON cart.users_id = users.id
      INNER JOIN cart_products ON cart.id = cart_products.cart
      INNER JOIN products ON cart_products.product = products.id
      ${whereClause}
      GROUP BY cart.id, cart.done_at, users.firstname, users.lastname
      ORDER BY cart.done_at DESC
      LIMIT $1 OFFSET $2
    `;

    const dataResult = await pool.query(dataQuery, queryParams);

    const countQuery = `
      SELECT COUNT(DISTINCT cart.id) AS total
      FROM cart
      INNER JOIN cart_products ON cart.id = cart_products.cart
      ${whereClause}
    `;

    const countParams = queryParams.slice(2); 
    const countResult = await pool.query(countQuery, countParams);

    const totalOrders = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      success: true,
      data: dataResult.rows,
      pagination: {
        currentPage: pageNumber,
        totalPages: totalPages,
        totalOrders: totalOrders,
        limit: limit
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching completed orders"
    });
  }
};
module.exports = {
  addToCart,
  getCartWereIsDeletedFalse,
  getCartWhereIsDeletedTure,
  getCartWithProducts,
  updatedQuantity,
  checkoutPayment,
  getTotalSales,
  getCompletedOrders
};
