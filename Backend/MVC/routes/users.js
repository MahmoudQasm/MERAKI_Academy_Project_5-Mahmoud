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
  changePassword,
  requestEmailChange,
  updateUserInformationAdmin,
  verifyEmailChange,
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
usersRouter.put("/update/admin/:id", updateUserInformationAdmin);
usersRouter.put("/change-password", authentication, changePassword);
usersRouter.post("/request-email-change", authentication, requestEmailChange);
usersRouter.put("/verify-email-change", authentication, verifyEmailChange);

module.exports = usersRouter;
