const express = require("express");
const router = express.Router();
const { register, login, getMe, updateMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET  /api/auth/me
router.get("/me", protect, getMe);

// PUT  /api/auth/me
router.put("/me", protect, updateMe);

module.exports = router;
