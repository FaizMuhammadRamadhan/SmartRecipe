const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

console.log("🔥 authRoutes loaded");

// ✅ Endpoint REGISTER
router.post("/register", (req, res) => {
  register(req, res);
});

// ✅ Endpoint LOGIN
router.post("/login", (req, res) => {
  login(req, res);
});

module.exports = router;
