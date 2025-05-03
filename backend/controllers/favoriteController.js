const Favorite = require("../models/Favorite");

// ✅ Tambahkan Favorit dari Spoonacular/API/Diet/Internasional
exports.addFavorite = async (req, res) => {
  const { recipeId, title, image, source, region, ingredients, instructions, category, videoUrl } = req.body;
  try {
    const favorite = await Favorite.create({
      recipeId,
      title,
      image,
      source,
      region,
      ingredients,
      instructions,
      category,
      videoUrl,
      userId: req.user.id,
      sourceType: "api"
    });
    res.json(favorite);
  } catch (err) {
    console.error("❌ Gagal menambahkan favorit (API):", err.message);
    res.status(500).json({ error: "Gagal menambahkan ke favorit" });
  }
};

// ✅ Ambil Favorit dari API
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: {
        userId: req.user.id,
        sourceType: "api"
      }
    });
    res.json(favorites);
  } catch (err) {
    console.error("❌ Gagal mengambil favorit (API):", err.message);
    res.status(500).json({ error: "Gagal mengambil favorit" });
  }
};

// ✅ Hapus Favorit dari API
exports.deleteFavorite = async (req, res) => {
  try {
    const deleted = await Favorite.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id,
        sourceType: "api"
      }
    });
    if (deleted) {
      res.json({ message: "Berhasil dihapus dari favorit" });
    } else {
      res.status(404).json({ error: "Favorit tidak ditemukan" });
    }
  } catch (err) {
    console.error("❌ Gagal menghapus favorit (API):", err.message);
    res.status(500).json({ error: "Gagal menghapus favorit" });
  }
};

// ✅ Tambahkan Favorit Resep Indonesia
exports.addFavoriteIndonesia = async (req, res) => {
  const { recipeId, title, image, source, region, ingredients, instructions, category, videoUrl } = req.body;
  try {
    const favorite = await Favorite.create({
      recipeId,
      title,
      image,
      source,
      region,
      ingredients,
      instructions,
      category,
      videoUrl,
      userId: req.user.id,
      sourceType: "indonesia"
    });
    res.json(favorite);
  } catch (err) {
    console.error("❌ Gagal menambahkan favorit Indonesia:", err.message);
    res.status(500).json({ error: "Gagal menambahkan resep Indonesia ke favorit" });
  }
};

// ✅ Ambil Favorit Resep Indonesia
exports.getFavoritesIndonesia = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: {
        userId: req.user.id,
        sourceType: "indonesia"
      }
    });
    res.json(favorites);
  } catch (err) {
    console.error("❌ Gagal mengambil favorit Indonesia:", err.message);
    res.status(500).json({ error: "Gagal mengambil favorit resep Indonesia" });
  }
};

// ✅ Hapus Favorit Resep Indonesia
exports.deleteFavoriteIndonesia = async (req, res) => {
  try {
    const deleted = await Favorite.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id,
        sourceType: "indonesia"
      }
    });
    if (deleted) {
      res.json({ message: "Berhasil dihapus dari favorit resep Indonesia" });
    } else {
      res.status(404).json({ error: "Favorit Indonesia tidak ditemukan" });
    }
  } catch (err) {
    console.error("❌ Gagal menghapus favorit Indonesia:", err.message);
    res.status(500).json({ error: "Gagal menghapus favorit resep Indonesia" });
  }
};
