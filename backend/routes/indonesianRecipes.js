const express = require("express");
const router = express.Router();
const isSuperadmin = require("../middleware/isSuperadmin");
const { IndonesianRecipe } = require("../models"); // ✅ ambil dari models/index.js

// CREATE - hanya superadmin
router.post("/", isSuperadmin, async (req, res) => {
  try {
    const {
      title,
      imageUrl,
      ingredients,
      instructions,
      region,
      videoUrl,
      category,
    } = req.body;

    const newRecipe = await IndonesianRecipe.create({
      title,
      imageUrl,
      ingredients,
      instructions,
      region,
      videoUrl,
      category,
    });

    res.status(201).json(newRecipe);
  } catch (err) {
    console.error("Gagal tambah resep:", err);
    res.status(500).json({ error: err.message });
  }
});

// READ SEMUA
router.get("/", async (req, res) => {
  try {
    const recipes = await IndonesianRecipe.findAll();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await IndonesianRecipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Resep tidak ditemukan" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - hanya superadmin
router.put("/:id", isSuperadmin, async (req, res) => {
  try {
    const recipe = await IndonesianRecipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Resep tidak ditemukan" });

    const {
      title,
      imageUrl,
      ingredients,
      instructions,
      region,
      videoUrl,
      category,
    } = req.body;

    await recipe.update({
      title,
      imageUrl,
      ingredients,
      instructions,
      region,
      videoUrl,
      category,
    });

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - hanya superadmin
router.delete("/:id", isSuperadmin, async (req, res) => {
  try {
    const recipe = await IndonesianRecipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Resep tidak ditemukan" });

    await recipe.destroy();
    res.json({ message: "Resep berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
