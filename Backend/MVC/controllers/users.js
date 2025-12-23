const { pool } = require("../models/db");
const bcrypt = require("bcrypt");

//====================== REGISTER =====================
const register = (req, res) => {
  const {
    firstName,
    lastName,
    age,
    country,
    phoneNumber,
    date_of_birthday,
    email,
    password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return pool.query(
        `INSERT INTO users (
          firstName,
          lastName,
          age,
          country,
          phoneNumber,
          date_of_birthday,
          email,
          password
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *`,
        [
          firstName,
          lastName,
          age,
          country,
          phoneNumber,
          date_of_birthday,
          email,
          hashedPassword,
        ]
      );
    })
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: result.rows[0],
      });
    })
    .catch((err) => {
      if (err.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "The email already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    });
};

module.exports = { register };
