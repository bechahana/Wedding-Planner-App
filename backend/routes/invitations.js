const express = require("express");
const router = express.Router();
const pool = require("../config/database");

router.post("/", async (req, res) => {
  const sender_id = req.body.sender_id;
  let { venue_id, invitations, message } = req.body;
  if (!sender_id) return res.status(400).json({ ok: false, error: "Missing sender_id" });

  if (!Array.isArray(invitations) || invitations.length === 0) {
    return res.status(400).json({ ok: false, error: "No recipients provided" });
  }

  try {
    if (!venue_id) {
      const [defaultVenues] = await pool.query(
        `SELECT service_id FROM venues LIMIT 1`
      );
      if (defaultVenues.length > 0) {
        venue_id = defaultVenues[0].service_id;
      } else {
        const [venueServices] = await pool.query(
          `SELECT id, address FROM wedding_services WHERE service_type = 'Venue' LIMIT 1`
        );
        if (venueServices.length > 0) {
          const serviceId = venueServices[0].id;
          await pool.query(
            `INSERT INTO venues (service_id, address, capacity, parking_capacity) VALUES (?, ?, 200, 50)`,
            [serviceId, venueServices[0].address || 'TBD']
          );
          venue_id = serviceId;
        } else {
          return res.status(400).json({ 
            ok: false, 
            error: "No venues available. Venue information will be stored in the invitation message." 
          });
        }
      }
    }

    const [venueCheck] = await pool.query(
      `SELECT service_id FROM venues WHERE service_id = ?`,
      [venue_id]
    );
    if (venueCheck.length === 0) {
      return res.status(400).json({ 
        ok: false, 
        error: `Venue with ID ${venue_id} not found in venues table. Please ensure the venue exists.` 
      });
    }

    const values = invitations.map(({ recipient_name, recipient_email }) => [
      sender_id,
      venue_id,
      recipient_name,
      recipient_email,
      message || null
    ]);
    const [result] = await pool.query(
      `INSERT INTO invitations (sender_id, venue_id, recipient_name, recipient_email, message) VALUES ?`,
      [values]
    );
    const firstInvitationId = result.insertId;
    res.json({ ok: true, message: "Invitations sent.", invitation_id: firstInvitationId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to send invitations" });
  }
});

router.get("/my", async (req, res) => {
  const sender_id = req.query.sender_id;
  if (!sender_id) return res.status(400).json({ ok: false, error: "Missing sender_id" });
  try {
    const [results] = await pool.query(
      `SELECT i.*, v.address AS venue_address FROM invitations i JOIN venues v ON v.service_id = i.venue_id WHERE i.sender_id = ? ORDER BY i.id DESC`,
      [sender_id]
    );
    res.json({ ok: true, invitations: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to fetch invitations" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query(
      `SELECT i.*, v.address AS venue_address, ws.name AS venue_name 
       FROM invitations i 
       LEFT JOIN venues v ON v.service_id = i.venue_id 
       LEFT JOIN wedding_services ws ON ws.id = i.venue_id
       WHERE i.id = ?`,
      [id]
    );
    if (results.length === 0) {
      return res.status(404).json({ ok: false, error: "Invitation not found" });
    }
    res.json({ ok: true, invitation: results[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to fetch invitation" });
  }
});

module.exports = router;
