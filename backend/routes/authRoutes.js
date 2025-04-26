const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

console.log("🔥 authRoutes loaded");

// ✅ Endpoint REGISTER
router.post("/register", (req, res) => {
  console.log("✅ Register route hit");
  register(req, res);
});

// ✅ Endpoint LOGIN
router.post("/login", (req, res) => {
  console.log("✅ Login route hit");
  login(req, res);
});

module.exports = router;
