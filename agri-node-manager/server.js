const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const advisorRoutes = require("./routes/advisorRoutes");

// ── Connect to Database ─────────────────────────────────────
connectDB();

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(cors());

// ── Routes ──────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/advisor", advisorRoutes);

// ── Health Check ────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "🌾 Agri-Manager is Live",
    developer: "Nitin Ojha",
    college: "IET Lucknow",
    version: "2.0.0",
    routes: {
      auth: "/api/auth/register | /api/auth/login | /api/auth/me",
      advisor: "/api/advisor/ask | /api/advisor/history",
    },
  });
});

// ── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Manager Backend running on http://localhost:${PORT}`);
});
