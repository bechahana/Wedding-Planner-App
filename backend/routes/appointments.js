const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// List vendors by type (with slots)
router.get("/vendors", async (req, res) => {
  const { type } = req.query;
  let sql = "SELECT ws.id, ws.service_type, ws.name, ws.description FROM wedding_services ws WHERE ws.service_type = ?";
  try {
    const [vendors] = await pool.query(sql, [type]);

    // Add demo slots for each vendor
    const generateSlots = () => {
      const slots = [];
      const now = new Date();
      // Generate 3-4 slots over the next 2 weeks
      for (let i = 1; i <= 4; i++) {
        const slotDate = new Date(now);
        slotDate.setDate(now.getDate() + (i * 2)); // Every 2 days
        const hours = [10, 13, 16]; // 10 AM, 1 PM, 4 PM
        const hour = hours[i % hours.length];
        const formatted = `${slotDate.getFullYear()}-${String(slotDate.getMonth() + 1).padStart(2, '0')}-${String(slotDate.getDate()).padStart(2, '0')} ${String(hour).padStart(2, '0')}:00`;
        slots.push(formatted);
      }
      return slots;
    };

    const vendorsWithSlots = vendors.map(v => ({
      ...v,
      slots: generateSlots()
    }));

    res.json({ ok: true, vendors: vendorsWithSlots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to fetch vendors" });
  }
});

// Book appointment
router.post("/", async (req, res) => {
  const user_id = req.body.user_id;
  const { service_id, appointment_type, start_datetime, end_datetime } = req.body;
  if (!user_id) return res.status(400).json({ ok: false, error: "Missing user_id" });
  try {
    await pool.query(
      `INSERT INTO appointments (user_id, service_id, appointment_type, start_datetime, end_datetime) VALUES (?, ?, ?, ?, ?)`,
      [user_id, service_id, appointment_type, start_datetime, end_datetime || null]
    );
    res.json({ ok: true, message: "Appointment booked." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to book appointment" });
  }
});

// List user's appointments
router.get("/my", async (req, res) => {
  const user_id = req.query.user_id;
  if (!user_id) return res.status(400).json({ ok: false, error: "Missing user_id" });
  try {
    const [results] = await pool.query(
      `SELECT a.*, ws.name AS vendor_name FROM appointments a JOIN wedding_services ws ON ws.id = a.service_id WHERE a.user_id = ? ORDER BY a.start_datetime DESC`,
      [user_id]
    );
    res.json({ ok: true, appointments: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to fetch appointments" });
  }
});

module.exports = router;
