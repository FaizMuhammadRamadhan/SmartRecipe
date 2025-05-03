const express = require("express");
const router = express.Router();
const favoriteIndonesiaController = require("../controllers/favoriteIndonesiaController");
const authenticate = require("../middleware/authMiddleware");

router.post("/", authenticate, favoriteIndonesiaController.add);
router.get("/", authenticate, favoriteIndonesiaController.getAll);
router.delete("/:id", authenticate, favoriteIndonesiaController.remove);

module.exports = router;