const express = require("express");
const usersRouter = express.Router();
const {
  register,
  login,
  getAllUser,
  updateUserInformation,
} = require("../controllers/users");
//===============
usersRouter.post("/register", register);
//===============
usersRouter.post("/login", login);
usersRouter.get("/", getAllUser);
usersRouter.put("/update/:id", updateUserInformation);
module.exports = usersRouter;
