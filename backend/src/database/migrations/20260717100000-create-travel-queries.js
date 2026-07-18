'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('travel_queries', {
      query_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      query_type: {
        type: Sequelize.ENUM('FLIGHT', 'HOTEL', 'CAR_RENTAL', 'TRANSPORT', 'VISA', 'STAYS'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'),
        allowNull: false,
        defaultValue: 'NEW',
      },
      card_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      details: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null,
      },
      admin_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('travel_queries');
  },
};
