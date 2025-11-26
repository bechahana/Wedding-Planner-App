const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const weddingRoutes = require("./routes/weddings");
const photoRoutes = require("./routes/photos");
const parkingRoutes = require("./routes/parking");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 CORS FIX
app.use(cors());

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Wedding Guest API is running 🌸");
});

// Routes
app.use("/api/weddings", weddingRoutes);
app.use("/api/guests/events", photoRoutes);
app.use("/api/guests/events", parkingRoutes);
app.use("/api/guests", parkingRoutes); // for /parking/availability

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
