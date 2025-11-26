import pool from "../config/database.js";

export const uploadPhotos = async (req, res) => {
  const { invitationId } = req.params;

  try {
    const [weddingRows] = await pool.query(
      "SELECT id FROM weddings WHERE invitation_id = ?",
      [invitationId]
    );

    if (weddingRows.length === 0) {
      return res.status(404).json({ message: "Wedding not found" });
    }

    const weddingId = weddingRows[0].id;

    const uploadedFiles = req.files.map((file) => ({
      wedding_id: weddingId,
      photo_url: file.filename,
      uploaded_by: req.body.name || null,
    }));

    for (const file of uploadedFiles) {
      await pool.query(
        "INSERT INTO photos (wedding_id, photo_url, uploaded_by) VALUES (?, ?, ?)",
        [file.wedding_id, file.photo_url, file.uploaded_by]
      );
    }

    res.json({ ok: true, message: "Photos uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
