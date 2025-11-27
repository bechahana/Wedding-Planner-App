const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Existing routes
const weddingRoutes = require("./routes/weddings");
const photoRoutes = require("./routes/photos");
const parkingRoutes = require("./routes/parking");
const accountsRoutes = require("./routes/accounts"); 
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;
const serviceRoutes = require("./routes/services");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/services", serviceRoutes);

app.get("/", (req, res) => {
  res.send("Wedding Guest API is running 🌸");
});

app.use("/api/auth", authRoutes);

// Existing Routes
app.use("/api/weddings", weddingRoutes);
app.use("/api/guests/events", photoRoutes);
app.use("/api/guests/events", parkingRoutes);
app.use("/api/guests", parkingRoutes);
app.use("/api/accounts", accountsRoutes); 
// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
