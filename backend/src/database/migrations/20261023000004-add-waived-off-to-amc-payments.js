'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // A waived-off year is not received and not due: no payment date/mode, excluded from totals.
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('amc_payments', 'is_waived_off', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: 'is_received',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('amc_payments', 'is_waived_off');
  },
};
