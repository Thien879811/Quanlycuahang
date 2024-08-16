const { DataTypes } = require('sequelize');
const sequelize = require("../utils/mysql")

const products = sequelize.define('products', {
  catalogID:{
    type: DataTypes.INTEGER,
    references:{
      model:"catelogy",
      key:'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
 
  productName:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  ngaysx: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  hsd: {
    type: DataTypes.DATE,
    allowNull: false
  },

  hinhanh: {
    type: DataTypes.STRING,
    allowNull: false
  },

  soluong: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  gianhap:{
    type: DataTypes.INTEGER,
    allowNull: false
  },

  giaban:{
    type: DataTypes.INTEGER,
    allowNull: false
  },

});

module.exports = products;




