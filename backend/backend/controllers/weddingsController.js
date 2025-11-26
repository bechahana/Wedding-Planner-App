import pool from "../config/database.js";

export const getWeddingByInvitation = async (req, res) => {
  const { invitationId } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM weddings WHERE invitation_id = ?",
      [invitationId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Wedding not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
