'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('products',{
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      catalogID:{
        type: Sequelize.INTEGER,
        references:{
          model:"catelogy",
          key:'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      productName:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      ngaysx: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      hsd: {
        type: Sequelize.DATE,
        allowNull: false
      },

      hinhanh: {
        type: Sequelize.STRING,
        allowNull: false
      },

      soluong: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      gianhap:{
        type: Sequelize.INTEGER,
        allowNull: false
      },

      giaban:{
        type: Sequelize.INTEGER,
        allowNull: false
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },


    })

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('products');
  }
};