const express = require('express');
const {Sequelize} = require('sequelize');

const config = require('../config/index')

database_name = config.db.db_name;
username = config.db.user_name;
password = config.db.pass_word;

const sequelize = new Sequelize(database_name, username, password, {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;