'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add free-text sales fields to memberships
    await queryInterface.addColumn('memberships', 'sales_consultant', {
      type: Sequelize.STRING(100), allowNull: true, defaultValue: null, after: 'take_over_manager_id',
    });
    await queryInterface.addColumn('memberships', 'take_over_manager', {
      type: Sequelize.STRING(100), allowNull: true, defaultValue: null, after: 'sales_consultant',
    });

    // Remove duplicated fields from clients
    await queryInterface.removeColumn('clients', 'sales_consultant');
    await queryInterface.removeColumn('clients', 'take_over_manager');
    await queryInterface.removeColumn('clients', 'dsa');
    await queryInterface.removeColumn('clients', 'reference_by');
    await queryInterface.removeColumn('clients', 'remarks');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('clients', 'sales_consultant',  { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn('clients', 'take_over_manager', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn('clients', 'dsa',              { type: Sequelize.ENUM('VENUE','CSDO','OTHER'), allowNull: true });
    await queryInterface.addColumn('clients', 'reference_by',     { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn('clients', 'remarks',          { type: Sequelize.TEXT, allowNull: true });

    await queryInterface.removeColumn('memberships', 'sales_consultant');
    await queryInterface.removeColumn('memberships', 'take_over_manager');
  },
};
