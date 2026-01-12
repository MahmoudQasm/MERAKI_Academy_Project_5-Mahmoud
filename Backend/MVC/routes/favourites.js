const express = require("express");
const {
  addToFavourites,
  removeFromFavourites,
  getUserFavourites,
  checkFavourite,
} = require("../controllers/favourites");

const authentication = require("../middlewares/authentication");
const favouritesRouter = express.Router();

favouritesRouter.post("/", authentication, addToFavourites);
favouritesRouter.delete("/:store_id", authentication, removeFromFavourites);
favouritesRouter.get("/", authentication, getUserFavourites);
favouritesRouter.get("/check/:store_id", authentication, checkFavourite);

module.exports = favouritesRouter;