const express = require("express");
const usersRouter = express.Router();
const { register } = require("../controllers/users");
//===============
usersRouter.post("/register", register);
//===============

module.exports = usersRouter;
