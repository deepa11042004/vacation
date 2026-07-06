'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('client_offers', {
      offer_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'clients', key: 'client_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      offer_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      valid_until: {
        type: Sequelize.DATEONLY,
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });

    await queryInterface.addIndex('client_offers', ['client_id'], {
      name: 'idx_client_offers_client_id',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('client_offers');
  },
};
