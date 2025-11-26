// backend/config/database.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "mysql2025",
  database: process.env.DB_NAME || "wedding_planner",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Optional connection test
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Connected to MySQL");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection error:", err.message);
  }
})();

module.exports = pool;
