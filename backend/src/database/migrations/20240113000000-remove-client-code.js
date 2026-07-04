'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Drop unique index first (ignore if already gone)
    await queryInterface.sequelize.query(
      'ALTER TABLE clients DROP INDEX clients_client_code'
    ).catch(() => {});
    // Drop the column directly via raw SQL to avoid Sequelize's FK inspection logic
    await queryInterface.sequelize.query(
      'ALTER TABLE clients DROP COLUMN IF EXISTS client_code'
    ).catch(() => {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('clients', 'client_code', {
      type: Sequelize.STRING(20),
      allowNull: true,
      unique: true,
      after: 'client_id',
    });
  },
};
