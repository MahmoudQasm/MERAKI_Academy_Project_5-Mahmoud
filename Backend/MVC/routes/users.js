const express = require("express");
const usersRouter = express.Router();
const {
  register,
  login,
  getAllUser,
  updateUserInformation,
  requestForgotPassword,
  resetPassword,
  getMyProfile,
  updateMyProfile,
} = require("../controllers/users");

const authentication = require("../middlewares/authentication");
//===============
usersRouter.post("/register", register);
//===============
usersRouter.post("/login", login);
usersRouter.get("/profile", authentication, getMyProfile);
usersRouter.put("/profile", authentication, updateMyProfile);

usersRouter.post("/request-forgot-password", requestForgotPassword);
usersRouter.post("/reset-password", resetPassword);
usersRouter.get("/", getAllUser);
usersRouter.put("/update/:id", updateUserInformation);

module.exports = usersRouter;
