'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('amc_payments', {
      amc_payment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'clients', key: 'client_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      membership_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'memberships', key: 'membership_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      year_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_received: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      payment_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      payment_mode: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('amc_payments', ['client_id']);
    await queryInterface.addIndex('amc_payments', ['membership_id']);
    await queryInterface.addIndex('amc_payments', ['client_id', 'year_number'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('amc_payments');
  },
};
