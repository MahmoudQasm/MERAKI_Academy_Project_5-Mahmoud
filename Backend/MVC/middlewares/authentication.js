const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  } else {
    try {
      const token = req.headers.authorization.split(" ").pop();
      const verifiedToken = await jwt.verify(token, process.env.SECRET);
      req.token = verifiedToken;
      next();
    } catch (err) {
      res.status(403).json({
        success: false,
        message: "The token is invalid or expired",
      });
    }
  }
};

module.exports = authentication;
