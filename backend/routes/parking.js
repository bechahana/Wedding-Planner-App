// routes/parking.js
const express = require("express");
const mysql = require("mysql2/promise");

const router = express.Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "mysql2025",
  database: process.env.DB_NAME || "wedding_planner",
});

/**
 * POST /api/guests/parking
 * Body: { wedding_place, wedding_datetime, car_count, note }
 */
router.post("/parking", async (req, res) => {
  try {
    const { wedding_place, wedding_datetime, car_count, note } = req.body;

    if (!wedding_place || !wedding_datetime || !car_count) {
      return res
        .status(400)
        .json({ error: "wedding_place, wedding_datetime and car_count are required" });
    }

    await pool.query(
      `INSERT INTO guest_parking 
       (wedding_place, wedding_datetime, car_count, note) 
       VALUES (?, ?, ?, ?)`,
      [wedding_place, wedding_datetime, car_count, note || null]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("Error saving guest parking:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
