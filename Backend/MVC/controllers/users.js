const nodemailer = require("nodemailer");
const { pool } = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    role_id,
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
          password,
          role_id
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
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
          role_id,
        ]
      );
    })
    .then((result) => {
      const user = result.rows[0];
      const userId = user.id;
      return pool
        .query(`INSERT INTO  cart (users_id) VALUES ($1) RETURNING *`, [userId])
        .then((cartresult) => {
          res.status(201).json({
            success: true,
            message: "User created successfully",
            cart: cartresult.rows[0],
            user: result.rows[0],
          });
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
//================login================
const login = (req, res) => {
  const { email, password } = req.body;
  pool.query(`SELECT * FROM users WHERE email=$1`, [email]).then((result) => {
    if (result.rows.length === 0) {
      res.status(403).json({
        success: false,
        massage:
          "The email doesn’t exist or the password you’ve entered is incorrect",
      });
    }
    const user = result.rows[0];
    bcrypt.compare(password, user.password).then((ismatch) => {
      if (!ismatch) {
        return res.status(403).json({
          success: false,
          massage:
            "The email doesn’t exist or the password you’ve entered is incorrect",
        });
      }
      const payload = {
        user_id: user.id,
        user_first: user.firstName,
        country: user.country,
        role: user.role_id,
      };
      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: "2h",
      });

      if (user.role_id === 2) {
        pool
          .query(`SELECT * FROM store WHERE owner_id = $1`, [user.id])
          .then((response) => {
            res.status(200).json({
              success: true,
              massage: "Valid login credentials",
              token: token,
              userId: user.id,
              role: user.role_id,
              storeId: response.rows[0].id,
              storeTitle: response.rows[0].title,
            });
          })
          .catch((err) => {
            res.status(500).json({
              success: false,
              massage: "Server Error",
              err: err.message,
            });
          });
      } else {
        res.status(200).json({
          success: true,
          massage: "Valid login credentials",
          token: token,
          userId: user.id,
          role: user.role_id,
        });
      }
    });
  });
};
//================ForgetPassword================
const requestForgotPassword = (req, res) => {
  const { email } = req.body;

  pool
    .query("SELECT * FROM users WHERE email=$1", [email])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Email not found",
        });
      }

      const token = jwt.sign({ email }, process.env.SECRET, {
        expiresIn: "15m",
      });

      const resetLink = `http://localhost:5173/reset-password?token=${token}`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      transporter.sendMail(
        {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Reset Password",
          html: `
          <h3>Reset your password</h3>
          <p>Click the link below:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>This link expires in 15 minutes</p>
        `,
        },
        (err, info) => {
          if (err) {
            console.log("Email sending error:", err);
            return res.status(500).json({
              success: false,
              message: "Failed to send email",
              error: err.message,
            });
          } else {
            console.log("Email sent:", info.response);
            return res.status(200).json({
              success: true,
              message: "Reset link sent to your email",
            });
          }
        }
      );
    })
    .catch((err) => {
      console.log("Server query error:", err);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    });
};
const resetPassword = (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Token and new password are required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    pool
      .query("UPDATE users SET password=$1 WHERE email=$2", [
        hashedPassword,
        decoded.email,
      ])
      .then(() => {
        res.status(200).json({
          success: true,
          message: "Password updated successfully ✅",
        });
      });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
//====================getall User============
const getAllUser = (req, res) => {
  pool
    .query(`SELECT * FROM users`)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "all users",
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "error  server",
      });
    });
};

//==============updateUserInformation===========
const updateUserInformation = (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    age,
    country,
    phoneNumber,
    date_of_birthday,
    email,
  } = req.body;
  pool
    .query(
      `UPDATE users SET firstName=$1,lastName=$2,age=$3,country=$4,phoneNumber=$5,date_of_birthday=$6,email=$7 WHERE id=$8 RETURNING *`,
      [
        firstName,
        lastName,
        age,
        country,
        phoneNumber,
        date_of_birthday,
        email,
        id,
      ]
    )
    .then((result) => {
      res.status(201).json({
        success: true,
        massage: "user information update Succsesfly",
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "error  server",
      });
    });
};
module.exports = { register, login, getAllUser, updateUserInformation };
