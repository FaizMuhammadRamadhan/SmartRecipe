const { Favorite } = require("../models"); 

// Tambah favorit untuk resep Indonesia
exports.add = async (req, res) => {
    try {
      const {
        recipeId,
        title,
        image,
        source,
        region,
        ingredients,
        instructions,
        category,
        videoUrl,
      } = req.body;
  
      console.log("Data diterima di backend:", req.body);
      console.log("User ID:", req.user?.id);
  
      // Pastikan ingredients adalah string untuk disimpan
      const parsedIngredients = Array.isArray(ingredients)
        ? ingredients.join(", ")
        : typeof ingredients === "string"
        ? ingredients
        : String(ingredients);
  
      const favorite = await Favorite.create({
        recipeId,
        title,
        image,
        source,
        region,
        ingredients: parsedIngredients,
        instructions,
        category,
        videoUrl,
        userId: req.user.id,
        sourceType: "indonesia",
      });
  
      console.log("Favorit Indonesia berhasil ditambahkan:", favorite.toJSON());
      res.json(favorite);
    } catch (err) {
      console.error("Error (add Indonesia):", err);
      res
        .status(500)
        .json({ error: "Gagal menambahkan ke favorit resep Indonesia" });
    }
  };
  

// Ambil semua favorit dari resep Indonesia
exports.getAll = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: {
        userId: req.user.id,
        sourceType: "indonesia",
      },
    });
    res.json(favorites);
  } catch (err) {
    console.error("Error (getAll Indonesia):", err.message);
    res.status(500).json({ error: "Gagal mengambil favorit resep Indonesia" });
  }
};

// Hapus favorit Indonesia
exports.remove = async (req, res) => {
  try {
    const deleted = await Favorite.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id,
        sourceType: "indonesia",
      },
    });
    if (deleted) {
      res.json({ message: "Berhasil menghapus favorit Indonesia" });
    } else {
      res.status(404).json({ error: "Favorit Indonesia tidak ditemukan" });
    }
  } catch (err) {
    console.error("Error (remove Indonesia):", err.message);
    res.status(500).json({ error: "Gagal menghapus favorit resep Indonesia" });
  }
};
