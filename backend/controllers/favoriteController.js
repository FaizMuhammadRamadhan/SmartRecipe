const Favorite = require("../models/Favorite");

// exports.addFavorite = async (req, res) => {
//   const { recipeId, title, image } = req.body;
//   try {
//     const favorite = await Favorite.create({
//       recipeId,
//       title,
//       image,
//       userId: req.user.id,
//     });
//     res.json(favorite);
//   } catch (err) {
//     res.status(500).json({ error: "Gagal menambahkan ke favorit" });
//   }
// };
exports.addFavorite = async (req, res) => {
  const { recipeId, title, image } = req.body;
  console.log("Data favorit yang diterima:", { recipeId, title, image }); // Log data
  try {
    const favorite = await Favorite.create({
      recipeId,
      title,
      image,
      userId: req.user.id, // pastikan req.user.id ada dan valid
    });
    res.json(favorite);
  } catch (err) {
    console.error("Error:", err.message); // Log error yang terjadi
    res.status(500).json({ error: "Gagal menambahkan ke favorit" });
  }
};


exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({ where: { userId: req.user.id } });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil favorit" });
  }
};

exports.deleteFavorite = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Favorite.destroy({
      where: { id, userId: req.user.id },
    });
    if (deleted) {
      res.json({ message: "Berhasil dihapus dari favorit" });
    } else {
      res.status(404).json({ error: "Favorit tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus favorit" });
  }
};
