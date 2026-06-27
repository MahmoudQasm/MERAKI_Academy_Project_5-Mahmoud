const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const db = require("./MVC/models/db");
const cartRouter = require("./MVC/routes/cart");
const usersRouter = require("./MVC/routes/users");
const favouritesRouter = require("./MVC/routes/favourites");
const categoriesRouter = require("./MVC/routes/categories");
const productsRouter = require("./MVC/routes/products");
const storesRouter = require("./MVC/routes/stores");

const app = express();
const PORT = process.env.PORT || 5000;

// ⚡ Handle CORS for Netlify + OPTIONS
// ⚡ Handle CORS for Netlify + localhost
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://aesthetic-dango-b61ce6.netlify.app",
      "https://meraki-academy-project-5-4.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.json());

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/stores", storesRouter);
app.use("/categories", categoriesRouter);
app.use("/cart", cartRouter);
app.use("/favourites", favouritesRouter);

app.use((req, res) => res.status(404).json("NO content at this path"));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
