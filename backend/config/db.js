const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('smartrecipe', 'postgres', '123321', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;
