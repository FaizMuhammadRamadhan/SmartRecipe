const express = require("express");
const router = express.Router();
const { addFavorite, getFavorites, deleteFavorite } = require("../controllers/favoriteController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", authenticateToken, addFavorite);
router.get("/", authenticateToken, getFavorites);
router.delete("/:id", authenticateToken, deleteFavorite);

module.exports = router;
