const express = require("express");
const usersRouter = express.Router();
const {
  register,
  login,
  getAllUser,
  updateUserInformation,
  requestForgotPassword,
  resetPassword,
} = require("../controllers/users");
//===============
usersRouter.post("/register", register);
//===============
usersRouter.post("/login", login);
usersRouter.post("/request-forgot-password", requestForgotPassword);
usersRouter.post("/reset-password", resetPassword);
usersRouter.get("/", getAllUser);
usersRouter.put("/update/:id", updateUserInformation);


module.exports = usersRouter;
