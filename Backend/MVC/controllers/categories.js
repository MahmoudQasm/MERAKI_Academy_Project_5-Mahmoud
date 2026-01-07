const { pool } = require("../models/db");

pool;
const addNewCategory = async (req, res) => {
  const { name, description, imgsrc } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO categories (name,description,imgsrc) VALUES ($1,$2,$3) RETURNING *`,
      [name, description, imgsrc]
    );
    res.status(201).json({
      success: true,
      result: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      result: "Server error",
    });
  }
};

const getAllCategories = (req, res) => {
  const query = `SELECT * FROM categories`;

  pool
    .query(query)
    .then((result) => {
      res.status(200).json({
        success: true,
        categories: result.rows,
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

const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
            SELECT name,imgsrc , description FROM categories WHERE id = $1 RETURNING *`,
      [id]
    );
    res.status(200).json({
      success: true,
      result: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateCategoryById = async (req, res) => {
  const { id } = req.params;
  const { name, description, imgsrc } = req.body;
  try {
    const result = await pool.query(
      `     UPDATE categories 
            SET name = $1, description=$2, imgsrc = $3 
            WHERE id = $4
            RETURNING *`,
      [name, description, imgsrc, id]
    );
    res.status(200).json({
      success: true,
      result: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const deleteCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      DELETE FROM categories WHERE id=$1`,
      [id]
    );
    res.status(200).json({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  addNewCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getAllCategories,
};
