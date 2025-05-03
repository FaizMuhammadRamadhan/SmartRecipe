const pool = require('../db');

const getAllRecipes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM indonesian_recipes');
    res.json(result.rows); // category akan ikut kalau ada di tabel
  } catch (err) {
    console.error('Error fetching Indonesian recipes:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllRecipes,
};
