// backend/routes/weddings.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET /api/weddings/:invitationId
router.get("/:invitationId", async (req, res) => {
  const { invitationId } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM weddings WHERE invitation_id = ?",
      [invitationId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Wedding not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching wedding:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
