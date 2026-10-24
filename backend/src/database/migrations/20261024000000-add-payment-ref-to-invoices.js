'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Which payment an invoice was issued for ("payment:<id>" or "amc:<id>"); null for manual invoices.
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('invoices', 'payment_ref', {
      type: Sequelize.STRING(40),
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addIndex('invoices', ['payment_ref'], { name: 'invoices_payment_ref_idx' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('invoices', 'invoices_payment_ref_idx');
    await queryInterface.removeColumn('invoices', 'payment_ref');
  },
};
