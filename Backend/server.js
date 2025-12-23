const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./MVC/models/db");
const cartRouter = require("./MVC/routes/cart");
const usersRouter = require("./MVC/routes/users");
const categoriesRouter = require("./MVC/routes/categories");
const productsRouter = require("./MVC/routes/products");
const storesRouter = require("./MVC/routes/stores");

const app = express();
const PORT = 5000;
//====================

//====================

app.use(cors());
app.use(express.json());
//====================
app.use("/users", usersRouter)
app.use("/categories",categoriesRouter)
app.use("/cart", cartRouter)
app.use("/products", productsRouter)
app.use("/stores",storesRouter)
//=====================
app.use((req, res) => res.status(404).json("NO content at this path"));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
