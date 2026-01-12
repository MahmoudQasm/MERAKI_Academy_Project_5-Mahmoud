const { pool } = require("../models/db");

const addToFavourites = async (req, res) => {
  const { store_id } = req.body;
  const user_id = req.token.user_id;

  if (!store_id) {
    return res.status(400).json({
      success: false,
      message: "Store ID is required",
    });
  }

  try {
    const existing = await pool.query(
      `SELECT * FROM favourites WHERE user_id = $1 AND store_id = $2`,
      [user_id, store_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Store already in favourites",
      });
    }

    const result = await pool.query(
      `INSERT INTO favourites (user_id, store_id) 
       VALUES ($1, $2) 
       RETURNING *`,
      [user_id, store_id]
    );

    res.status(201).json({
      success: true,
      message: "Store added to favourites",
      favourite: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error adding to favourites",
    });
  }
};

const removeFromFavourites = async (req, res) => {
  const { store_id } = req.params;
  const user_id = req.token.user_id;

  try {
    const result = await pool.query(
      `DELETE FROM favourites 
       WHERE user_id = $1 AND store_id = $2 
       RETURNING *`,
      [user_id, store_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Favourite not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Store removed from favourites",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error removing from favourites",
    });
  }
};

const getUserFavourites = async (req, res) => {
  const user_id = req.token.user_id;

  try {
    const result = await pool.query(
      `SELECT 
        s.id,
        s.title,
        s.description,
        s.logo,
        s.owner_id,
        f.created_at as favourited_at
       FROM store s
       INNER JOIN favourites f ON s.id = f.store_id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [user_id]
    );

    res.status(200).json({
      success: true,
      favourites: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching favourites",
    });
  }
};

const checkFavourite = async (req, res) => {
  const { store_id } = req.params;
  const user_id = req.token.user_id;

  try {
    const result = await pool.query(
      `SELECT * FROM favourites WHERE user_id = $1 AND store_id = $2`,
      [user_id, store_id]
    );

    res.status(200).json({
      success: true,
      isFavourite: result.rows.length > 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error checking favourite",
    });
  }
};

module.exports = {
  addToFavourites,
  removeFromFavourites,
  getUserFavourites,
  checkFavourite,
};