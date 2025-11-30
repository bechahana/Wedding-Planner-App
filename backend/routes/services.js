// backend/routes/services.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../config/database");

const router = express.Router();

/* ---------------------- Ensure upload dir exists ---------------------- */

const uploadDir = path.join(__dirname, "..", "uploads", "services");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* --------------------------- Multer storage --------------------------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 }, // 10 MB, max 10 files
});

/* ------------------------ Helper: subtype table ------------------------ */

function getSubtypeTable(serviceType) {
  switch (serviceType) {
    case "DJ":
      return "dj_bands";
    case "Chef":
      return "chefs";
    case "Cake Baker":
      return "cake_bakers";
    case "Florist":
      return "florists";
    case "Waiter":
      return "waiters";
    case "Venue":
      return "venues";
    default:
      return null;
  }
}

/* ---------------------------- POST /services --------------------------- */
// creates service + photos + subtype row, following the ERD strictly
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
    dates, // availability dates coming from the form
  } = req.body;

  if (!service_type || !name || !price || !email) {
    return res
      .status(400)
      .json({ ok: false, error: "Missing required fields." });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const numericPrice = Number(price);

    // 1️⃣ wedding_services
    const [serviceResult] = await conn.query(
      `INSERT INTO wedding_services
       (service_type, name, address, price, description, phone_number, email)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        service_type,
        name,
        address || null,
        isNaN(numericPrice) ? null : numericPrice,
        description || null,
        phone_number || null,
        email,
      ]
    );

    const serviceId = serviceResult.insertId;

    // 2️⃣ service_photos
    if (Array.isArray(req.files) && req.files.length > 0) {
      const photoInserts = req.files.map((file) => {
        const fileUrl = `/uploads/services/${file.filename}`;
        return conn.query(
          "INSERT INTO service_photos (service_id, file_url) VALUES (?, ?)",
          [serviceId, fileUrl]
        );
      });
      await Promise.all(photoInserts);
    }

    // 3️⃣ subtype table
    const subtypeTable = getSubtypeTable(service_type);
    if (!subtypeTable) {
      throw new Error("Unsupported service type: " + service_type);
    }

    if (subtypeTable === "venues") {
      const cap = capacity ? Number(capacity) : null;
      await conn.query(
        "INSERT INTO venues (service_id, address, capacity) VALUES (?, ?, ?)",
        [serviceId, address || null, isNaN(cap) ? null : cap]
      );
    } else {
      await conn.query(
        `INSERT INTO ${subtypeTable} (service_id) VALUES (?)`,
        [serviceId]
      );
    }

    // 4️⃣ availability dates -> service_availability
    let dateArray = [];

    if (Array.isArray(dates)) {
      dateArray = dates;
    } else if (typeof dates === "string" && dates.trim() !== "") {
      if (dates.trim().startsWith("[")) {
        // JSON string from frontend
        try {
          dateArray = JSON.parse(dates);
        } catch (e) {
          console.warn("Could not parse dates JSON:", e.message);
        }
      } else {
        // comma-separated string
        dateArray = dates.split(",").map((d) => d.trim());
      }
    }

    if (dateArray.length > 0) {
      for (const dateStr of dateArray) {
        if (!dateStr) continue;
        await conn.query(
          "INSERT INTO service_availability (service_id, available_date) VALUES (?, ?)",
          [serviceId, dateStr]
        );
      }
    }

    await conn.commit();
    res.json({ ok: true, id: serviceId });
  } catch (err) {
    console.error("Error adding service:", err);
    if (conn) await conn.rollback();
    return res.status(500).json({ ok: false, error: "Failed to add service" });
  } finally {
    if (conn) conn.release();
  }
});

/* ----------------------------- GET /services --------------------------- */
// list services, optionally filtered by ?service_type=DJ etc.
router.get("/", async (req, res) => {
  const { service_type } = req.query; // DJ, Chef, Cake Baker, Florist, Waiter, Venue

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
        -- next free date (only where is_booked = 0)
        MIN(CASE WHEN a.is_booked = 0 THEN a.available_date END) AS next_available_date,
        GROUP_CONCAT(p.file_url ORDER BY p.id SEPARATOR ',') AS photo_urls
      FROM wedding_services s
      LEFT JOIN service_photos p 
        ON p.service_id = s.id
      LEFT JOIN service_availability a
        ON a.service_id = s.id
    `;
    const params = [];

    if (service_type) {
      sql += " WHERE s.service_type = ?";
      params.push(service_type);
      if (service_type === "Venue") {
        sql += " AND s.id IN (SELECT service_id FROM venues)";
      }
    }

    sql += `
      GROUP BY s.id
      ORDER BY s.service_type ASC, s.name ASC
    `;

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
      photos: row.photo_urls ? row.photo_urls.split(",") : [],
      // 👇 used on the category cards for "Next: date"
      next_available_date: row.next_available_date,
    }));

    res.json({ ok: true, services });
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch services" });
  } finally {
    if (conn) conn.release();
  }
});



/* ----------------------- GET /services/:id/details --------------------- */
// returns single service + photos + availability dates
router.get("/:id/details", async (req, res) => {
  const { id } = req.params;
  let conn;

  try {
    conn = await pool.getConnection();

    // 1) Get the service with photos
    const [serviceRows] = await conn.query(
      `
      SELECT 
        s.id,
        s.service_type,
        s.name,
        s.address,
        s.price,
        s.description,
        s.phone_number,
        s.email,
        GROUP_CONCAT(p.file_url ORDER BY p.id SEPARATOR ',') AS photo_urls
      FROM wedding_services s
      LEFT JOIN service_photos p ON p.service_id = s.id
      WHERE s.id = ?
      GROUP BY s.id
      `,
      [id]
    );

    if (serviceRows.length === 0) {
      return res.status(404).json({ ok: false, error: "Service not found" });
    }

    const row = serviceRows[0];
    const service = {
      id: row.id,
      service_type: row.service_type,
      name: row.name,
      address: row.address,
      price: row.price,
      description: row.description,
      phone_number: row.phone_number,
      email: row.email,
      photos: row.photo_urls ? row.photo_urls.split(",") : [],
    };

    // 2) Get availability rows
    const [availabilityRows] = await conn.query(
      `
      SELECT id, available_date, is_booked
      FROM service_availability
      WHERE service_id = ?
      ORDER BY available_date
      `,
      [id]
    );

    res.json({
      ok: true,
      service,
      availability: availabilityRows,
    });
  } catch (err) {
    console.error("Error fetching service details:", err);
    res
      .status(500)
      .json({ ok: false, error: "Failed to fetch service details" });
  } finally {
    if (conn) conn.release();
  }
});

/* ------------------------------- EXPORT -------------------------------- */

module.exports = router;
