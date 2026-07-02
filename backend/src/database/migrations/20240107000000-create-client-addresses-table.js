'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('client_addresses', {
      address_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'clients',
          key: 'client_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      primary_address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      secondary_address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      primary_state: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      secondary_state: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      primary_pincode: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      secondary_pincode: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('client_addresses');
  },
};
