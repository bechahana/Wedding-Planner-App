// routes/album.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const mysql = require("mysql2/promise");

const router = express.Router();

// 🔹 DB connection pool (adjust credentials)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "mysql2025",
  database: process.env.DB_NAME || "wedding_planner",
});

// 🔹 Multer storage – save directly into uploads (NO /services)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // ✅ now saving in uploads/
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const upload = multer({ storage });

/**
 * POST /api/guests/events/photos
 * Frontend: AddPhotos.jsx
 */
router.post(
  "/guests/events/photos",
  upload.array("photos", 10),
  async (req, res) => {
    try {
      const { coupleName, guestName } = req.body;
      const files = req.files || [];

      if (!coupleName || !coupleName.trim()) {
        return res.status(400).json({ error: "coupleName is required" });
      }

      if (!files.length) {
        return res.status(400).json({ error: "No photos uploaded" });
      }

      const values = files.map((file) => [
        coupleName.trim(),
        guestName?.trim() || null,
        // ✅ relative path: /uploads/<file>
        `uploads/${file.filename}`,
      ]);

      await pool.query(
        "INSERT INTO guest_photos (couple_name, uploaded_by, photo_url) VALUES ?",
        [values]
      );

      return res.json({ success: true, uploaded: files.length });
    } catch (err) {
      console.error("Error uploading guest photos:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * GET /api/wedding/photos?couple_name=Emma%20&%20David
 * Frontend: album.jsx (WeddingAlbum)
 */
router.get("/wedding/photos", async (req, res) => {
  const { couple_name } = req.query;

  if (!couple_name) {
    return res.status(400).json({ error: "couple_name query is required" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT photo_url, uploaded_by FROM guest_photos WHERE couple_name = ?",
      [couple_name]
    );
    return res.json(rows);
  } catch (err) {
    console.error("Error fetching photos:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
