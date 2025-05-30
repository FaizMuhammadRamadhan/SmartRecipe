const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Favorite = sequelize.define("Favorite", {
  recipeId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
  source: {
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
  sourceType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "api",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Favorite;
