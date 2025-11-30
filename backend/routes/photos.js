// backend/routes/photos.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../config/database"); // mysql2/promise pool

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/**
 * POST /api/guests/events/photos
 * Body (multipart/form-data):
 *   coupleName  (text)
 *   guestName   (text, optional)
 *   photos      (file)  <-- field name MUST be "photos"
 */
router.post("/photos", upload.array("photos", 10), async (req, res) => {
  const coupleName = req.body.coupleName;
  const guestName = req.body.guestName || null;

  if (!coupleName) {
    return res.status(400).json({ message: "coupleName is required" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No photos uploaded" });
  }

  try {
    // 1) Check if this couple already has a wedding row
    const [rows] = await pool.query(
      "SELECT id FROM weddings WHERE couple_name = ?",
      [coupleName]
    );

    let weddingId;

    if (rows.length > 0) {
      // Existing wedding
      weddingId = rows[0].id;
    } else {
      // 2) Create new wedding WITH a generated invitation_id (required by DB)
      const invitationId =
        "auto-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);

      const [insertRes] = await pool.query(
        "INSERT INTO weddings (couple_name, invitation_id) VALUES (?, ?)",
        [coupleName, invitationId]
      );

      weddingId = insertRes.insertId;
    }

    // 3) Save uploaded photos for that wedding
    const insertPromises = req.files.map((file) =>
      pool.query(
        "INSERT INTO photos (wedding_id, photo_url, uploaded_by) VALUES (?, ?, ?)",
        [weddingId, file.filename, guestName]
      )
    );

    await Promise.all(insertPromises);

    res.json({
      ok: true,
      message: "Photos uploaded successfully",
      count: req.files.length,
    });
  } catch (err) {
    console.error("Error uploading photos:", err);
    res.status(500).json({ message: "Server error" });
  }
  await pool.query(
  "INSERT INTO guest_photos (couple_name, uploaded_by, photo_url) VALUES (?, ?, ?)",
  [coupleName, guestName, `uploads/services/${file.filename}`]
);
});

module.exports = router;
