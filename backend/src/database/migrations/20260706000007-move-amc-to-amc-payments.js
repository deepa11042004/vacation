'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add amount column to amc_payments
    await queryInterface.addColumn('amc_payments', 'amount', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: null,
      after: 'year_number',
    });

    // Remove amc column from memberships
    await queryInterface.removeColumn('memberships', 'amc');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('amc_payments', 'amount');

    await queryInterface.addColumn('memberships', 'amc', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: null,
    });
  },
};
