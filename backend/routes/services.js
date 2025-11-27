// backend/routes/services.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const pool = require("../config/database");

const router = express.Router();

/* ---------- Multer config for service photos ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads", "services"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const upload = multer({
  storage,
  limits: { files: 10 },
});

/* ---------- POST /api/services ---------- */
/*
  Expects multipart/form-data with fields:
  - service_type   (DJ, Chef, Cake Baker, Florist, Waiter, Venue)
  - name
  - address
  - price
  - description
  - phone_number
  - email
  - capacity       (only for Venue)
  - dates          (JSON string array, e.g. '["2025-06-10","2025-06-11"]')
  - photos[]       (files)
*/
router.post("/", upload.array("photos", 10), async (req, res) => {
  const {
    service_type,
    name,
    address,
    price,
    description,
    phone_number,
    email,
    capacity,
    dates, // optional (JSON string)
  } = req.body;

  if (!service_type || !name || !email) {
    return res.status(400).json({
      ok: false,
      error: "service_type, name and email are required.",
    });
  }

  const files = req.files || [];

  let parsedDates = [];
  if (dates) {
    try {
      parsedDates = JSON.parse(dates);
    } catch {
      // if parsing fails we just ignore dates for now
    }
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Insert into wedding_services
    const [result] = await conn.execute(
      `INSERT INTO wedding_services
        (service_type, name, address, price, description, phone_number, email)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        service_type,
        name,
        address || null,
        price || null,
        description || null,
        phone_number || null,
        email,
      ]
    );

    const serviceId = result.insertId;

    // 2) If it's a Venue, also create a row in venues
    if (service_type === "Venue") {
      await conn.execute(
        `INSERT INTO venues (service_id, address, capacity, parking_capacity)
         VALUES (?, ?, ?, ?)`,
        [serviceId, address || null, capacity || null, null]
      );
    }

    // 3) Save photos into service_photos
    for (const file of files) {
      const fileUrl = `/uploads/services/${file.filename}`;
      await conn.execute(
        `INSERT INTO service_photos (service_id, file_url, caption, uploaded_at)
         VALUES (?, ?, ?, NOW())`,
        [serviceId, fileUrl, null]
      );
    }

    // NOTE: your current ERD has no table for availability.
    // We just parse dates (above) and ignore them for now.
    // Later we could add a service_availability table if needed.
// ✅ List services (optionally filter by service_type)
router.get("/", async (req, res) => {
    const { service_type } = req.query;
  
    let conn;
    try {
      conn = await pool.getConnection();
  
      let sql = `
        SELECT 
          s.id,
          s.service_type,
          s.name,
          s.address,
          s.price,
          s.description,
          s.phone_number,
          s.email,
          s.capacity,
          s.created_at,
          GROUP_CONCAT(p.file_url ORDER BY p.id SEPARATOR ',') AS photo_urls
        FROM wedding_services s
        LEFT JOIN service_photos p ON p.service_id = s.id
      `;
      const params = [];
  
      if (service_type) {
        sql += ` WHERE s.service_type = ?`;
        params.push(service_type);
      }
  
      sql += ` GROUP BY s.id ORDER BY s.service_type ASC, s.name ASC`;
  
      const [rows] = await conn.query(sql, params);
  
      const services = rows.map((row) => ({
        id: row.id,
        service_type: row.service_type,
        name: row.name,
        address: row.address,
        price: row.price,
        description: row.description,
        phone_number: row.phone_number,
        email: row.email,
        capacity: row.capacity,
        created_at: row.created_at,
        photos: row.photo_urls ? row.photo_urls.split(",") : [],
      }));
  
      res.json({ ok: true, services });
    } catch (err) {
      console.error("Error fetching services:", err);
      res.status(500).json({ ok: false, error: "Failed to fetch services" });
    } finally {
      if (conn) conn.release();
    }
  });
  
    await conn.commit();
    res.json({ ok: true, serviceId });
  } catch (err) {
    console.error("Error creating service:", err);
    await conn.rollback();
    res.status(500).json({ ok: false, error: "Failed to create service" });
  } finally {
    conn.release();
  }
});

module.exports = router;
