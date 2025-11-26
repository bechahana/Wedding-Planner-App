import pool from "../config/database.js";

export const submitParking = async (req, res) => {
  const { invitationId } = req.params;
  const { guest_name, available_spots, note, parking_time } = req.body;

  try {
    const [weddingRows] = await pool.query(
      "SELECT id FROM weddings WHERE invitation_id = ?",
      [invitationId]
    );

    if (weddingRows.length === 0) {
      return res.status(404).json({ message: "Wedding not found" });
    }

    const weddingId = weddingRows[0].id;

    await pool.query(
      `INSERT INTO guest_parking 
       (wedding_id, guest_name, available_spots, note, parking_time)
       VALUES (?, ?, ?, ?, ?)`,
      [weddingId, guest_name, available_spots, note, parking_time]
    );

    res.json({ ok: true, message: "Parking info submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getParkingAvailability = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT SUM(available_spots) AS total FROM guest_parking"
    );
    res.json({ available: rows[0].total || 0 });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
