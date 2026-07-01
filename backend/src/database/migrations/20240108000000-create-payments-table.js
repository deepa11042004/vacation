'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      payment_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      payment_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      membership_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'memberships', key: 'membership_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'clients', key: 'client_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      payment_type: {
        type: Sequelize.ENUM('DOWN_PAYMENT', 'INSTALMENT', 'AMC', 'PENALTY', 'REFUND'),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      payment_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      payment_mode: {
        type: Sequelize.ENUM('CASH', 'CHEQUE', 'ONLINE', 'BANK_TRANSFER', 'CARD'),
        allowNull: false,
      },
      transaction_ref: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      bank_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'PAID', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'PAID',
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.INTEGER,
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

    await queryInterface.addIndex('payments', ['membership_id'], { name: 'payments_membership_id_idx' });
    await queryInterface.addIndex('payments', ['client_id'], { name: 'payments_client_id_idx' });
    await queryInterface.addIndex('payments', ['payment_date'], { name: 'payments_payment_date_idx' });
    await queryInterface.addIndex('payments', ['status'], { name: 'payments_status_idx' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  },
};
