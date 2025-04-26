const express = require('express');
const router = express.Router();
const RecipeModel = require('../models/RecipeModel');

// GET semua resep
router.get('/', async (req, res) => {
    try {
        const recipes = await RecipeModel.getAllRecipes();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET resep berdasarkan id
router.get('/:id', async (req, res) => {
    try {
        const recipe = await RecipeModel.getRecipeById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST tambah resep baru
router.post('/', async (req, res) => {
    try {
        const recipe = await RecipeModel.createRecipe(req.body);
        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update resep berdasarkan id
router.put('/:id', async (req, res) => {
    try {
        const recipe = await RecipeModel.updateRecipe(req.params.id, req.body);
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE hapus resep berdasarkan id
router.delete('/:id', async (req, res) => {
    try {
        const recipe = await RecipeModel.deleteRecipe(req.params.id);
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
