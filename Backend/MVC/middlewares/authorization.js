const authorization = (text) => {
  return (req, res, next) => {
    const permission = req.token.permissions;
    if (!permission.includes(text)) {
      res.status(401).json("Unauthorized to do that");
    } else {
      next();
    }
  };
};

module.exports = authorization;
