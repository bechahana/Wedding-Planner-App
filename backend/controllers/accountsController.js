// backend/controllers/accountsController.js
const pool = require("../config/database");

// GET /api/accounts  (optional ?role=ADMIN / USER / GUEST)
exports.listAccounts = async (req, res) => {
  const { role } = req.query;

  let conn;
  try {
    conn = await pool.getConnection();

    let sql = `
      SELECT id, full_name, email, role, created_at
      FROM accounts
    `;
    const params = [];

    // if role filter provided → add WHERE
    if (role && role.toUpperCase() !== "ALL") {
      sql += " WHERE role = ?";
      params.push(role.toUpperCase());
    }

    sql += " ORDER BY created_at DESC";

    const [rows] = await conn.query(sql, params);

    const accounts = rows.map((row) => ({
      id: row.id,
      full_name: row.full_name,
      email: row.email,
      role: row.role,
      status: "ACTIVE", // placeholder, later we can add banned/disabled flag
      created_at: row.created_at,
    }));

    res.json({ ok: true, accounts });
  } catch (err) {
    console.error("Error fetching accounts:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch accounts" });
  } finally {
    if (conn) conn.release();
  }
};
