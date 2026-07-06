'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoices', {
      invoice_id:     { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      invoice_no:     { type: Sequelize.STRING(50), allowNull: false },
      invoice_type:   { type: Sequelize.ENUM('invoice', 'tax'), allowNull: false, defaultValue: 'invoice' },
      client_id:      { type: Sequelize.INTEGER, allowNull: false,
                        references: { model: 'clients', key: 'client_id' },
                        onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      client_name:    { type: Sequelize.STRING(200), allowNull: false },
      card_number:    { type: Sequelize.STRING(50), allowNull: false, defaultValue: '' },
      email:          { type: Sequelize.STRING(200), allowNull: false },
      phone:          { type: Sequelize.STRING(50), allowNull: false, defaultValue: '' },
      address:        { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
      state:          { type: Sequelize.STRING(100), allowNull: false, defaultValue: '' },
      client_gst:     { type: Sequelize.STRING(50), allowNull: true },
      payment_mode:   { type: Sequelize.STRING(30), allowNull: false, defaultValue: 'CASH' },
      payment_type:   { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'Cash' },
      transaction_id: { type: Sequelize.STRING(100), allowNull: false, defaultValue: '' },
      bank:           { type: Sequelize.STRING(100), allowNull: false, defaultValue: '' },
      card_cheque_no: { type: Sequelize.STRING(100), allowNull: false, defaultValue: '' },
      amount:         { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      description:    { type: Sequelize.TEXT, allowNull: false, defaultValue: 'Holiday Package (Sheet Attached For Details)' },
      issue_date:     { type: Sequelize.DATEONLY, allowNull: false },
      created_by:     { type: Sequelize.INTEGER, allowNull: true },
      created_at:     { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at:     { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at:     { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.addIndex('invoices', ['client_id'],   { name: 'invoices_client_id_idx' });
    await queryInterface.addIndex('invoices', ['invoice_no'],  { name: 'invoices_invoice_no_idx' });
    await queryInterface.addIndex('invoices', ['created_at'],  { name: 'invoices_created_at_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('invoices');
  },
};
