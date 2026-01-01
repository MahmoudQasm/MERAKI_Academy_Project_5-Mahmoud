const { pool } = require("../models/db");

const updateCart = (req, res) => {
  const { id } = req.params;
  const userId = req.token.user_id;

  pool
    .query(
      `
      UPDATE cart
      SET is_deleted = true
      WHERE id = $1
      RETURNING *
      `,
      [id]
    )
    .then(() => {
      return pool.query(
        `
        INSERT INTO cart (users_id)
        VALUES ($1)
        RETURNING *
        `,
        [userId]
      );
    })
    .then((result) => {
      res.json({
        success: true,
        message: "cart updated and new cart row inserted",
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

const getDeletedCart = (req, res) => {
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
  updateCart,
  getDeletedCart,
};
