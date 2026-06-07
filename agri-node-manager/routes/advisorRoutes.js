const express = require("express");
const router = express.Router();
const {
  askAdvisor,
  getChatHistory,
} = require("../controllers/advisorController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/advisor/ask  — AI se sawaal poochho
router.post("/ask", protect, askAdvisor);

// GET  /api/advisor/history — Apni purani conversations dekho
router.get("/history", protect, getChatHistory);

module.exports = router;
