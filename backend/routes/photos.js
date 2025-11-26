// backend/routes/photos.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../config/database");

const router = express.Router();

// Ensure uploads dir exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /api/guests/events/:invitationId/photos
router.post("/:invitationId/photos", upload.array("photos", 10), async (req, res) => {
  const { invitationId } = req.params;
  const uploadedBy = req.body.uploadedBy || null;

  try {
    const [weddingRows] = await pool.query(
      "SELECT id FROM weddings WHERE invitation_id = ?",
      [invitationId]
    );
    if (weddingRows.length === 0) {
      return res.status(404).json({ message: "Wedding not found" });
    }
    const weddingId = weddingRows[0].id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No photos uploaded" });
    }

    const insertPromises = req.files.map((file) =>
      pool.query(
        "INSERT INTO photos (wedding_id, photo_url, uploaded_by) VALUES (?, ?, ?)",
        [weddingId, file.filename, uploadedBy]
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
});

module.exports = router;
