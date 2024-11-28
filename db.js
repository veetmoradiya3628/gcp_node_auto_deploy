const { Pool } = require("pg");

// below details should come from secrets or variables 
const pool = new Pool({
  user: "postgres",
  database: "fish",
  password: "root",
  port: 5432,
  host: "localhost", 
});

module.exports = { pool };