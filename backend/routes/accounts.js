// backend/routes/accounts.js
const express = require("express");
const router = express.Router();

const accountsController = require("../controllers/accountsController");

// GET /api/accounts
router.get("/", accountsController.listAccounts);

module.exports = router;
