// backend/routes/parking.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// POST /api/guests/events/:invitationId/parking
router.post("/:invitationId/parking", async (req, res) => {
  const { invitationId } = req.params;
  const { availableSpots, note, weddingTime } = req.body;

  try {
    const [weddingRows] = await pool.query(
      "SELECT id FROM weddings WHERE invitation_id = ?",
      [invitationId]
    );
    if (weddingRows.length === 0) {
      return res.status(404).json({ message: "Wedding not found" });
    }
    const weddingId = weddingRows[0].id;

    const spots =
      availableSpots === null ||
      availableSpots === undefined ||
      availableSpots === ""
        ? null
        : Number(availableSpots);

    await pool.query(
      `INSERT INTO guest_parking (wedding_id, guest_name, available_spots, note, parking_time)
       VALUES (?, ?, ?, ?, ?)`,
      [weddingId, null, spots, note || null, weddingTime || null]
    );

    res.json({ ok: true, message: "Parking information saved" });
  } catch (err) {
    console.error("Error saving parking:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/guests/parking/availability
router.get("/parking/availability", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT COALESCE(SUM(available_spots), 0) AS available FROM guest_parking"
    );
    res.json({ available: rows[0].available });
  } catch (err) {
    console.error("Error fetching availability:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
