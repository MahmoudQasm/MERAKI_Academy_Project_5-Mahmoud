const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
        ],
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
        message:
          "The email doesn’t exist or the password you’ve entered is incorrect",
      });
    }
    const user = result.rows[0];
    bcrypt.compare(password, user.password).then((ismatch) => {
      if (!ismatch) {
        return res.status(403).json({
          success: false,
          message:
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
              message: "Valid login credentials",
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
              message: "Server Error",
              err: err.message,
            });
          });
      } else {
        res.status(200).json({
          success: true,
          message: "Valid login credentials",
          token: token,
          userId: user.id,
          role: user.role_id,
        });
      }
    });
  });
};
//================ForgetPassword================
const requestForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: "15m" });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const msg = {
      to: email,
      from: "mah.alshiekhq@gmail.com",
      subject: "Reset Password - Bretix",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Reset Your Password</h2>
          <p>You requested to reset your password. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">This link expires in 15 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await sgMail.send(msg);

    return res.status(200).json({
      success: true,
      message: "Reset link sent to your email",
    });
  } catch (err) {
    console.error("STATUS:", err.code);
    console.error("BODY:", JSON.stringify(err.response?.body, null, 2));
    console.error("FULL ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server internal error",
      error: err.message,
    });
  }
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
//=============profileusers===========
const getMyProfile = (req, res) => {
  const userId = req.token.user_id;

  pool
    .query(
      `SELECT 
        id,
        firstname,
        lastname,
        age,
        country,
        phonenumber,
        date_of_birthday,
        email
      FROM users
      WHERE id=$1 AND is_deleted=false`,
      [userId],
    )
    .then((result) => {
      res.status(200).json({
        success: true,
        user: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    });
};

//================updateProfileUsers=========
const updateMyProfile = (req, res) => {
  const userId = req.token.user_id;
  const { firstname, lastname, age, country, phonenumber, date_of_birthday } =
    req.body;

  pool
    .query(
      `UPDATE users SET
        firstname=$1,
        lastname=$2,
        age=$3,
        country=$4,
        phonenumber=$5,
        date_of_birthday=$6
      WHERE id=$7
      RETURNING *`,
      [
        firstname,
        lastname,
        age,
        country,
        phonenumber,
        date_of_birthday,
        userId,
      ],
    )
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: result.rows[0],
      });
    })
    .catch(() => {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    });
};

const requestEmailChange = async (req, res) => {
  try {
    const userId = req.token.user_id;
    const { newEmail } = req.body;

    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      return res.status(400).json({
        success: false,
        message: "A valid new email is required",
      });
    }

    const existingCodeResult = await pool.query(
      `SELECT email_verification_code 
       FROM users 
       WHERE id=$1`,
      [userId],
    );

    const existingCode = existingCodeResult.rows[0]?.email_verification_code;

    if (existingCode) {
      return res.json({
        success: true,
        message: "Verification code already sent",
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const updateResult = await pool.query(
      `UPDATE users 
       SET pending_email=$1, email_verification_code=$2 
       WHERE id=$3`,
      [newEmail, code, userId],
    );

    // SendGrid Email
    const msg = {
      to: newEmail,
      from: "mah.alshiekhq@gmail.com",
      subject: "Email Verification - Bretix",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Verify Your Email</h2>
          <p>Enter this code to verify your new email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #10b981;">
              ${code}
            </div>
          </div>
          <p style="color: #666; font-size: 14px;">This code expires in 15 minutes.</p>
        </div>
      `,
    };

    await sgMail.send(msg);

    res.json({
      success: true,
      message: "Verification code sent to new email",
    });
  } catch (error) {
    console.log("Email error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const verifyEmailChange = async (req, res) => {
  try {
    const userId = req.token?.user_id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const code = String(req.body.code || "").replace(/\s/g, "");

    const result = await pool.query(
      `SELECT pending_email, email_verification_code FROM users WHERE id=$1`,
      [userId],
    );

    if (!result.rows.length) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const user = result.rows[0];
    const dbCode = String(user.email_verification_code || "").replace(
      /\s/g,
      "",
    );

    console.log("DB Code:", dbCode, "User Input:", code);

    if (parseInt(dbCode) !== parseInt(code)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
    }

    await pool.query(
      `UPDATE users 
       SET email=pending_email,
           pending_email=NULL,
           email_verification_code=NULL
       WHERE id=$1`,
      [userId],
    );

    res.json({ success: true, message: "Email updated successfully" });
  } catch (error) {
    console.error("verifyEmailChange error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const changePassword = (req, res) => {
  const userId = req.token.user_id;
  const { currentPassword, newPassword } = req.body;

  pool.query(`SELECT * FROM users WHERE id=$1`, [userId]).then((result) => {
    const user = result.rows[0];

    bcrypt.compare(currentPassword, user.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(403).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      pool
        .query(`UPDATE users SET password=$1 WHERE id=$2`, [
          hashedPassword,
          userId,
        ])
        .then(() => {
          res.status(200).json({
            success: true,
            message: "Password updated successfully ✅",
          });
        });
    });
  });
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
      `UPDATE users SET 
        firstname=$1,
        lastname=$2,
        age=$3,
        country=$4,
        phonenumber=$5,
        date_of_birthday=$6,
        email=$7 
      WHERE id=$8 
      RETURNING *`,
      [
        firstName,
        lastName,
        age,
        country,
        phoneNumber,
        date_of_birthday,
        email,
        id,
      ],
    )
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "user information updated successfully",
        result: result.rows,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "server error",
      });
    });
};

const updateUserInformationAdmin = (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, country } = req.body;

  pool
    .query(
      `UPDATE users SET 
        firstname=$1,
        lastname=$2,
        country=$3
      WHERE id=$4 
      RETURNING *`,
      [firstname, lastname, country, id],
    )
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "user information updated successfully",
        result: result.rows,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "server error",
      });
    });
};
module.exports = {
  register,
  login,
  getAllUser,
  updateUserInformation,
  requestForgotPassword,
  resetPassword,
  getMyProfile,
  updateMyProfile,
  changePassword,
  requestEmailChange,
  verifyEmailChange,
  updateUserInformationAdmin,
};
