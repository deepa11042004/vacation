'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('clients', 'sales_consultant', {
      type: Sequelize.STRING(100),
      allowNull: true,
      after: 'status',
    });

    await queryInterface.addColumn('clients', 'take_over_manager', {
      type: Sequelize.STRING(100),
      allowNull: true,
      after: 'sales_consultant',
    });

    await queryInterface.addColumn('clients', 'dsa', {
      type: Sequelize.ENUM('VENUE', 'CSDO', 'OTHER'),
      allowNull: true,
      defaultValue: null,
      after: 'take_over_manager',
    });

    await queryInterface.addColumn('clients', 'reference_by', {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
      after: 'dsa',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('clients', 'reference_by');
    await queryInterface.removeColumn('clients', 'dsa');
    await queryInterface.removeColumn('clients', 'take_over_manager');
    await queryInterface.removeColumn('clients', 'sales_consultant');
  },
};
