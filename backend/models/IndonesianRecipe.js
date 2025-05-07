const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const IndonesianRecipe = sequelize.define("IndonesianRecipe", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  region: {
    type: DataTypes.STRING,
  },
  ingredients: {
    type: DataTypes.TEXT,
  },
  instructions: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING,
  },
  videoUrl: {
    type: DataTypes.STRING,
  },
});
module.exports = IndonesianRecipe;