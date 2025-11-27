// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = "7d";

// POST /api/auth/register  (only USER accounts)
exports.register = async (req, res) => {
    const { full_name, email, password } = req.body;
  
    if (!full_name || !email || !password) {
      return res
        .status(400)
        .json({ message: "full_name, email, password required" });
    }
  
    try {
      const [existing] = await pool.query(
        "SELECT id FROM accounts WHERE email = ?",
        [email]
      );
      if (existing.length > 0) {
        return res.status(409).json({ message: "Email already in use" });
      }
  
      const password_hash = await bcrypt.hash(password, 10);
  
      // ⭐ everyone who signs up gets USER role
      const role = "USER";
  
      const [result] = await pool.query(
        "INSERT INTO accounts (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
        [full_name, email, password_hash, role]
      );
  
      const user = {
        id: result.insertId,
        full_name,
        email,
        role,
      };
  
      const token = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  
      res.status(201).json({ user, token });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log("🔑 Login attempt:", email); // debug

  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }

  try {
    // 1) find account by email
    const [rows] = await pool.query(
      "SELECT * FROM accounts WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      console.log("❌ No user with that email");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const account = rows[0];

    // 2) compare password with hash
    const passwordMatch = await bcrypt.compare(
      password,
      account.password_hash
    );

    if (!passwordMatch) {
      console.log("❌ Password mismatch for", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3) build user object without hash
    const user = {
      id: account.id,
      full_name: account.full_name,
      email: account.email,
      role: account.role,
    };

    // 4) sign token
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    console.log("✅ Login OK for:", email, "role:", user.role);

    res.json({ user, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
