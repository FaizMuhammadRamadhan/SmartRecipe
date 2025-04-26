const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

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
});

// Relasi ke User
User.hasMany(Favorite, { foreignKey: "userId" });
Favorite.belongsTo(User, { foreignKey: "userId" });

module.exports = Favorite;
