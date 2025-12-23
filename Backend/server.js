const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./MVC/models/db")

const app = express();
const PORT = 5000;
//====================

//====================

app.use(cors());
app.use(express.json());
//====================

//=====================
app.use((req, res) => res.status(404).json("NO content at this path"));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
