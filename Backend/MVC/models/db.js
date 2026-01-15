// connecting to PostgreSQL
const { Pool } = require("pg");

const connectionString = process.env.DB_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, 
  },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Pool error: ", err.message, err.stack);
    return;
  }
  console.log("Pool connected on: ", client.user);
  release(); 
});

module.exports = {
  pool,
};