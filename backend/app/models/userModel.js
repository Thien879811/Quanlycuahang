const { DataTypes } = require('sequelize');
const sequelize = require("../backend/app/utils/mysql")

const User = sequelize.define('User', {
  username: {
    type: sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    type: sequelize.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: sequelize.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

module.exports = User;
