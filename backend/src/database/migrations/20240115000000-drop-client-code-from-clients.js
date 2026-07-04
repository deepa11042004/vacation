'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const tableDesc = await queryInterface.describeTable('clients');
    if (!tableDesc.client_code) return; // already gone

    // Drop unique index first (ignore if missing)
    await queryInterface.sequelize.query(
      'ALTER TABLE clients DROP INDEX clients_client_code'
    ).catch(() => {});

    await queryInterface.sequelize.query(
      'ALTER TABLE clients DROP COLUMN client_code'
    );
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
