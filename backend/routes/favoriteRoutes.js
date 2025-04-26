const express = require("express");
const router = express.Router();
const { addFavorite, getFavorites, deleteFavorite } = require("../controllers/favoriteController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", authenticateToken, addFavorite); // ✅ Tambah favorit
router.get("/", authenticateToken, getFavorites); // ✅ Ambil daftar favorit
router.delete("/:id", authenticateToken, deleteFavorite); // ✅ Hapus favorit


module.exports = router;