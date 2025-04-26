const pool = require('../config/db');

const RecipeModel = {
    getAllRecipes: async () => {
        const result = await pool.query('SELECT * FROM recipes');
        return result.rows;
    },

    getRecipeById: async (id) => {
        const result = await pool.query('SELECT * FROM recipes WHERE id = $1', [id]);
        return result.rows[0];
    },

    createRecipe: async (data) => {
        const { title, image, cuisine, dish_type, ingredients, source_url, spoonacular_score } = data;
        const result = await pool.query(
            `INSERT INTO recipes (title, image, cuisine, dish_type, ingredients, source_url, spoonacular_score)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [title, image, cuisine, dish_type, ingredients, source_url, spoonacular_score]
        );
        return result.rows[0];
    },

    updateRecipe: async (id, data) => {
        const { title, image, cuisine, dish_type, ingredients, source_url, spoonacular_score } = data;
        const result = await pool.query(
            `UPDATE recipes
             SET title = $1, image = $2, cuisine = $3, dish_type = $4, ingredients = $5, source_url = $6, spoonacular_score = $7
             WHERE id = $8 RETURNING *`,
            [title, image, cuisine, dish_type, ingredients, source_url, spoonacular_score, id]
        );
        return result.rows[0];
    },

    deleteRecipe: async (id) => {
        const result = await pool.query('DELETE FROM recipes WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
};

module.exports = RecipeModel;
