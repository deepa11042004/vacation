'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Cancelled and soft-deleted rows keep their number, so uniqueness covers every row in the table.
  async up(queryInterface) {
    await queryInterface.removeIndex('invoices', 'invoices_invoice_no_idx');
    await queryInterface.addIndex('invoices', ['invoice_no'], { name: 'invoices_invoice_no_unique', unique: true });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('invoices', 'invoices_invoice_no_unique');
    await queryInterface.addIndex('invoices', ['invoice_no'], { name: 'invoices_invoice_no_idx' });
  },
};
