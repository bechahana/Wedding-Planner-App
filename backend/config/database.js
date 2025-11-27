// backend/config/database.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "mysql2025", // ✔ if this is your real password
  database: process.env.DB_NAME || "wedding_planner",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306, // ⭐ ADD THIS
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("🎯 MySQL Connected Successfully!");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection error:", err.message);
    console.error("Code:", err.code); // ⭐ ADD THIS helps debugging
  }
})();

module.exports = pool;
