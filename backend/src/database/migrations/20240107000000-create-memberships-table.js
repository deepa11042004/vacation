'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('memberships', {
      membership_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      membership_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'clients', key: 'client_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      package_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'packages', key: 'package_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      sale_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      nights_remaining: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      nights_per_year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      discount_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      net_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      payment_mode: {
        type: Sequelize.ENUM('CASH', 'CHEQUE', 'ONLINE', 'BANK_TRANSFER', 'CARD'),
        allowNull: false,
      },
      down_payment: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      outstanding_balance: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      sales_consultant_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      take_over_manager_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      dsa: {
        type: Sequelize.ENUM('VENUE', 'CSDO', 'OTHER'),
        allowNull: true,
        defaultValue: null,
      },
      reference_by: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'SUSPENDED', 'EXPIRED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      cancellation_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('memberships', ['client_id'], { name: 'memberships_client_id_idx' });
    await queryInterface.addIndex('memberships', ['package_id'], { name: 'memberships_package_id_idx' });
    await queryInterface.addIndex('memberships', ['status'], { name: 'memberships_status_idx' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('memberships');
  },
};
