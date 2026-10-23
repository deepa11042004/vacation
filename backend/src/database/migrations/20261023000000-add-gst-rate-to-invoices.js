'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('invoices', 'gst_rate', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: null,
      after: 'client_gst',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('invoices', 'gst_rate');
  },
};
